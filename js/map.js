'use strict';

var DISABLED_MAIN_PIN_SIZE = 62;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 81;
var OFFERS_AMOUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_X_MIN = 300;
var PIN_X_MAX = 900;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 10;

var avatars = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var times = [
  '12:00',
  '13:00',
  '14:00'
];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomIntegerInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayItem = function (array) {
  return array[getRandomIntegerInRange(0, array.length - 1)];
};

var getRandomArraySlice = function (array) {
  return array.slice(getRandomIntegerInRange(0, array.length - 1));
};

var shuffleArray = function () {
  return Math.random() - 0.5;
};

var createElementsFromArray = function (container, array, htmlBefore, htmlAfter) {
  container.innerHTML = '';

  for (var i = 0; i < array.length; i++) {
    container.insertAdjacentHTML('beforeend', htmlBefore + array[i] + htmlAfter);
  }
};

var generateOffers = function (avatar, title) {
  var generatedOffers = [];

  for (var i = 0; i < OFFERS_AMOUNT; i++) {
    var location = {
      x: getRandomIntegerInRange(PIN_X_MIN, PIN_X_MAX),
      y: getRandomIntegerInRange(PIN_Y_MIN, PIN_Y_MAX)
    };

    generatedOffers[i] = {
      author: {
        avatar: avatar[i]
      },
      offer: {
        title: title[i],
        address: location.x + ', ' + location.y,
        price: getRandomIntegerInRange(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayItem(types),
        rooms: getRandomIntegerInRange(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomIntegerInRange(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomArrayItem(times),
        checkout: getRandomArrayItem(times),
        features: getRandomArraySlice(features),
        description: '',
        photos: photos.sort(shuffleArray)
      },
      location: location
    };
  }

  return generatedOffers;
};

var createPin = function (template, data) {
  var pin = template.cloneNode(true);
  var pinImage = pin.querySelector('img');

  pin.style.left = data.location.x - (PIN_WIDTH / 2) + 'px';
  pin.style.top = data.location.y - PIN_HEIGHT + 'px';
  pinImage.src = data.author.avatar;
  pinImage.alt = data.offer.title;

  pin.addEventListener('click', function (evt) {
    var card = map.querySelector('.map__card');
    var currentPin = +evt.currentTarget.dataset.id;

    if (card) {
      card.parentNode.removeChild(card);
    }

    map.insertBefore(fillTemplateWithData(
        cardTemplate, createCard, offers.slice(currentPin, currentPin + 1)), map.children[1]
    );
  });

  return pin;
};

var createCard = function (template, data) {
  var card = template.cloneNode(true);
  var featuresContainer = card.querySelector('.popup__features');
  var photosContainer = card.querySelector('.popup__photos');
  var closeButton = card.querySelector('.popup__close');
  var typesText = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  card.querySelector('.popup__avatar').src = data.author.avatar;
  card.querySelector('.popup__title').textContent = data.offer.title;
  card.querySelector('.popup__text--address').textContent = data.offer.address;
  card.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = typesText[data.offer.type];
  card.querySelector('.popup__text--capacity').textContent =
    data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent =
    'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  card.querySelector('.popup__description').textContent = data.offer.description;

  createElementsFromArray(
      featuresContainer,
      data.offer.features,
      '<li class="popup__feature popup__feature--',
      '"></li>'
  );
  createElementsFromArray(
      photosContainer,
      data.offer.photos,
      '<img src="',
      '" class="popup__photo" width="45" height="40" alt="Фотография жилья">'
  );

  closeButton.addEventListener('click', function () {
    card.parentNode.removeChild(card);
  });

  return card;
};

var fillTemplateWithData = function (template, fn, data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    template.dataset.id = i;
    fragment.appendChild(fn(template, data[i]));
  }

  return fragment;
};

var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var fieldsets = form.querySelectorAll('fieldset');
var address = form.querySelector('#address');
var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var cardTemplate = template.querySelector('.map__card');
var pinsContainer = document.querySelector('.map__pins');
var offers = generateOffers(avatars, titles);

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var initialPosition = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMainPinMousemove = function (moveEvt) {
    moveEvt.preventDefault();

    var limit = {
      top: 130,
      right: 1200,
      bottom: 630,
      left: 0
    };

    var offset = {
      x: initialPosition.x - moveEvt.clientX,
      y: initialPosition.y - moveEvt.clientY
    };

    var coord = {
      x: mainPin.offsetLeft - offset.x,
      y: mainPin.offsetTop - offset.y
    };

    if (coord.y < limit.top) {
      coord.y = limit.top;
    } else if (coord.y > limit.bottom) {
      coord.y = limit.bottom;
    } else if (coord.x < limit.left) {
      coord.x = limit.left;
    } else if (coord.x > limit.right) {
      coord.x = limit.right;
    }

    mainPin.style.left = coord.x + 'px';
    mainPin.style.top = coord.y + 'px';

    address.value =
      'x: ' + (coord.x + MAIN_PIN_WIDTH / 2) +
      ', y: ' + (coord.y + MAIN_PIN_HEIGHT);

    initialPosition = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
  };

  var onMainPinMouseup = function (upEvt) {
    upEvt.preventDefault();

    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    // address.value =
    //   'x: ' + (mainPin.offsetLeft + MAIN_PIN_WIDTH / 2) +
    //   ', y: ' + (mainPin.offsetTop + MAIN_PIN_HEIGHT);
    pinsContainer.appendChild(fillTemplateWithData(pinTemplate, createPin, offers));
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }

    mainPin.removeEventListener('mousemove', onMainPinMousemove);
    mainPin.removeEventListener('mouseup', onMainPinMouseup);
  };

  mainPin.addEventListener('mousemove', onMainPinMousemove);
  mainPin.addEventListener('mouseup', onMainPinMouseup);
});

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].disabled = true;
}

address.value =
  'x: ' + (mainPin.offsetLeft + DISABLED_MAIN_PIN_SIZE / 2) +
  ', y: ' + (mainPin.offsetTop + DISABLED_MAIN_PIN_SIZE / 2);
