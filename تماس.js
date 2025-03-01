document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formErrors = document.getElementById('formErrors');
    const submitButton = document.getElementById('submitButton') || contactForm.querySelector('button[type="submit"]');
    const formFields = contactForm.querySelectorAll('input, textarea');
    const formStatus = document.createElement('div');
    formStatus.className = 'form-status';
    contactForm.appendChild(formStatus);
    
    // اضافه کردن نشانگر بارگذاری
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>در حال ارسال...</p>';
    loadingIndicator.style.display = 'none';
    contactForm.appendChild(loadingIndicator);
    
    // اعتبارسنجی شماره تلفن
    function validatePhone(phone) {
        // پشتیبانی از فرمت‌های مختلف شماره تلفن ایرانی
        const phoneRegex = /^(09|\+989|00989)\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    // اعتبارسنجی ایمیل با پشتیبانی بهتر
    function validateEmail(email) {
        // الگوی بهبود یافته برای اعتبارسنجی ایمیل
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    }
    
    // اعتبارسنجی طول متن
    function validateLength(text, min, max) {
        const length = text.length;
        return length >= min && (max === null || length <= max);
    }
    
    // نمایش خطاها با انیمیشن
    function showErrors(errors) {
        formErrors.innerHTML = '';
        formErrors.classList.add('show');
        
        const errorList = document.createElement('ul');
        errors.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            // اضافه کردن با تأخیر برای ایجاد انیمیشن
            setTimeout(() => {
                listItem.classList.add('visible');
            }, 10);
            errorList.appendChild(listItem);
        });
        
        formErrors.appendChild(errorList);
        
        // اسکرول به بالای فرم برای دیدن خطاها
        formErrors.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // پاک کردن خطاها
    function clearErrors() {
        formErrors.innerHTML = '';
        formErrors.classList.remove('show');
    }
    
    // نمایش پیام موفقیت
    function showSuccess(message) {
        formStatus.innerHTML = '';
        formStatus.classList.remove('error');
        formStatus.classList.add('success', 'show');
        formStatus.textContent = message;
        
        // مخفی کردن پیام موفقیت بعد از مدتی
        setTimeout(() => {
            formStatus.classList.remove('show');
        }, 5000);
    }
    
    // نمایش پیام خطا
    function showError(message) {
        formStatus.innerHTML = '';
        formStatus.classList.remove('success');
        formStatus.classList.add('error', 'show');
        formStatus.textContent = message;
    }
    
    // غیرفعال کردن دکمه ارسال
    function disableSubmitButton() {
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'در حال ارسال...';
    }
    
    // فعال کردن دکمه ارسال
    function enableSubmitButton() {
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
        if (submitButton.dataset.originalText) {
            submitButton.textContent = submitButton.dataset.originalText;
        }
    }
    
    // نمایش نشانگر بارگذاری
    function showLoading() {
        loadingIndicator.style.display = 'flex';
    }
    
    // مخفی کردن نشانگر بارگذاری
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    // اعتبارسنجی فیلدها هنگام تایپ
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            validateField(this);
        });
        
        field.addEventListener('blur', function() {
            validateField(this, true);
        });
    });
    
    // اعتبارسنجی یک فیلد خاص
    function validateField(field, showError = false) {
        const fieldName = field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // حذف کلاس‌های خطا از قبل
        field.classList.remove('invalid', 'valid');
        
        // بررسی نوع فیلد و اعتبارسنجی مناسب
        switch(fieldName) {
            case 'fullname':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'لطفاً نام و نام خانوادگی خود را وارد کنید';
                } else if (!validateLength(value, 3, 50)) {
                    isValid = false;
                    errorMessage = 'نام باید بین 3 تا 50 کاراکتر باشد';
                }
                break;
                
            case 'phone':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'لطفاً شماره تماس خود را وارد کنید';
                } else if (!validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'لطفاً یک شماره تماس معتبر وارد کنید';
                }
                break;
                
            case 'email':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'لطفاً ایمیل خود را وارد کنید';
                } else if (!validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'لطفاً یک ایمیل معتبر وارد کنید';
                }
                break;
                
            case 'subject':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'لطفاً موضوع پیام خود را وارد کنید';
                } else if (!validateLength(value, 5, 100)) {
                    isValid = false;
                    errorMessage = 'موضوع باید بین 5 تا 100 کاراکتر باشد';
                }
                break;
                
            case 'message':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'لطفاً پیام خود را وارد کنید';
                } else if (!validateLength(value, 20, 1000)) {
                    isValid = false;
                    errorMessage = 'پیام باید بین 20 تا 1000 کاراکتر باشد';
                }
                break;
        }
        
        // نمایش وضعیت اعتبارسنجی
        if (isValid) {
            field.classList.add('valid');
            
            // حذف پیام خطای قبلی
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        } else if (showError) {
            field.classList.add('invalid');
            
            // نمایش پیام خطا زیر فیلد
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    // شمارش کاراکترهای پیام
    const messageField = document.getElementById('message');
    if (messageField) {
        const counterElement = document.createElement('div');
        counterElement.className = 'character-counter';
        messageField.parentNode.appendChild(counterElement);
        
        messageField.addEventListener('input', function() {
            const maxLength = 1000;
            const currentLength = this.value.length;
            const remaining = maxLength - currentLength;
            
            counterElement.textContent = `${currentLength} / ${maxLength} کاراکتر`;
            
            if (remaining < 50) {
                counterElement.classList.add('warning');
            } else {
                counterElement.classList.remove('warning');
            }
        });
        
        // فراخوانی اولیه برای نمایش وضعیت
        messageField.dispatchEvent(new Event('input'));
    }
    
    // ارسال فرم با استفاده از Fetch API
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const privacy = document.getElementById('privacy').checked;
        
        const errors = [];
        
        // بررسی فیلدهای اجباری با اعتبارسنجی پیشرفته
        if (!fullname) {
            errors.push('لطفاً نام و نام خانوادگی خود را وارد کنید');
        } else if (!validateLength(fullname, 3, 50)) {
            errors.push('نام باید بین 3 تا 50 کاراکتر باشد');
        }
        
        if (!phone) {
            errors.push('لطفاً شماره تماس خود را وارد کنید');
        } else if (!validatePhone(phone)) {
            errors.push('لطفاً یک شماره تماس معتبر وارد کنید');
        }
        
        if (!email) {
            errors.push('لطفاً ایمیل خود را وارد کنید');
        } else if (!validateEmail(email)) {
            errors.push('لطفاً یک ایمیل معتبر وارد کنید');
        }
        
        if (!subject) {
            errors.push('لطفاً موضوع پیام خود را وارد کنید');
        } else if (!validateLength(subject, 5, 100)) {
            errors.push('موضوع باید بین 5 تا 100 کاراکتر باشد');
        }
        
        if (!message) {
            errors.push('لطفاً پیام خود را وارد کنید');
        } else if (!validateLength(message, 20, 1000)) {
            errors.push('پیام باید بین 20 تا 1000 کاراکتر باشد');
        }
        
        if (!privacy) {
            errors.push('لطفاً با قوانین حریم خصوصی موافقت کنید');
        }
        
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }
        
        // نمایش وضعیت بارگذاری
        disableSubmitButton();
        showLoading();
        
        // جلوگیری از ارسال چندباره فرم
        if (contactForm.dataset.submitting === 'true') {
            return;
        }
        contactForm.dataset.submitting = 'true';
        
        // ارسال فرم با استفاده از Fetch API
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCSRFToken() // اگر از CSRF استفاده می‌کنید
            },
            body: JSON.stringify({
                fullname,
                phone,
                email,
                subject,
                message,
                privacy: privacy ? 'accepted' : 'declined'
            })
        })
        .then(response => {
            contactForm.dataset.submitting = 'false';
            
            if (!response.ok) {
                throw new Error(`خطای سرور: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            enableSubmitButton();
            showSuccess('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
            contactForm.reset();
            
            // پاک کردن کلاس‌های اعتبارسنجی
            formFields.forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
            // به‌روزرسانی شمارنده کاراکتر
            if (messageField) {
                messageField.dispatchEvent(new Event('input'));
            }
            
            // اسکرول به بالای فرم
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoading();
            enableSubmitButton();
            showError('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
            contactForm.dataset.submitting = 'false';
        });
    });
    
    // دریافت توکن CSRF (اگر از آن استفاده می‌کنید)
    function getCSRFToken() {
        const tokenElement = document.querySelector('meta[name="csrf-token"]');
        return tokenElement ? tokenElement.getAttribute('content') : '';
    }
    
    // اضافه کردن قابلیت پیش‌نمایش فرم
    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.className = 'preview-button';
    previewButton.textContent = 'پیش‌نمایش پیام';
    previewButton.addEventListener('click', function() {
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!fullname || !email || !subject || !message) {
            showError('لطفاً تمام فیلدهای ضروری را پر کنید تا بتوانید پیش‌نمایش را مشاهده کنید.');
            return;
        }
        
        const previewModal = document.createElement('div');
        previewModal.className = 'preview-modal';
        previewModal.innerHTML = `
            <div class="preview-content">
                <span class="close-preview">&times;</span>
                <h3>پیش‌نمایش پیام</h3>
                <div class="preview-item">
                    <strong>نام و نام خانوادگی:</strong>
                    <p>${escapeHTML(fullname)}</p>
                </div>
                <div class="preview-item">
                    <strong>ایمیل:</strong>
                    <p>${escapeHTML(email)}</p>
                </div>
                <div class="preview-item">
                    <strong>موضوع:</strong>
                    <p>${escapeHTML(subject)}</p>
                </div>
                <div class="preview-item">
                    <strong>پیام:</strong>
                    <p class="message-preview">${escapeHTML(message).replace(/\n/g, '<br>')}</p>
                </div>
                <button class="close-preview-button">بستن</button>
            </div>
        `;
        
        document.body.appendChild(previewModal);
        
        // نمایش مدال با انیمیشن
        setTimeout(() => {
            previewModal.classList.add('show');
        }, 10);
        
        // بستن مدال
        const closeButtons = previewModal.querySelectorAll('.close-preview, .close-preview-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                previewModal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(previewModal);
                }, 300);
            });
        });
        
        // بستن با کلیک خارج از محتوا
        previewModal.addEventListener('click', function(e) {
            if (e.target === previewModal) {
                previewModal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(previewModal);
                }, 300);
            }
        });
    });
    
    // اضافه کردن دکمه پیش‌نمایش قبل از دکمه ارسال
    if (submitButton && submitButton.parentNode) {
        submitButton.parentNode.insertBefore(previewButton, submitButton);
    }
    
    // تابع محافظت در برابر XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // اضافه کردن استایل‌های CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .form-status {
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
            font-weight: bold;
        }
        
        .form-status.show {
            display: block;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .form-status.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .form-status.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .field-error {
            color: #dc3545;
            font-size: 0.85em;
            margin-top: 5px;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        input.valid, textarea.valid {
            border-color: #28a745 !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
            padding-right: calc(1.5em + 0.75rem) !important;
        }
        
        input.invalid, textarea.invalid {
            border-color: #dc3545 !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
            padding-right: calc(1.5em + 0.75rem) !important;
        }
        
        #formErrors {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
            border: 1px solid #f5c6cb;
        }
        
        #formErrors.show {
            display: block;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        #formErrors ul {
            margin: 0;
            padding-right: 20px;
        }
        
        #formErrors li {
            margin-bottom: 5px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        #formErrors li.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 10;
            border-radius: 4px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #007bff;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .character-counter {
            text-align: left;
            color: #6c757d;
            font-size: 0.85em;
            margin-top: 5px;
        }
        
        .character-counter.warning {
            color: #dc3545;
            font-weight: bold;
        }
        
        button.disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }
        
        .preview-button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        
        .preview-button:hover {
            background-color: #5a6268;
        }
        
        .preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .preview-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .preview-content {
            background-color: white;
            border-radius: 5px;
            padding: 20px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .preview-modal.show .preview-content {
            transform: translateY(0);
        }
        
        .close-preview {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #aaa;
        }
        
        .close-preview:hover {
            color: #333;
        }
        
        .preview-item {
            margin-bottom: 15px;
        }
        
        .preview-item strong {
            display: block;
            margin-bottom: 5px;
            color: #495057;
        }
        
        .message-preview {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
        }
        
        .close-preview-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .close-preview-button:hover {
            background-color: #0069d9;
        }
    `;
    document.head.appendChild(styleElement);
});
