'use strict';
window.addEventListener('DOMContentLoaded', function () {

    // Подключаем и настраиваем маску для ввода номера телефона
    const bookFormTel = document.querySelector('#book-form-tel');
    const headerFormTel = document.querySelector('#header-form-tel');
    const maskOptions = {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        overwrite: true
    };
    const bookMask = new IMask(bookFormTel, maskOptions);
    const headerMask = new IMask(headerFormTel, maskOptions);

    //выпадающий список и его обработка
    const dropDownBlock = document.querySelector('.js-persons');
    const dropDownAngle = dropDownBlock.querySelector('.js-dropdown-angle');
    const dropDownInput = dropDownBlock.querySelector('.js-dropdown-input');
    const dropDownIcon = dropDownBlock.querySelector('.js-form-icon');
    const dropDownList = document.querySelector('.js-dropdown-list');

    dropDownBlock.addEventListener('click', function (event) {
        const target = event.target;
        if (target == dropDownInput || target == dropDownIcon || target == dropDownAngle) {
            toggleDropdown();
        }
        const labels = dropDownBlock.querySelectorAll('.js-dropdown-label');
        Array.prototype.forEach.call(labels, label => {
            label.addEventListener('click', function () {
                dropDownInput.value = label.dataset.order;
                closeDropdown();
            });
        });
    });

    //закрытие выпадающего блока при клике вне него
    window.addEventListener('click', function (event) {
        const target = event.target;
        const itsDropdown = target == dropDownBlock || dropDownBlock.contains(target);
        if (!itsDropdown) {
            closeDropdown();
        }
    });

    //красим svg при фокусе на input и убираем класс ошибки и закрываем dropdown
    const formInputs = document.querySelectorAll('.form-input');
    Array.prototype.forEach.call(formInputs, input => {
        const parentDiv = input.parentNode;
        input.addEventListener('focus', function () {
            parentDiv.classList.add('icon-focused');
            closeDropdown();
            if (input.classList.contains('js-form-input-error')) {
                input.classList.remove('js-form-input-error');
            }
        });
        input.addEventListener('blur', function () {
            if (parentDiv.classList.contains('icon-focused')) {
                parentDiv.classList.remove('icon-focused');
            }
        });
    });

    //обработка submit для обеих форм
    const forms = document.querySelectorAll('.js-form');
    Array.prototype.forEach.call(forms, form => {
        const inputName = form.querySelector('.js-input-name');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (form.classList.contains('js-header-form')) {
                if (typeof inputName.value === 'string' && inputName.value != '' && inputName.value.length >= 2 && headerMask.unmaskedValue.length === 11) {
                    let order = {
                        name: inputName.value,
                        tel: headerMask.unmaskedValue
                    };
                    console.log(order);
                    clearInput(form);
                    headerMask.updateValue();
                    showAndHideModal();
                } else {
                    alert('Ошибка! Введите имя и номер телефона!');
                    if (inputName.value === '' || inputName.value.length < 2) {
                        inputName.classList.add('js-form-input-error');
                    }
                    if (headerMask.unmaskedValue.length != 11) {
                        headerFormTel.classList.add('js-form-input-error');
                    }
                }
            } else if (form.classList.contains('js-book-form')) {
                if (typeof inputName.value === 'string' && inputName.value != '' && inputName.value.length >= 2 && bookMask.unmaskedValue.length === 11 && typeof dropDownInput.value === 'string' && dropDownInput.value != '') {
                    let order = {
                        name: inputName.value,
                        tel: bookMask.unmaskedValue,
                        persons: dropDownInput.value
                    };
                    console.log(order);
                    clearInput(form);
                    bookMask.updateValue();
                    showAndHideModal();
                } else {
                    alert('Ошибка! Заполните все поля!');
                    if (inputName.value === '' || inputName.value.length < 2) {
                        inputName.classList.add('js-form-input-error');
                    }
                    if (bookMask.unmaskedValue.length != 11) {
                        bookFormTel.classList.add('js-form-input-error');
                    }
                    if (dropDownInput.value === '') {
                        dropDownInput.classList.add('js-form-input-error');
                    }
                }
            }
        });
    });

    //скролл до формы заказа при клике на кнопку "заказать"
    const scrollBtn = document.querySelector('.js-scroll-btn');
    scrollBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const anchorID = scrollBtn.getAttribute('href').substr(1);
        document.getElementById(anchorID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    //анимация при скролле страницы
    let isScrolling = false;
    const animatedItems = document.querySelectorAll('.tour-details__item');

    window.addEventListener('scroll', scrolling, false);

    function scrolling() {
        if (isScrolling === false) {
            window.requestAnimationFrame(function () {
                animateScrolling();
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    function animateScrolling() {
        Array.prototype.forEach.call(animatedItems, animatedItem => {
            if (isPartiallyVisible(animatedItem)) {
                animatedItem.classList.add('js-item-scrolling');
            }
        });
    }

    function isPartiallyVisible(el) {
        let elementBoundary = el.getBoundingClientRect();
        let top = elementBoundary.top;
        let bottom = elementBoundary.bottom;
        let height = elementBoundary.height;
        return ((top + height >= 0) && (height + window.innerHeight >= bottom));
    }


    function toggleDropdown() {
        if (dropDownList.classList.contains('js-hide')) {
            dropDownList.classList.remove('js-hide');
            dropDownList.classList.add('js-dropdown-focus');
            dropDownAngle.classList.add('js-angle-opened');
        } else {
            dropDownList.classList.add('js-hide');
            dropDownList.classList.remove('js-dropdown-focus');
            dropDownAngle.classList.remove('js-angle-opened');
        }
    }

    function closeDropdown() {
        if (!dropDownList.classList.contains('js-hide')) {
            dropDownList.classList.add('js-hide');
            dropDownList.classList.remove('js-dropdown-focus');
            dropDownAngle.classList.remove('js-angle-opened');
        }
    }

    function clearInput(form) {
        let inputs = form.querySelectorAll('.form-input');
        Array.prototype.forEach.call(inputs, input => {
            input.value = '';
        });
    }

    function showAndHideModal() {
        const modal = document.querySelector('.modal');
        const overlay = document.querySelector('.overlay');
        modal.classList.remove('js-hide');
        overlay.classList.remove('js-hide');
        let hideModal = () => {
            modal.classList.add('js-hide');
            overlay.classList.add('js-hide');
        };
        setTimeout(hideModal, 3000);
    }
});