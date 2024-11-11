const apiKeys = '2cbf363003a23423369c296e66369ae5'
let apiURLS = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=bandung`

checkWeather = async () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const weatherContent = document.querySelector('.weather-content');
    
    try {
        loadingOverlay.style.display = 'flex';
        weatherContent.classList.add('searching');

        const response = await fetch(apiURLS + `&appid=${apiKeys}`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();

        let weather = 'unknown';
        const weatherConditions = [
            {patterns: ['rain', 'thunderstorm'], result: 'rain'},
            {patterns: ['cloud', 'haze'], result: 'clouds'},
            {patterns: ['clear', 'sunny'], result: 'clear'},
            {patterns: ['snow'], result: 'snow'},
            {patterns: ['drizzle'], result: 'drizzle'}
        ];

        for (let condition of weatherConditions) {
            for (let pattern of condition.patterns) {
                if(data.weather[0].main.toLowerCase().includes(pattern)) {
                    weather = condition.result;
                    break;
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        loadingOverlay.style.display = 'none';
        weatherContent.classList.remove('searching');

        // Update HTML
        document.querySelector('.wheater-img').src = `./asset/images/${weather}.png`;
        document.querySelector('.city-name').innerHTML = data.name;
        document.querySelector('.temperature').innerHTML = `${data.main.temp.toFixed()}°C`;
        document.querySelector('.humidity-js').innerHTML = `${data.main.humidity}%`;
        document.querySelector('.wind-speed-js').innerHTML = `${data.wind.speed} km/h`;
        
    } catch (error) {
        loadingOverlay.style.display = 'none';
        weatherContent.classList.remove('searching');
        alert(error.message);
    }
}

checkWeather();


document.querySelector('.search-button').addEventListener('click', () => {
    const city = document.querySelector('.input-text').value
    apiURLS = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}`
    console.log(apiURLS);
    checkWeather();
});

document.querySelector('.input-text').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = document.querySelector('.input-text').value
        apiURLS = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}`
        console.log(apiURLS);
        checkWeather();
    }
});

