// script.js
document.addEventListener('DOMContentLoaded', () => {
    const countryInput = document.getElementById('country-input');
    const submitBtn = document.getElementById('submit-btn');
    const countryInfoSection = document.getElementById('country-info');
    const borderingCountriesSection = document.getElementById('bordering-countries');

    submitBtn.addEventListener('click', handleSearch);
    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    async function handleSearch() {
        const countryName = countryInput.value.trim();
        if (!countryName) {
            displayError('Please enter a country name');
            return;
        }

        try {
            // Clear previous results
            clearPreviousResults();
            
            // Fetch country data
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            
            if (!response.ok) {
                throw new Error('Country not found');
            }

            const [countryData] = await response.json();
            displayCountryInfo(countryData);

            // Handle bordering countries
            if (countryData.borders && countryData.borders.length > 0) {
                await displayBorderingCountries(countryData.borders);
            } else {
                borderingCountriesSection.innerHTML = '<p>No bordering countries</p>';
            }

        } catch (error) {
            displayError(error.message === 'Country not found');
        }
    }

    function displayCountryInfo(country) {
        const infoHTML = `
            <h2>${country.name.common}</h2>
            <p><img src="${country.flags.png}" alt="${country.name.common} flag" style="max-width: 200px;"></p>
            <p>apital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p>opulation:${country.population.toLocaleString()}</p>
            <p>Region: ${country.region}</p>
        `;
        countryInfoSection.innerHTML = infoHTML;
    }

    async function displayBorderingCountries(borderCodes) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`);
            const borderingCountries = await response.json();

            let bordersHTML = '<h3>Bordering Countries:</h3>';
            borderingCountries.forEach(country => {
                bordersHTML += `
                    <p style="display: inline-block; margin: 10px; text-align: center;">
                        <img src="${country.flags.png}" alt="${country.name.common} flag" style="width: 50px; display: block;">
                        <span>${country.name.common}</span>
                    </p>
                `;
            });
            borderingCountriesSection.innerHTML = bordersHTML;
        } catch (error) {
            borderingCountriesSection.innerHTML = '<p>Error loading bordering countries</p>';
        }
    }

    function displayError(message) {
        clearPreviousResults();
        countryInfoSection.innerHTML = `<p style="color: red;">${message}</p>`;
    }

    function clearPreviousResults() {
        countryInfoSection.innerHTML = '';
        borderingCountriesSection.innerHTML = '';
    }
});