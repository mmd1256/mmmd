// کلاس مدیریت سبد خرید
class CartManager {
    constructor() {
        this.items = [];
        this.total = 0;
        this.discount = 0;
        this.shipping = 0;
        this.init();
    }

    init() {
        // بازیابی سبد خرید از localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCart();
        }

        // اضافه کردن event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // مدیریت تغییر تعداد محصولات
        document.querySelectorAll('.quantity-selector').forEach(selector => {
            const input = selector.querySelector('input');
            const minusBtn = selector.querySelector('.minus');
            const plusBtn = selector.querySelector('.plus');
            const productId = selector.closest('.cart-item').dataset.id;

            minusBtn.addEventListener('click', () => this.decreaseQuantity(productId));
            plusBtn.addEventListener('click', () => this.increaseQuantity(productId));
            input.addEventListener('change', (e) => this.updateItemQuantity(productId, e.target.value));
        });

        // دکمه‌های حذف محصول
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(productId);
            });
        });

        // اعمال کد تخفیف
        const couponForm = document.querySelector('.coupon');
        if (couponForm) {
            couponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyCoupon(couponForm.querySelector('input').value);
            });
        }

        // بروزرسانی سبد خرید
        const updateCartBtn = document.querySelector('.update-cart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', () => this.updateCart());
        }

        // ادامه فرآیند خرید
        const checkoutBtn = document.querySelector('.checkout-button');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity < 10) {
            item.quantity++;
            this.updateCart();
        }
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.updateCart();
        }
    }

    updateItemQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            quantity = parseInt(quantity);
            if (quantity >= 1 && quantity <= 10) {
                item.quantity = quantity;
                this.updateCart();
            }
        }
    }

    removeItem(productId) {
        const confirmDelete = confirm('آیا از حذف این محصول اطمینان دارید؟');
        if (confirmDelete) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateCart();
            
            // حذف المان از DOM
            const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (itemElement) {
                itemElement.remove();
            }
        }
    }

    async applyCoupon(code) {
        try {
            const response = await fetch('/api/apply-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.success) {
                this.discount = data.discount;
                this.updateCart();
                this.showNotification('کد تخفیف با موفقیت اعمال شد');
            } else {
                this.showNotification('کد تخفیف نامعتبر است', 'error');
            }
        } catch (error) {
            console.error('خطا در اعمال کد تخفیف:', error);
            this.showNotification('خطا در اعمال کد تخفیف', 'error');
        }
    }

    updateCart() {
        // محاسبه مجموع قیمت
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // محاسبه هزینه ارسال
        this.shipping = this.total > 500000 ? 0 : 30000;

        // بروزرسانی نمایش قیمت‌ها
        this.updatePriceDisplays();

        // ذخیره در localStorage
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updatePriceDisplays() {
        // بروزرسانی قیمت‌های هر محصول
        this.items.forEach(item => {
            const itemRow = document.querySelector(`.cart-item[data-id="${item.id}"]`);
            if (itemRow) {
                const subtotal = item.price * item.quantity;
                itemRow.querySelector('.product-subtotal').textContent = this.formatPrice(subtotal);
            }
        });

        // بروزرسانی خلاصه سفارش
        document.querySelector('.summary-row .subtotal').textContent = this.formatPrice(this.total);
        document.querySelector('.summary-row .shipping').textContent = this.shipping ? this.formatPrice(this.shipping) : 'رایگان';
        document.querySelector('.summary-row .discount').textContent = this.formatPrice(this.discount);
        document.querySelector('.summary-row.total .amount').textContent = this.formatPrice(this.total + this.shipping - this.discount);
    }

    formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    proceedToCheckout() {
        // بررسی موجود بودن محصولات در سبد خرید
        if (this.items.length === 0) {
            this.showNotification('سبد خرید شما خالی است', 'error');
            return;
        }

        // بررسی انتخاب رنگ و سایز برای همه محصولات
        const hasInvalidItems = this.items.some(item => !item.color || !item.size);
        if (hasInvalidItems) {
            this.showNotification('لطفاً رنگ و سایز همه محصولات را انتخاب کنید', 'error');
            return;
        }

        // انتقال به صفحه پرداخت
        window.location.href = '/checkout';
    }
}

// راه‌اندازی مدیریت سبد خرید
document.addEventListener('DOMContentLoaded', () => {
    const cart = new CartManager();
});
