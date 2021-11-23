'use strict';
$('.single-item').slick({
  infinite: true,
  dots: true,
  slidesToShow: 1,
});

// Отправка формы
var contactFormEl = $('.contact-form');
var contactFormStatusEl = contactFormEl.find('.contacts-form__status-message');
var emailInputEl = contactFormEl.find('[name = email]');
var phoneInputEl = contactFormEl.find('[name = phone]');
var validatedFields = { email: true, phone: true };
var mandatoryFields = ['name', 'phone'];

contactFormEl.submit(function (e) {
  e.preventDefault();
  var inputsFilled = mandatoryInputsFilled();
  if (inputsFilled && !contactFormHasError()) {
    $.post('mail.php', {
      name: contactFormEl.find('[name = name]').val(),
      email: contactFormEl.find('[name = email]').val(),
      tel: contactFormEl.find('[name = phone]').val(),
      message: contactFormEl.find('[name = comments]').val(),
    })
      .done(function () {
        contactFormStatusEl.text(
          "Дякуємо за заявку. Ми зв'яжемося з Вами найближчим часом.",
        );
        contactFormStatusEl.css('display', 'block');
        contactFormStatusEl.css('color', '#7aba41');
      })
      .fail(function () {
        contactFormStatusEl.text('Виникла помилка, спробуйте пізніше');
        contactFormStatusEl.css('display', 'block');
        contactFormStatusEl.css('color', 'red');
      })
      .always(function () {
        contactFormEl.find('input').each(function () {
          $(this).val('');
        });
      });
  } else if (!inputsFilled) {
    contactFormStatusEl.text("Обов'язкові поля мають бути заповнені");
    contactFormStatusEl.css('display', 'block');
    contactFormStatusEl.css('color', 'red');
  } else {
    contactFormStatusEl.css('display', 'none');
  }
});

emailInputEl.on('input', function () {
  var inputIsValid = validateContactFormInput(
    emailInputEl.val(),
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  handleInputChange(emailInputEl, inputIsValid);
});

phoneInputEl.on('input', function () {
  var inputIsValid = validatePhone(phoneInputEl.val());
  handleInputChange(phoneInputEl, inputIsValid);
});

function handleInputChange(el, isValid) {
  var inputType = el.attr('name');
  if (isValid || el.val() === '') {
    validatedFields[inputType] = true;
    el.next().css('display', 'none');
  } else {
    validatedFields[inputType] = false;
    el.next().css('display', 'block');
  }
  if (mandatoryInputsFilled()) contactFormStatusEl.css('display', 'none');
}

// Проверка полей

function contactFormHasError() {
  return Object.values(validatedFields).includes(false);
}

function validateContactFormInput(val, regex) {
  return regex.test(val);
}

function validatePhone(telNumber) {
  return (
    (telNumber.match('^\\+[\\(\\-]?(\\d[\\(\\)\\-]?){11}\\d$') ||
      telNumber.match('^\\(?(\\d[\\-\\(\\)]?){9}\\d$')) &&
    telNumber.match('[\\+]?\\d*(\\(\\d{3}\\))?\\d*\\-?\\d*\\-?\\d*\\d$')
  );
}

function checkContactFormInputs() {
  return (
    validateContactFormInput(
      emailInputEl.val(),
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ) && validatePhone(phoneInputEl.val())
  );
}

function mandatoryInputsFilled() {
  var result = true;
  mandatoryFields.forEach(inputType => {
    if (contactFormEl.find(`input[name=${inputType}]`).val() === '')
      result = false;
  });
  return result;
}

function checkCurr(d) {
  if (window.event) {
    if (event.keyCode == 37 || event.keyCode == 39) return;
  }
  d.value = d.value.replace(/\D/g, '');
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

// Burger-menu

function burgerMenu(selector) {
  let menu = $(selector);
  let button = menu.find('.burger-menu_button', '.burger-menu_lines');
  let links = menu.find('.burger-menu_link');
  let overlay = menu.find('.burger-menu_overlay');

  button.on('click', e => {
    e.preventDefault();
    toggleMenu();
  });

  links.on('click', () => toggleMenu());
  overlay.on('click', () => toggleMenu());

  function toggleMenu() {
    menu.toggleClass('burger-menu_active');

    if (menu.hasClass('burger-menu_active')) {
      $('body').css('overlow', 'hidden');
    } else {
      $('body').css('overlow', 'visible');
    }
  }
}

burgerMenu('.burger-menu');

$(document).ready(function () {
  // Add smooth scrolling to all links
  $('a').on('click', function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== '') {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        },
      );
    } // End if
  });
});
