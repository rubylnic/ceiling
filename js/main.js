'use strict';
(function() {
  var accordeon = document.querySelector('.accordeon');
  var accordeonButton = document.querySelector('.accordeon__button');
  if (accordeon) {
    document.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('accordeon__button')) {
        evt.target.classList.toggle('accordeon__button--opened');
        evt.target.nextElementSibling.classList.toggle('accordeon__content--opened');
      }
    });
  };
})();
'use strict';
(function() {

  let initializeGallery = function() {
    let galleries = document.querySelectorAll('.lightgallery');
    for (let i = 0; i < galleries.length; i++) {
      lightGallery(galleries[i], {
        thumbnail: true,
        share: false,
        download: false,
      })
    }
  }

  setTimeout(initializeGallery, 0);

})();
//lazyload

  setTimeout(function() {
    lozad('.lazyload').observe();
    },0);


'use strict';
(function() {
  let yMap;
  const mapElement = document.querySelector('[data-map]');
  if (mapElement) {
    yMap = new YmapsInitializer(mapElement);
  }
})();
/*'use strict';
(function() {
  const tels = document.querySelectorAll('[type="tel"]');
  tels.forEach(tel => {
    if (tel) {
      var phoneMask = IMask(
        tel, {
          mask: '+{375}(00)000-00-00'
        });
    }
  });
})();*/
'use strict';
(function() {
  const header = document.querySelector('.header');
  const openBtn = document.querySelector('.open-menu');
  const nav = document.querySelector('.header__nav');
  const overlay = document.querySelector('.header ~ .overlay');
  const headerLogoContainer = document.querySelector('.header__logo-container');

  const animationSpeed = 300;

  let closing = false;

  var openCloseHandler = function(evt) {
    if (evt.target.closest('.open-menu')) {
      if (evt.target.closest('.open-menu').classList.contains('open')) {
        evt.preventDefault();
        closing = true;
        evt.target.classList.remove('open');

        nav.classList.remove('open');
        nav.classList.add('hidden');
        overlay.classList.add('hidden');
        nav.classList.add('on-hidden');
        headerLogoContainer.classList.remove('active');
        openBtn.classList.remove('open');
        setTimeout(function() {
          nav.classList.remove('on-hidden');
          closing = false;
        }, animationSpeed);
      } else {
        evt.preventDefault();
        headerLogoContainer.classList.add('active');
        nav.classList.remove('hidden');
        overlay.classList.remove('hidden');
        nav.classList.add('open');
        openBtn.classList.add('open');
      }

    }
  };


  openBtn.addEventListener('click', openCloseHandler);
  overlay.addEventListener('click', function() {
    this.classList.add('hidden');
    nav.classList.remove('open');
    nav.classList.add('hidden');
    headerLogoContainer.classList.remove('active');
    openBtn.classList.remove('open');

  });

})();
'use strict';
(function() {
  //кнопка открытия - <div><a href="#" class="(классы для стилей) open-modal" data-modal="1" и т.д. (data-modal="2" ...)></div>

  //сами модалки <section class="modal modal--closed" data-modal-content="1"> и т.д. (data-modal-сontent="2" (соответствует кнопке открытия))>
  var modal = document.querySelector('.modal');
  var modals = document.querySelectorAll('.modal');
  var header = document.querySelector('.header');
  if (modal) {
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;
    var btnOpen = document.querySelectorAll('.open-modal');
    var modals = document.querySelectorAll('.modal');
    var closeModals = document.querySelectorAll('.close-modal');
    closeModals.forEach(closeModal => closeModal.addEventListener('click', function(evt) {
      evt.target.closest('.modal').classList.add('modal--closed');

    }));

    var closeModal = function(modal) {
      modal.classList.add('modal--closed');
      modal.classList.remove('modal--active');
      if (header.classList.contains('header--zindex')) {
        header.classList.remove('header--zindex');
      }
    };
    var openModal = function(modal) {
      modals.forEach(modal => modal.classList.add('modal--closed'));
      modal.classList.remove('modal--closed');
      modal.classList.add('modal--active');

      modal.querySelector('.modal__close').addEventListener('click', function() {
        closeModal(modal)
      });

      //обработчик клика по оверлею

      modal.querySelector('.overlay').addEventListener('click', function() {

        closeModal(modal);
      });

      modal.querySelector('.modal__container').addEventListener('click', function(evt) {
        evt.stopPropagation();
      });

      //обработчик клика по ESC

      document.addEventListener('keydown', function(evt) {
        if (evt.key === ESC_KEYCODE) {
          closeModal(modal);
        };
      });
    };

    for (var i = 0; i < btnOpen.length; i++) {
      //клики по кнопкам открытия
      btnOpen[i].addEventListener("click", function(e) {
        // e.preventDefault();
        var activeModalAttr = this.getAttribute('data-modal');
        var modal = document.querySelector(`[data-modal-content = ${activeModalAttr}]`);
        if (this.nodeName == "INPUT") {
          const form = this.closest('form');
          form.addEventListener('submit', function() {
            openModal(modal);
          });
        } else {
          openModal(modal);
        }

      }, false);

      // открытие по Enter

      btnOpen[i].addEventListener("keydown", function(e) {
        if (e.key === ENTER_KEYCODE) {
          e.preventDefault();
          var activeModalAttr = this.getAttribute('data-modal');
          var modal = document.querySelector(`[data-modal-content = ${activeModalAttr}]`);
          openModal(modal);
        };
      });
    };


  };
})();
const bigNumber = document.querySelector('[data-big-number]');
const currentNumber = document.querySelector('[data-current-number]');
const allNumber = document.querySelector('[data-all-number]');
const quizForm = document.querySelector('[data-form]');
const nextButton = document.querySelector('[data-next]');
const prevButton = document.querySelector('[data-prev]');
const quizStepsContainer = document.querySelector('.quiz__steps');
const quizLeft = document.querySelector('.quiz__left');
const quizContainer = document.querySelector('.quiz__container');
const quizSteps = document.querySelectorAll('[data-step]')
const quizLine = document.querySelector('.quiz__line');
const quizProgress = document.querySelector('[data-progress]');
const quizButtons = document.querySelector('.quiz__buttons');
const quizLineWidth = quizLine.offsetWidth;

let currentCount = 1;

let progressWidth = (quizLineWidth / quizSteps.length) * currentCount;
quizProgress.style.width = progressWidth + 'px'

allNumber.textContent = quizSteps.length;

function set(count) {

  // убираем сообщение об ошибке
  const quizError = document.querySelector('.quiz__error');
  if (quizError) {
    quizError.parentElement.removeChild(quizError);
  }

  if (count > 0 && count < quizSteps.length) {
    quizSteps.forEach(step => {
      step.classList.add('hidden');
    })
  } else if (count <= 0) {
    count = 1;
    currentCount = count;
  } else {
    quizStepsContainer.parentElement.removeChild(quizStepsContainer);
    quizButtons.parentElement.removeChild(quizButtons);
    quizLeft.parentElement.removeChild(quizLeft);
    quizContainer.classList.add('last');
    quizSteps.forEach(step => {
      step.classList.add('hidden');
    })
    count = quizSteps.length;
    currentCount = count;
  }

  let progressWidth = (quizLineWidth / quizSteps.length) * count;
  quizProgress.style.width = progressWidth + 'px'
  let currentStep = document.querySelector(`[data-step="${count}"]`);
  currentStep.classList.remove('hidden');
  currentNumber.textContent = count;
  bigNumber.textContent = count;
}

function makeErrorMessage() {
  const message = document.createElement('p');
  message.classList.add('quiz__error');
  message.textContent = "Необходимо выбрать вариант или написать свой";
  return message;
}

function nextHandler() {
  if (validation(currentCount)) {
    currentCount += 1;
    set(currentCount)
  } else {
    const title = document.querySelector(`[data-step="${currentCount}"] .quiz__question`);
    if (!title.nextElementSibling.classList.contains('quiz__error')) {
      const message = makeErrorMessage();
      title.insertAdjacentElement('afterend', message);
    }
  }
}

function prevHandler() {
  currentCount -= 1;
  set(currentCount)
}

function validation(count) {
  let step = document.querySelector(`[data-step='${count}']`);
  let inputs = step.querySelectorAll('[type="radio"]');
  let textInput = step.querySelector('[type="text"]');

  let checked = 0;
  let toReturn;
  if (inputs.length > 0) {
    inputs.forEach(input => {
      if (input.checked) {
        checked += 1;
      }
    });
    if (!checked) {
      toReturn = false;
    } else {
      toReturn = true;
    }
  }

  if (textInput) {
    if (textInput.value == "") {
      toReturn = false;
    } else {
      toReturn = true;
    }
  }
  return toReturn;
}

nextButton.addEventListener('click', nextHandler);
prevButton.addEventListener('click', prevHandler);
document.addEventListener('DOMContentLoaded', () => {
  const url = 'mail.php';
  const modalResponse = document.querySelector('[data-modal-content="response"]');
  const modalTitle = modalResponse.querySelector('.title');
  const modalInfo = modalResponse.querySelector('.modal__info');

  const ajaxSend = async(formData) => {
      return fetch('/mail.php', { // файл-обработчик 
          method: 'POST',
          headers: {
              Accept: 'application/json','Content-Type': 'application/json', // отправляемые данные 
          },
          body: JSON.stringify(formData)
      })
      .then(response => {
          const form_subject = formData.formSubject;
          return form_subject;
      })
      .catch(error => console.error(error))
  };
  const forms = document.getElementsByTagName('form');
  for (let i = 0; i < forms.length; i++) {
      
      forms[i].addEventListener('submit', function (e) {
          e.preventDefault(); 
          let formData = new FormData(this);
          formData = Object.fromEntries(formData);
          ajaxSend(formData)
              .then((response) => {
                  dataLayer.push({'event': `${response}`});
                  this.reset(); // очищаем поля формы 
              })
              .catch((err) => {
                  modalTitle.textContent = "Ошибка!";
                  modalInfo.textContent = "";
                  console.error(err);
              })
      });
  };
});


'use strict';
const cardSliders = document.querySelectorAll('.card__slider');
const cardPreviews = document.querySelectorAll('.card__previews');
(function() {
  let mySwiper = new Swiper('.reviews__list', {
    slidesPerView: 1.3,
    loop: true,
    spaceBetween: 15,

    breakpoints: {
      650: {
        slidesPerView: 2.5,
        spaceBetween: 30,
      },

      1260: {
        slidesPerView: 3,
      }

    },
    pagination: {
      el: '.reviews .swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '.reviews-right',
      prevEl: '.reviews-left',
    },
  });


  function initializeGallery() {
    const certificatesContainer = document.querySelector('.works__container');
    const certificatesList = document.querySelector('.works__list');
    const certificateSlides = document.querySelectorAll('.works__item');
    if (window.matchMedia('(max-width: 899px)').matches) {
      certificatesContainer.classList.add('swiper-container');
      certificatesList.classList.add('swiper-wrapper');
      certificateSlides.forEach(slide => slide.classList.add('swiper-slide'));
      let reviews = new Swiper('.works__container', {
        slidesPerView: 1.3,
        loop: true,
        spaceBetween: 15,

        breakpoints: {
          400: {
            slidesPerView: 3.2,
          },
          600: {
            slidesPerView: 4.2,
          },
          800: {
            slidesPerView: 5,
          },
          1000: {
            slidesPerView: 6,
            spaceBetween: 30,
          },

        },
      });
    }
  }
  initializeGallery()
})();
cardPreviews.forEach(cardPreview => {
  const previewSwiper = new Swiper(cardPreview, {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: false,
    breakpoints: {
      500: {
        slidesPerView: 3,
      },
      700: {
        slidesPerView: 4,
      },

    }
  });
})
if (window.matchMedia('(max-width: 1069px)').matches) {
  cardSliders.forEach(cardSlider => {
    let cardSwiper = new Swiper(cardSlider, {
      slidesPerView: 1.2,
      spaceBetween: 15,
      loop: false,
    })
  })
}
if (window.matchMedia('(min-width: 1070px)').matches) {

  cardSliders.forEach((cardSlider, i) => {
    let previews = cardPreviews[i];
    let previewsSwiper = new Swiper(previews, {
      slidesPerView: 2,
      spaceBetween: 10,
      loop: false,
      breakpoints: {
        500: {
          slidesPerView: 3,
        },
        700: {
          slidesPerView: 4,
        },

      },
    });
    let cardSwiper = new Swiper(cardSlider, {
      slidesPerView: 1,
      loop: false,
      thumbs: {
        swiper: previewsSwiper,
      },
      on: {
        slideChange: function() {
          let activeIndex = this.activeIndex + 1;

          let activeSlide = document.querySelector(`.gallery-thumbs .swiper-slide:nth-child(${activeIndex})`);
          let nextSlide = document.querySelector(`.gallery-thumbs .swiper-slide:nth-child(${activeIndex + 1})`);
          let prevSlide = document.querySelector(`.gallery-thumbs .swiper-slide:nth-child(${activeIndex - 1})`);

          if (nextSlide && !nextSlide.classList.contains('swiper-slide-visible')) {
            this.thumbs.swiper.slideNext()
          } else if (prevSlide && !prevSlide.classList.contains('swiper-slide-visible')) {
            this.thumbs.swiper.slidePrev()
          }
        }
      }

    });
  })
}
let examplesSlider = new Swiper('.examples-slider', {
  slidesPerView: 1,
  loop: true,

  pagination: {
    el: '.examples .swiper-pagination',
    clickable: true
  },

  navigation: {
    nextEl: '.examples-right',
    prevEl: '.examples-left',
  },
});