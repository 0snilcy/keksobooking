'use strict';
(function () {
  window.fragment = document.createDocumentFragment();
  var FILTER_DEFAULT = "any";
  var pins = [];

  var filters = {
    type: document.querySelector('#housing-type'),
    price: document.querySelector('#housing-price'),
    rooms: document.querySelector('#housing-rooms'),
    guests: document.querySelector('#housing-guests'),
    features: document.querySelector('#housing-features')
  };

  var featuresArray = Array.from(filters.features.querySelectorAll('input'));

  var QUANTITY_LOW_PRICE = 10000;
  var QUANTITY_MIDDLE_PRICE = 50000;
  var DEFAULT_MAIN_PIN_X = 570;
  var DEFAULT_MAIN_PIN_Y = 375;
  var ENTER_KEYCODE = 13;
  var PIN_WIDHT_X = 62;
  var QUANTITY = 3;
  var COORDS_ADRESS_Y = {
    min: 130,
    max: 630
  }

// Нахождение и удаление класса появления карты
window.mapEmergence = document.querySelector('.map');

// Добавление элемента объявления в DOM
window.filterMap = document.querySelector('.map__filters-container');

// Объявляем переменные поиска элементов на странице
var formFieldset = document.querySelectorAll('fieldset');
var formSelect = document.querySelectorAll('select');
var form = document.querySelector('.ad-form');

// Удаление отображения активной карточки отеля
var removeCard = function () {
  var card = document.querySelector('.map__card');
  if (card) {
    window.mapEmergence.removeChild(card);
  };
}

// Удаление отображения остальных пинов
var removePin = function () {
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

// Добавляем и удаляем атрибуты к полям формы
var setRemoveFieldDisabled = function (field, status) {
  for (var i = 0; i < field.length; i++) {
    field[i].disabled = status;
  }
}

setRemoveFieldDisabled(formFieldset, true);
setRemoveFieldDisabled(formSelect, true);

// Рендеринг пинов на страницу
var renderPins = function(pins) {
  removePin();
  var takeNumber = pins.length > 5 ? 5 : pins.length;
  for (var i = 0; i < takeNumber; i++) {
    window.fragment.appendChild(window.tagCreation(pins[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
}

// Создаем функцию перевода страницы из неактивного состояни в активное
var translationActiveState = function (cards) {
  pins = cards;
  renderPins(cards);

  setRemoveFieldDisabled(formFieldset, false);
  setRemoveFieldDisabled(formSelect, false);
  window.mapEmergence.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  window.getAdressInput(PIN_WIDHT_X, window.PIN_HEIGHT_Y);
};

// Перевод страницы из активного состояния, в неактивное
window.translationDeactiveState = function () {
  window.submitForm.reset();
  removePin();
  removeCard();
  resetMainPin();
  window.getAdressInput(window.PIN_WIDTH, window.PIN_HEIGHT);
  setRemoveFieldDisabled(formFieldset, true);
  setRemoveFieldDisabled(formSelect, true);
  window.mapEmergence.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
  removeAvatarImage();
  removeHousingImage();
}

var removeAvatarImage = function () {
  window.imageAvatar.src = 'img/muffin-grey.svg';
};

var removeHousingImage = function () {
  var image = document.querySelectorAll('.ad-form__photo img');
  if (image) {
    while (window.imageHousing.firstChild) {
      window.imageHousing.removeChild(window.imageHousing.firstChild);
    }
  }
}

// Создаем функцию, которая вызывается при нажатии на enter
var onMapActiveEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    window.sendRequestServer(translationActiveState, window.errorHandler, 'GET');
  }
};

// Добавялем обработчик события на метку по нажатию на enter
window.mainPin.addEventListener('keydown', onMapActiveEnterPress);

var Coordinate = function (x, y) {
  this.x = x;
  this.y = y;
}

// Добавялем обработчик события на метку по наведению и клику
window.mainPin.addEventListener('mousedown', function(evt) {
  evt.preventDefault();
  window.sendRequestServer(translationActiveState, window.errorHandler, 'GET');

  var startCoords = new Coordinate(evt.clientX, evt.clientY);

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

    startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);

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

var getPriceFilter = function (quantity) {
  if (quantity < QUANTITY_LOW_PRICE) {
    return 'low';
  } else if (quantity >= QUANTITY_MIDDLE_PRICE && quantity <= QUANTITY_MIDDLE_PRICE) {
    return 'middle';
  } else if (quantity > QUANTITY_MIDDLE_PRICE) {
    return 'high';
  }
};

var filterByType = window.debounce( function (filteredPins) {
  var filteredCardsArray = pins.slice(0);

  var featureValues = featuresArray.reduce(function (arr, data) {
    if (data.checked) {
      arr.push(data.value);
    }
    return arr;
  }, []);

  console.log (featureValues);

  var filteredPins = filteredCardsArray.filter(function (e) {
    if (filters.type.value !== 'any' && e.offer.type !== filters.type.value) {
      return false;
    }

    if (filters.rooms.value !== 'any' && e.offer.rooms !== parseInt(filters.rooms.value, 10)) {
      return false;
    }

    if (filters.guests.value !== 'any' && e.offer.guests !== parseInt(filters.guests.value, 10)) {
      return false;
    }

    if (filters.price.value !== 'any' && filters.price.value !== getPriceFilter(e.offer.price)) {
      return false;
    }

    if (featureValues.length) {
      return featureValues.every(function (feature) {
        return e.offer.features.indexOf(feature) >= 0;
      })
    }

    return true;
  });

  window.closeCard();
  renderPins(filteredPins);
});


filters.type.addEventListener('change', filterByType);
filters.rooms.addEventListener('change', filterByType);
filters.guests.addEventListener('change', filterByType);
filters.price.addEventListener('change', filterByType);
filters.features.addEventListener('change', filterByType);
})();

