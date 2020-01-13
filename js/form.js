'use strict';
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 62;
  window.PIN_HEIGHT_Y = window.PIN_HEIGHT + 22;
  window.mainPin = document.querySelector('.map__pin--main');
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

})();

