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

bookFormTel.addEventListener('input', function() {
    console.log(bookMask.unmaskedValue);
    console.log(bookMask.unmaskedValue.length)
    console.log(bookFormTel.value);
    console.log(bookFormTel.value.length);
});

//красим svg при фокусе на input и проверяем на класс ошибки
const formInputs = document.querySelectorAll('.form-input');
Array.prototype.forEach.call(formInputs, input => {
    const parentDiv = input.parentNode;
    input.addEventListener('focus', function() {
        parentDiv.classList.add('icon-focused');
        if (input.classList.contains('js-form-input-error')) {
            input.classList.remove('js-form-input-error');
        }
    });
    input.addEventListener('blur', function() {
        if (parentDiv.classList.contains('icon-focused')) {
            parentDiv.classList.remove('icon-focused');
        }
    });
});


//обработка submit для обеих форм
const forms = document.querySelectorAll('.js-form');
Array.prototype.forEach.call(forms, form => {
    const inputName = form.querySelector('.js-input-name');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (form.classList.contains('js-header-form')) {
            if (typeof inputName.value === 'string' && inputName.value != '' && inputName.value.length >= 2 && headerMask.unmaskedValue.length === 11) {
                let order = {
                    name: inputName.value,
                    tel: headerMask.unmaskedValue
                };
                console.log(order);
                clearInput(form);
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
        } else if (form.classList.contains('js-book-form')){
            if (typeof inputName.value === 'string' && inputName.value != '' && inputName.value.length >= 2 && bookMask.unmaskedValue.length === 11){
                let order = {
                    name: inputName.value,
                    tel: bookMask.unmaskedValue
                };
                console.log(order);
                clearInput(form);
                showAndHideModal();
            } else {
                alert('Ошибка! Введите имя и номер телефона!');
                if (inputName.value === '' || inputName.value.length < 2) {
                    inputName.classList.add('js-form-input-error');
                }
                if (bookMask.unmaskedValue.length != 11) {
                    bookFormTel.classList.add('js-form-input-error');
                }
            }
        }
    });
});

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