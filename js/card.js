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
  var housingImages = document.querySelector('.ad-form-header__preview img');

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
  window.imageAvatar.src = announcement.author.avatar;

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
