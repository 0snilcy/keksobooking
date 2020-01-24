'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var PIN_WIDHT_X = 62;
  var COORDS_ADRESS_Y = {
    min: 130,
    max: 630
  }

// Нахождение и удаление класса появления карты
window.mapEmergence = document.querySelector('.map');

// Задаю переменную для вызова функции
var filterCardCreation = window.cardCreation(window.createObj(2));

// Добавление элемента объявления в DOM
window.filterMap = document.querySelector('.map__filters-container');

// Объявляем переменные поиска элементов на странице
var formFieldset = document.querySelectorAll('fieldset');
var formSelect = document.querySelectorAll('select');
var form = document.querySelector('.ad-form');

// Добавляем и удаляем атрибуты к полям формы
var setRemoveFieldDisabled = function (field, status) {
  for (var i = 0; i < field.length; i++) {
    field[i].disabled = status;
  }
}

setRemoveFieldDisabled(formFieldset, true);
setRemoveFieldDisabled(formSelect, true);

// Создаем функцию перевода страницы из неактивного состояни в активное
var translationActiveState = function (cards) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < cards.length; i++) {
    fragment.appendChild(window.tagCreation(cards[i]));
  }

  setRemoveFieldDisabled(formFieldset, false);
  setRemoveFieldDisabled(formSelect, false);
  document.querySelector('.map__pins').appendChild(fragment);
  document.querySelector('.map').insertBefore(filterCardCreation, window.filterMap);
  window.mapEmergence.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  window.getAdressInput(PIN_WIDHT_X, window.PIN_HEIGHT_Y);
};

// Перевод страницы из активного состояния, в неактивное
window.translationDeactiveState = function () {
  setRemoveFieldDisabled(formFieldset, true);
  setRemoveFieldDisabled(formSelect, true);
  window.mapEmergence.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
}

// Создаем функцию, которая вызывается при нажатии на enter
var onMapActiveEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    translationActiveState();
  }
};

// Добавялем обработчик события на метку по нажатию на enter
window.mainPin.addEventListener('keydown', onMapActiveEnterPress);


// Добавялем обработчик события на метку по наведению и клику
window.mainPin.addEventListener('mousedown', function(evt) {
  evt.preventDefault();
  window.sendRequestServer(translationActiveState, window.errorHundler, 'GET');

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    if (startCoords.y < COORDS_ADRESS_Y.min || startCoords.y > COORDS_ADRESS_Y.max) {
      startCoords.y = COORDS_ADRESS_Y.min + 'px';
    }

    if (startCoords.x < window.mapEmergence.offsetLeft + PIN_WIDHT_X) {
      startCoords.x = PIN_WIDHT_X + 'px';
    } else if (window.mainPin.offsetLeft - shift.x + PIN_WIDHT_X > window.mapEmergence.offsetWidth) {
      startCoords.x = window.mapEmergence.offsetWidth + 'px';
      return startCoords.x;
    }

    window.mainPin.style.top = (window.mainPin.offsetTop - shift.y) + 'px';
    window.mainPin.style.left = (window.mainPin.offsetLeft - shift.x) + 'px';

    window.getAdressInput(window.PIN_WIDTH, window.PIN_HEIGHT_Y);
  }

  var onMouseUp = function (moveUp) {
    moveUp.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
})();

