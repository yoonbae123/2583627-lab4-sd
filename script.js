
document.addEventListener('DOMContentLoaded', () => {
    const countryInput = document.getElementById('country-input');
    const submitBtn = document.getElementById('submit-btn');
    const countryInfoSection = document.getElementById('country-info');
    const border = document.getElementById('borders');

    submitBtn.addEventListener('click', handleSearch);
 

    async function handleSearch() {
        const countryName = countryInput.value.trim();
        if (!countryName) {
            displayError('Please enter a country name');
            return;
        }

        try {
            clearPreviousResults();
            
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            
            if (!response.ok) {
                throw new Error('Country not found');
            }

            const [countryData] = await response.json();
            displayCountryInfo(countryData);

            if (countryData.borders && countryData.borders.length > 0) {
                await displayBorderingCountries(countryData.borders);
            } else {
                border.innerHTML = '<p>No bordering countries</p>';
            }
        } catch (error) {
            displayError(error.message = 'Country not found');
        }
    }

    function displayCountryInfo(country) {
        const infoHTML = `
            <h2>${country.name.common}</h2>
            <p><img src="${country.flags.png}" alt="${country.name.common} flag" style="max-width: 200px;"></p>
            <p>Capital: ${country.capital[0]}</p>
            <p>Population:${country.population.toLocaleString()}</p>
            <p>Region: ${country.region}</p>
        `;
        countryInfoSection.innerHTML = infoHTML;
    }

    async function displayBorderingCountries(borderCodes) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`);
            const borderingCountries = await response.json();

            let bordersHTML = '<h3>Bordering Countries:</h3>';
            for (const country of borderingCountries) {
                bordersHTML += `
                    <p style="margin: 10px; text-align: center;">
                        <img src="${country.flags.png}" alt="${country.name.common} flag" style="width: 50px" class="center">
                        <a>${country.name.common}<a>
                    </p>`;
            }
            border.innerHTML = bordersHTML;
        } catch (error) {
            border.innerHTML = '<p>Error loading bordering countries</p>';
        }
    }

    function displayError(message) {
        countryInfoSection.innerHTML = `<p>${message}</p>`;
    }

    function clearPreviousResults() {
        countryInfoSection.innerHTML = '';
        border.innerHTML = '';
    }
});