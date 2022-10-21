$(function () {

    const swiper = new Swiper('.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        observes: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    //Хеадер
    //Выпадающее меню
    const btnMenu = document.querySelector('.menu__btn');
    const menu = document.querySelector('.drop');
    const toggleMenu = function () {
        menu.classList.toggle('drop--active');
        document.querySelector('.menu__btn').classList.toggle('menu__btn--active');
    }

    btnMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function (e) {
        const target = e.target;
        const its_menu = target == menu || menu.contains(target);
        const its_btnMenu = target == btnMenu;
        const menu_is_active = menu.classList.contains('drop--active');

        if (!its_menu && !its_btnMenu && menu_is_active) {
            toggleMenu();
        }
    });

    $('.drop__link').on('click', function () {
        $('.drop').removeClass('drop--active');
        $('.menu__btn').removeClass('menu__btn--active');
    });

    //Мобильное меню
    $('.burger').on('click', function () {
        $(this).toggleClass('burger--active');
        $('.menu').toggleClass('menu--active');
        $('body').toggleClass('lock');
    });

    $('.menu__link, .header__logo, .drop__link').on("click", function () {
        $('.menu').removeClass('menu--active');
        $('.burger').removeClass('burger--active');
        $('body').removeClass('lock');
    })

    //Главный слайдер
    $('.main-slider__items').slick({
        dots: true,
        infinite: false,
        arrows: true,
        prevArrow: '<button type="button" class="main-slider__arrow main-slider__arrow--prev"><svg class="main-slider__icon"><use xlink:href="../img/sprite.svg#arrow-left-icon"></use></svg></button>',
        nextArrow: '<button type="button" class="main-slider__arrow main-slider__arrow--next"><svg class="main-slider__icon"><use xlink:href="../img/sprite.svg#arrow-right-icon"></use></svg></button>',
    });

    //Галерея
    //Показ
    $('.gallery__button').on('click', function () {
        $('.gallery__noshow').addClass('gallery__noshow--active');
        $('.gallery__button').addClass('gallery__button--active');
    });

    $('.filter__btn').on('click', function () {
        $('.gallery__noshow').removeClass('gallery__noshow--active');
        $('.filter__btn').removeClass('filter__btn--active')
        $('.gallery__button').removeClass('gallery__button--active');
    });

    //Mixitup
    var mixer__show = mixitup('.gallery__show', {
        load: {
            filter: '.category-cup'
        }
    });

    var mixer__noshow = mixitup('.gallery__noshow', {
        load: {
            filter: '.category-cup'
        }
    });

    //Формы
    const servicesTitle = document.querySelectorAll('.services-top__headding');
    servicesTitle.forEach(item => {
        item.addEventListener('click', () => {
            item.closest('.services__item').classList.toggle('services__item--active');
        });
    });

    const servicesLink = document.querySelectorAll('.services-top__link, .services-top__href');
    servicesLink.forEach(item => {
        item.addEventListener('click', () => {
            item.closest('.services__item').classList.remove('services__item--active');
        });
    });

    $('.form__select, .form__number').styler();

    //Air Datepicker
    $('.form__input--calendar').datepicker({
        minDate: new Date(),
        dateFormat: "dd, MM",
        onSelect(fomattedDate, date, inst) {
            inst.hide();
        },
        clearButton: true,
    });

    //Табы
    $('.services-professional .services-tabs__link').on('click', function (e) {
        e.preventDefault();
        $('.services-professional .services-tabs__link').removeClass('services-tabs__link--active');
        $(this).addClass('services-tabs__link--active');

        $('.services-professional .services-tabs__body').removeClass('services-tabs__body--active');
        $($(this).attr('href')).addClass('services-tabs__body--active');
    });

    $('.services-classes .services-tabs__link').on('click', function (e) {
        e.preventDefault();
        $('.services-classes .services-tabs__link').removeClass('services-tabs__link--active');
        $(this).addClass('services-tabs__link--active');

        $('.services-classes .services-tabs__body').removeClass('services-tabs__body--active');
        $($(this).attr('href')).addClass('services-tabs__body--active');
    });

    $('.services-walks .services-tabs__link').on('click', function (e) {
        e.preventDefault();
        $('.services-walks .services-tabs__link').removeClass('services-tabs__link--active');
        $(this).addClass('services-tabs__link--active');

        $('.services-walks .services-tabs__body').removeClass('services-tabs__body--active');
        $($(this).attr('href')).addClass('services-tabs__body--active');
    });

    //Валидация
    const form = document.querySelectorAll('.form');
    form.forEach(item => {
        item.addEventListener('submit', function (e) {
            e.preventDefault();
            let error = formValidate(item);

            if (error === 0) {
                document.querySelector('.popup-success').classList.add('popup-success--active');
                document.querySelector('.popup-error').classList.remove('popup-error--active');
                document.querySelector('body').classList.add('lock');

                document.querySelector('.popup__button--success').onclick = function () {
                    document.querySelector('.popup-success').classList.remove('popup-success--active');
                    document.querySelector('body').classList.remove('lock');
                };
            }

            //Не все заполнено
            else {
                document.querySelector('.popup-success').classList.remove('popup-success--active');
                document.querySelector('.popup-error').classList.add('popup-error--active');
                document.querySelector('body').classList.add('lock');

                document.querySelector('.popup__button--error').onclick = function () {
                    document.querySelector('.popup-error').classList.remove('popup-error--active');
                    document.querySelector('body').classList.remove('lock');
                };
            };

        });
    });

    const FormBtn = document.querySelectorAll('.form .button');
    FormBtn.forEach(item => {
        item.addEventListener('click', () => {
            item.parentNode.classList.add('form--active');
        });
    });

    function formValidate(item) {
        let error = 0;
        let formReq = document.querySelectorAll('.form--active .req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        };

        return error;
    };

    function formAddError(input) {
        input.parentElement.classList.add('form__error-item');
        input.classList.add('form__error');
    };

    function formRemoveError(input) {
        input.parentElement.classList.remove('form__error-item');
        input.classList.remove('form__error');
    };

    function emailTest(input) {
        return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value);
    }

    //Отзывы 
    $('.reviews__items').slick({
        infinite: false,
        dots: false,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button type="button" class="reviews__arrow reviews__arrow--prev"><svg class="reviews__icon"><use xlink:href="../img/sprite.svg#arrow-left-icon"></use></svg></button>',
        nextArrow: '<button type="button" class="reviews__arrow reviews__arrow--next"><svg class="reviews__icon"><use xlink:href="../img/sprite.svg#arrow-right-icon"></use></svg></button>',
        responsive: [{
                breakpoint: 1220,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]

    });

    $('.form-rating__button').on('click', function () {
        if ($('.form-rating__check:checkbox').filter(':checked').length == 0) {
            $('.form-rating').addClass('form__error-item');
        } else {
            $('.form-rating').removeClass('form__error-item');
        }
    });

    //Слайдер в услугах
    $('.services-slider').slick({
        infinite: false,
        arrows: true,
        dots: true,
        speed: 600,
        easing: 'ease',
    });

    //Читать дальше
    const reviewButtons = document.querySelectorAll('.review-card__btn');
    reviewButtons.forEach(item => {
        item.addEventListener('click', () => {
            item.previousElementSibling.classList.toggle('review-card__content--active');
        });
    });

    //Рейтинг
    $('.review-card__rating').rateYo({
        starWidth: '20px',
        normalFill: '#F5B437',
        ratedFill: '#F4F4F4',
        readOnly: true,
        spacing: '10px',
        starSvg: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d = "M19.9478 7.55776C19.8169 7.13517 19.4577 6.83502 19.0327 6.79506L13.2602 6.24811L10.9776 0.673057C10.8093 0.264478 10.426 0 10.0001 0C9.5742 0 9.19089 0.264478 9.02258 0.674012L6.73996 6.24811L0.966512 6.79506C0.542308 6.83598 0.184023 7.13517 0.0523364 7.55776C-0.0793501 7.98035 0.0422653 8.44386 0.363165 8.73605L4.72652 12.7292L3.43987 18.6434C3.34572 19.0782 3.50747 19.5277 3.85324 19.7885C4.03909 19.9287 4.25654 20 4.47581 20C4.66487 20 4.85241 19.9468 5.02072 19.8417L10.0001 16.7363L14.9776 19.8417C15.3419 20.0704 15.801 20.0495 16.146 19.7885C16.4919 19.5269 16.6535 19.0773 16.5594 18.6434L15.2727 12.7292L19.6361 8.73684C19.957 8.44386 20.0795 7.98115 19.9478 7.55776Z"fill="#F5B437"/></svg>'
    });

    //Вопросы
    const question = document.querySelectorAll('.question__top');
    question.forEach(item => {
        item.addEventListener('click', () => {
            item.nextElementSibling.classList.toggle('question__answer--active');
            item.classList.toggle('question__top--active');
        });
    });

    //Скрол
    $('.main-slider__link, .services-top__link, .logo, .services-top__href').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top - 70;
        $('body, html').animate({
            scrollTop: top
        }, 1500);
    });

    $('.menu__link').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top - 50;
        $('body, html').animate({
            scrollTop: top
        }, 1500);
    });

    $('.drop__link').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top - 85;
        $('body, html').animate({
            scrollTop: top
        }, 1500);
    });
});