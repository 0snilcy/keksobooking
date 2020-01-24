'use strict';

(function () {
  var request = {
    POST: 'https://js.dump.academy/keksobooking',
    GET: 'https://js.dump.academy/keksobooking/data'
  }

  window.sendRequestServer = function (onLoad, onError, type, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка');
    });

    xhr.open(type, request[type]);
    xhr.send(data);
  }
})();

