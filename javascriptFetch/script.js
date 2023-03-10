'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};
const renderCounrty = function (data, className = null) {
  const html = `
<article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};
const getJSON = function (url, errorMessage = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMessage} (${response.status})`);
    return response.json();
  });
};
const getCounrty = function (counrty) {
  getJSON(`https://restcountries.com/v2/name/${counrty}`, 'Country not found')
    .then(data => {
      renderCounrty(data[0]);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No neigbour found!');
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCounrty(data, 'neighbour'))
    .catch(error => {
      console.error(`${error}`);
      renderError(`Something went wrong ${error.message}.Try Again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCounrty('PORTUGAL');
  getCounrty('turkey');
  getCounrty('australia');
});
