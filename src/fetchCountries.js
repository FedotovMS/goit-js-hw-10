export const fetchCountries = name => {
  return fetch(`https://restcountries.com/v2/name/${name}`)
    .then(response => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch(error => console.log(error));
};
