'use strict';

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

  return pin;
};

var createCard = function (template, data) {
  var card = template.cloneNode(true);
  var featuresContainer = card.querySelector('.popup__features');
  var photosContainer = card.querySelector('.popup__photos');
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

  return card;
};

var fillTemplateWithData = function (template, fn, data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(fn(template, data[i]));
  }

  return fragment;
};

var offers = generateOffers(avatars, titles);
var map = document.querySelector('.map');
var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var cardTemplate = template.querySelector('.map__card');
var pinsContainer = document.querySelector('.map__pins');

pinsContainer.appendChild(fillTemplateWithData(pinTemplate, createPin, offers));
map.appendChild(fillTemplateWithData(cardTemplate, createCard, offers.slice(0, 1)));

map.classList.remove('map--faded');
