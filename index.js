// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchBtn.addEventListener('click', handleFetch);
    stateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFetch();
    });
});

async function handleFetch() {
    const state = stateInput.value.trim().toUpperCase();
    
    // IMPORTANT: Clear error message FIRST, before validation
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    
    // Clear alerts display
    alertsDisplay.innerHTML = '';
    
    // Validate input
    if (!state || state.length !== 2) {
        displayError('Please enter a valid 2-letter state abbreviation');
        return;
    }
    
    // Clear input (test requirement)
    stateInput.value = '';
    
    try {
        const data = await fetchWeatherData(state);
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
}

async function fetchWeatherData(state) {
    const response = await fetch(`${weatherApi}${state}`);
    
    if (!response.ok) {
        throw new Error('Network failure');
    }
    
    return await response.json();
}

function displayWeather(data) {
    const features = data.features || [];
    const alertCount = features.length;
    
    alertsDisplay.innerHTML = `<h2>Weather Alerts: ${alertCount}</h2>`;
    
    features.forEach(alert => {
        const headline = alert.properties?.headline || 'No headline';
        const div = document.createElement('div');
        div.textContent = headline;
        alertsDisplay.appendChild(div);
    });
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeatherData,
        displayWeather,
        displayError,
        handleFetch
    };
}