'use strict';
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 62;
  window.PIN_HEIGHT_Y = window.PIN_HEIGHT + 22;
  window.mainPin = document.querySelector('.map__pin--main');
  var ESC_KEYCODE = 27;
  var DEFAULT_MAIN_PIN_X = 570;
  var DEFAULT_MAIN_PIN_Y = 375;
  var ROOMS_GUESTS_CONNECT = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };
  var HOUSINGTYPE_MINPRICE_CONNECT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

// Создаем функцию добавления координат метки в поле формы
window.address = document.querySelector('#address');
window.getAdressInput = function (x, y) {
  var pinX = parseInt(window.mainPin.style.left, 10) + x / 2;
  var pinY = parseInt(window.mainPin.style.top, 10);

  if (y === window.PIN_HEIGHT) {
    pinY += y / 2;
  } else {
    pinY += window.PIN_HEIGHT_Y;
  }

  window.address.value = pinX + ', ' + pinY;
};

window.getAdressInput(window.PIN_WIDTH, window.PIN_HEIGHT);

// Функция соответствия двух полей формы (количество комнат и количество гостей)
var roomNumber = document.querySelector('#room_number');
var guestsNumber = document.querySelector('#capacity');

var getActiveRooms = function () {
  var numbers = ROOMS_GUESTS_CONNECT[roomNumber.value];

  for (var i = 0; i < guestsNumber.length; i++) {
    var val = parseInt(guestsNumber[i].value, 10);
    guestsNumber[i].setAttribute('disabled', 'disabled');
    for (var j = 0; j < numbers.length; j++) {
      if (val === numbers[j]) {
        guestsNumber[i].removeAttribute('disabled', 'disabled');
      }
    }
  }
};

// Создаем событие в форме по вызову функции соответствия (количество комнат и количество гостей)
roomNumber.addEventListener('change', getActiveRooms);


// Функция соответствия двух полей формы (тип жилья и минимальная цена)
var typeHousing = document.querySelector('#type');
var price = document.querySelector('#price');

var getMinPriceConnectType = function () {
  price.min = HOUSINGTYPE_MINPRICE_CONNECT[typeHousing.value];
  price.placeholder = price.min;
};

// Создаем событие по вызову функции (тип жилья и минимальная цена)
typeHousing.addEventListener('input', getMinPriceConnectType);

// Функции проверок соответсвия двух полей (время заезда и время выезда)
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');


var getTimeinConnectTimeout = function (evt) {
  var value = evt.target.value;
  timeOut.value = value;
  timeIn.value = value;
};

timeIn.addEventListener('input', getTimeinConnectTimeout);
timeOut.addEventListener('input', getTimeinConnectTimeout);

// Удаление отображения активной карточки отеля
var removeCard = function () {
  var card = document.querySelector('.map__card');
  if (card) {
    window.mapEmergence.removeChild(card);
  };
}

// Удаление отображения остальных пинов
window.removePin = function () {
  var otherPinMap = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  otherPinMap.forEach(function (item) {
    item.remove();
  })
};

// Возвращение активного пина к дефолтному состоянию
var resetMainPin = function () {
  mainPin.style.left = DEFAULT_MAIN_PIN_X + 'px';
  mainPin.style.top = DEFAULT_MAIN_PIN_Y + 'px';
}

// Нахождение в Темплэйте окна успешной отправки формы
var similarSuccessTemplate = document.querySelector('#success').content.querySelector('.success');

// Закрываем окно успешной отпавки формы через клик
var closeSuccessModal = function () {
  var modalSuccess = document.querySelector('.success');

  modalSuccess.addEventListener('click', function () {
    document.querySelector('body').removeChild(modalSuccess);
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      document.querySelector('body').removeChild(modalSuccess);
    }
  });
}

var renderForm = function () {
  var modalSuccessClone = similarSuccessTemplate.cloneNode(true);
  submitForm.reset();
  window.removePin();
  removeCard();
  resetMainPin();
  window.getAdressInput(window.PIN_WIDTH, window.PIN_HEIGHT);
  window.translationDeactiveState();
  document.body.insertAdjacentElement('afterbegin', modalSuccessClone);
  closeSuccessModal();
}

// Добавляем обрабочки события на кнопку отправки формы на сервер через AJAX
var submitForm = document.querySelector('.ad-form');
submitForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  window.sendRequestServer(renderForm, window.errorHandler, 'POST', new FormData(submitForm));
});
})();
