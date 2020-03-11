'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  window.imageHousing = document.querySelector('.ad-form__photo');
  window.imageAvatar = document.querySelector('.ad-form-header__preview img');

  var fileChooser = {
    avatar: document.querySelector('.ad-form__field input[type=file]'),
    housing: document.querySelector('.ad-form__upload input[type=file]')
  };

  var loadingFiles = function (target, callback) {
    var files = target.files;
    if (files.length) {
      [].forEach.call(files, function(file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            var src = reader.result;
            callback(src);
          });

          reader.readAsDataURL(file);
        }
      })
    }
  };

  window.loadingImages = function (src) {
    var image = document.createElement('img');
    image.height = 70;
    image.width = 70;
    image.style = 'border-radius: 5px; object-fit: cover;';
    image.src = src;
    window.imageHousing.appendChild(image);
  };

  var loadingAvatar = function (src) {
    window.imageAvatar.src = src;
  }

  fileChooser.avatar.addEventListener('change', function(event) {
    loadingFiles(event.target, loadingAvatar)
  });
  fileChooser.housing.addEventListener('change', function(event) {
    loadingFiles(event.target, window.loadingImages)
  });

})();
