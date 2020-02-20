'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  window.imageHousing = document.querySelector('.ad-form__photo');

  var fileChooser = {
    avatar: document.querySelector('.ad-form__field input[type=file]'),
    housing: document.querySelector('.ad-form__upload input[type=file]')
  };

  var previewAvatar = document.querySelector('.ad-form-header__preview img');

  var loadingFile = function (choiceFile, preview) {
    var file = choiceFile.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  window.createImgHousing = function () {
    var image = document.createElement('img');
    image.height = 70;
    image.width = 70;
    image.style = 'border-radius: 5px;';
    window.imageHousing.appendChild(image);
  };

  fileChooser.avatar.addEventListener('change', function() {
    var formPreview = document.querySelector('.ad-form-header__preview');
    formPreview.style = 'padding: 0';
    previewAvatar.width = 70;
    previewAvatar.height = 70;
    previewAvatar.style = 'border-radius: 5px;';
    loadingFile(fileChooser.avatar, previewAvatar);
  });

  fileChooser.housing.addEventListener('change', function() {
    var previewHousing = document.querySelector('.ad-form__photo img');
    loadingFile(fileChooser.housing, previewHousing);
  });

})();
