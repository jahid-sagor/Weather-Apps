const storage = {
   country: '',
   city: '',
   saveItem(){
     localStorage.setItem('BD-country', this.country)
     localStorage.setItem('BD-city', this.city)
   },
   getItem(){
   const country = localStorage.getItem('BD-country')
   const city = localStorage.getItem('BD-city')
   return {
    country,
    city
   }
   }
}

const weatherData = {
    country: '',
    city: '',
    API_KEY: '81ae235e1e9480ae7f3d9ba76ee46cb6',
    async getWeather() {
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`)
            const {name, main,  weather} = await res.json();
            return {
                name,
                main,
                weather
              }
        }catch(err){
            UI.showMessage('Error in Fetching Data')
        }
     
    }
}

const UI = {
    loadSelectors() {
        const countryElm = document.querySelector("#country");
        const cityElm = document.querySelector("#city");
        const cityInfoElm = document.querySelector("#w-city");
        const temperatureElm = document.querySelector("#w-temp");
        const pressureElm = document.querySelector("#w-pressure");
        const humidityElm = document.querySelector("#w-humidity");
        const feelElm = document.querySelector("#w-feel");
        const iconElm = document.querySelector("#w-icon");
        const messageElm = document.querySelector("#messageWrapper");
        const formElm = document.querySelector("#form");

        return {
            countryElm,
            cityElm,
            cityInfoElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            iconElm,
            messageElm,
            formElm
        };
    },
    hideMessage() {
        setTimeout(() => {
            const messageElm = document.querySelector('#message');
            if (messageElm) {
                messageElm.remove();
            }
        }, 2000);
    },
    showMessage(msg) {
        const { messageElm } = this.loadSelectors();
        const elm = `<div class="alert alert-danger" id="message">${msg}</div>`;
        messageElm.insertAdjacentHTML('afterbegin', elm);
        this.hideMessage();
    },
    validateInput(country, city) {
        if (country === '' || city === '') {
            this.showMessage('Please provide necessary info');
            return true;
        } else {
            return false;
        }
    },
    getInputsValues() {
        const { countryElm, cityElm } = this.loadSelectors();
        const isInvalid = this.validateInput(countryElm.value, cityElm.value);
        if (isInvalid) return;
        return {
            country: countryElm.value,
            city: cityElm.value
        };
    },
    resetInputs() {
        const { countryElm, cityElm } = this.loadSelectors();
        countryElm.value = '';
        cityElm.value = '';
    },
 async handleRemoteData() {
      const data = await weatherData.getWeather();
      return data
    },
    getIcon(iconCode){
      return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    },
    populateUI(data){
      const {cityElm, temperatureElm, pressureElm, humidityElm, feelElm, iconElm} = this.loadSelectors()
      const {name, main: {temp, pressure, humidity}, weather} = data
      cityElm.textContent = name
      temperatureElm.textContent = `Temperature: ${temp}°C`
      pressureElm.textContent = `Pressure: ${pressure}Kpa`
      humidityElm.textContent = `Humidity: ${humidity}`
      feelElm.textContent = weather[0].description
      iconElm.setAttribute('src', this.getIcon(weather[0].icon))
    },
  init(){
        const {formElm} = this.loadSelectors()
        formElm.addEventListener('submit', async (e) =>{
            e.preventDefault();
            //get inputs values
        const {country, city} = this.getInputsValues()
        //setting data to temp data layer
        weatherData.country = country
        weatherData.city = city
        //setting data to localStorage data layer
        storage.country = country
        storage.city = city
        //saving to storage
        storage.saveItem()
        //reset the values
        this.resetInputs()
        //send data to API server
       const data = await this.handleRemoteData()
       //populate UI
       this.populateUI(data)
        
        })
        window.addEventListener('DOMContentLoaded' , async (e) =>{
         let {country, city} = storage.getItem()
         if (!country || !city) {
            country = 'BD',
            city = 'Dhaka'
        }
         weatherData.country = country
         weatherData.city = city
         //send data to API server
       const data = await this.handleRemoteData()
       //populate UI
       this.populateUI(data)
        })
    }
    
}

UI.init();



