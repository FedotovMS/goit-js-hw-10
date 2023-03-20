import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderCountryList = countries => {
  const countriesMarkup = countries
    .map(country => {
      return `
        <li>
          <img src="${country.flag}" alt="${country.name}" width="30">
          <span>${country.name}</span>
        </li>
      `;
    })
    .join('');

  countryList.innerHTML = countriesMarkup;
};

const renderCountryInfo = country => {
  const languages = country.languages.map(lang => lang.name).join(', ');
  const countryMarkup = `
    <h2><img src="${country.flag}" alt="${country.name}" width="30"> ${country.name}</h2>
    <p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${languages}</p>
  `;

  countryInfo.innerHTML = countryMarkup;
};

const handleInput = debounce(() => {
  const searchQuery = searchBox.value.trim();

  if (!searchQuery) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        countryList.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
        countryInfo.innerHTML = '';
      } else {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', handleInput);
