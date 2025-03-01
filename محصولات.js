// // ===== تنظیمات ثابت =====
const CONFIG = {
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 3000,
    STORAGE_KEY: 'cart',
    CURRENCY: 'تومان',
    LOCALE: 'fa-IR',
    LAZY_LOADING: {
        rootMargin: '50px 0px',
        threshold: 0.1
    }
};

// ===== کلاس پایه برای مدیریت رویدادها =====
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;
        const callbacks = this.events.get(event).filter(cb => cb !== callback);
        this.events.set(event, callbacks);
    }

    emit(event, data) {
        if (!this.events.has(event)) return;
        this.events.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event ${event}:`, error);
            }
        });
    }
}

// ===== مدیریت محصولات =====
class ProductManager extends EventEmitter {
    constructor() {
        super();
        this.products = new Map();
        this.initializeProducts();
        this.setupLazyLoading();
        this.setupScrollAnimation();
    }

    initializeProducts() {
        document.querySelectorAll('.product').forEach(product => {
            const id = product.dataset.id;
            this.products.set(id, {
                element: product,
                data: this.extractProductData(product)
            });
            this.setupProductEvents(product);
        });
    }

    extractProductData(product) {
        return {
            id: product.dataset.id,
            name: product.dataset.name,
            price: parseInt(product.dataset.price),
            image: product.querySelector('img').src,
            oldPrice: product.dataset.oldPrice
        };
    }

    setupProductEvents(product) {
        const addToCartBtn = product.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productData = this.products.get(product.dataset.id).data;
                this.emit('addToCart', productData);
                this.animateButton(addToCartBtn);
            });
        }

        // انیمیشن hover
        product.addEventListener('mouseenter', () => {
            this.animateProductHover(product);
        });
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            },
            CONFIG.LAZY_LOADING
        );

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupScrollAnimation() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal');
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.products.forEach(({ element }) => {
            observer.observe(element);
        });
    }

    animateButton(button) {
        button.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });
    }

    animateProductHover(product) {
        product.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-5px)' }
        ], {
            duration: 300,
            fill: 'forwards',
            easing: 'ease-out'
        });
    }
}

// ===== مدیریت سبد خرید =====
class CartManager extends EventEmitter {
    constructor() {
        super();
        this.cart = this.loadCart();
        this.elements = this.getElements();
        this.bindEvents();
        this.updateCartDisplay();
    }

    getElements() {
        return {
            modal: document.querySelector('.cart-modal'),
            count: document.getElementById('cart-count'),
            items: document.getElementById('cart-items'),
            total: document.getElementById('total-price'),
            checkout: document.getElementById('checkout-button'),
            cartButton: document.getElementById('cart-button'),
            closeButton: document.querySelector('.close-cart')
        };
    }

    bindEvents() {
        this.elements.cartButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openCart();
        });

        this.elements.closeButton?.addEventListener('click', () => {
            this.closeCart();
        });

        this.elements.checkout?.addEventListener('click', () => {
            this.handleCheckout();
        });

        this.elements.items?.addEventListener('click', (e) => {
            this.handleItemClick(e);
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCart();
        });
    }

    handleItemClick(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const { id } = button.dataset;
        if (button.classList.contains('quantity-btn')) {
            const change = button.classList.contains('plus') ? 1 : -1;
            this.updateQuantity(id, change);
        } else if (button.classList.contains('remove-item')) {
            this.removeFromCart(id);
        }
    }
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
    window.cartManager = new CartManager();
});
