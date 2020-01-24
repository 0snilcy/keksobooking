'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var TYPE_APARTMENTS = ['palace', 'flat', 'house', 'bungalo'];
  var TIME_ARRIVAL_DEPARTURE = ['12:00', '13:00', '14:00'];
  var apartments = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  }

// Функция формирования объявления
window.createObj = function (id) {
  var announcement = {
    "author": {
      "avatar": 'img/avatars/user0'+ id +'.png'
    },

    "offer": {
      "title": 'Mustard Hotel Asakusa',
      "address": '600, 350',
      "price": getRandom(1000, 20000),
      "type": randomArr(TYPE_APARTMENTS),
      "rooms": getRandom(1,5),
      "guests": getRandom(1,8),
      "checkin": randomArr(TIME_ARRIVAL_DEPARTURE),
      "checkout": randomArr(TIME_ARRIVAL_DEPARTURE),
      "features": ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
      "description": 'Отель Mustard Asakusa 2 удобно расположен в районе Таито в Токио, в 200 м от торгового центра Ekimise Asakusa, в 300 м от ворот Гозомон и в 300 м от ворот Нитенмон. Отель находится недалеко от публичного зала Asakusa, концертного зала Sumida Riverside Hall и торгового центра Asakusa ROX. К услугам гостей круглосуточная стойка регистрации и бесплатный Wi-Fi на всей территории.',
      "photos": ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    },

    "location": {
      "x": getRandom(0, 1200),
      "y": getRandom(130, 630)
    }
  }
  return announcement;
}

// Функция проверки Dom-элемента в разметке и удаление элемента
window.closeCard = function () {
  var cardCheck = document.querySelector('.map__card');
  if (cardCheck) {
    window.mapEmergence.removeChild(cardCheck);
  }
}

  // Созданеи Dom-элемента объявления
  window.cardCreation = function (announcement) {
    var cardCreationTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var cardElement = cardCreationTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = announcement.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = announcement.offer.price + 'Р/ночь';
    cardElement.querySelector('.popup__type').textContent = apartments[announcement.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = announcement.offer.rooms + (announcement.offer.rooms === 1 ? ' комната для ' : ' комнаты для ') + announcement.offer.guests + (announcement.offer.guests === 1 ? ' гостя ' : ' гостей');
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = announcement.offer.description;

    var featuresList = cardElement.querySelector('.popup__features');
    featuresList.innerHTML = '';
    for (var i = announcement.offer.features.length - 1; i >= 0; i--) {
      var createFeaturesItem = document.createElement('li');
      createFeaturesItem.classList.add('popup__feature', 'popup__feature--' + announcement.offer.features[i]);
      featuresList.appendChild(createFeaturesItem);
    }

    var photoElement = cardElement.querySelector('.popup__photos');
    photoElement.innerHTML = '';
    for (var i = 0; i < announcement.offer.photos.length; i++) {
      var createImg = document.createElement('img');
      createImg.src = announcement.offer.photos[i];
      createImg.classList.add('popup__photo');
      createImg.width = '45';
      createImg.height = '40';
      createImg.alt = 'Фотография жилья';
      photoElement.appendChild(createImg);
    }

    cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

    var closeCardBtn = cardElement.querySelector('.popup__close');
    closeCardBtn.addEventListener('click', closeCard);
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeCard();
      }
    });

    return cardElement;
  }

  // Функция генерации случайного числа в заданном интервале
  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Функция, которая возвращает случайный элемент массива
  function randomArr(arr) {
    return arr[getRandom(0, arr.length)];
  }
})();
