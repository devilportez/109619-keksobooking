'use strict';

var form = document.querySelector('.ad-form');
var success = document.querySelector('.success');
var roomNumber = form.querySelector('#room_number');
var capacity = form.querySelector('#capacity');
var submit = form.querySelector('.ad-form__submit');

var validateRoomsAndCapacity = function () {
  if (+roomNumber.value !== 100 && +capacity.value !== 0 && +roomNumber.value < +capacity.value) {
    capacity.setCustomValidity('Гостей не должно быть больше, чем комнат');
  } else if (+roomNumber.value !== 100 && +capacity.value === 0) {
    capacity.setCustomValidity('Не для гостей только для 100 комнат');
  } else if (+roomNumber.value === 100 && +capacity.value !== 0) {
    capacity.setCustomValidity('100 комнат только не для гостей');
  } else {
    capacity.setCustomValidity('');
  }
};

var onRoomsAndCapacityChange = function () {
  validateRoomsAndCapacity();
};

roomNumber.addEventListener('change', onRoomsAndCapacityChange);
capacity.addEventListener('change', onRoomsAndCapacityChange);

submit.addEventListener('click', function () {
  if (form.checkValidity()) {
    success.classList.remove('hidden');
  }
});

validateRoomsAndCapacity();
