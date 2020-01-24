'use strict';

(function () {
// Функция создания метки на основе клонирования, подставление данных в нее из объекта
var tagCreationTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

window.tagCreation = function (announcement) {
  var tagElement = tagCreationTemplate.cloneNode(true);

  tagElement.style.left = announcement.location.x + 'px';
  tagElement.style.top = announcement.location.y + 'px';
  tagElement.querySelector('img').setAttribute('src', announcement.author.avatar);
  tagElement.querySelector('img').setAttribute('alt', announcement.offer.title);

  // Создаем содержание объявлений на основе клонирования
  tagElement.addEventListener('click', function () {

    window.closeCard();

    window.fragment.appendChild(window.cardCreation(announcement));
    document.querySelector('.map').insertBefore(window.fragment, window.filterMap)
  });

  return tagElement;
}
})();

