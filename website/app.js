/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();
const server = 'http://127.0.0.1:8000';

// my own apikey from the website
const apiKey = '&units=metric&appid=ddda32c7122b384f24bf2a707e389a46';
// the url to get data from the api
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// event listener to the generate btn to get the data
document.querySelector('#generate').addEventListener('click', generateData);




// the function that trigerd when the button is clicked 
function generateData(e){
    // get the values of the two inputs
    const zipCode = document.querySelector('#zip').value;
    const feeling = document.querySelector('#feelings').value;
    // call the three async functions.
    getData( baseURL ,zipCode, apiKey)
    .then((data)=>{
     // the data that about to be sent to the server
     let information= {
     date: newDate,
     temp: data.main.temp,
     res: feeling, 
     feel_like: data.main.feel_like,
     temp_max: data.main.temp_max,
     temp_min: data.main.temp_min,
     pressure: data.main.pressure,
     wind: data.wind.speed,
     country: data.sys.country,
     state: data.name,
     description: data.weather[0].description,
     }
     //call the post function 
     postData(server+'/add', information);
      //call the update ui function 
     updateUi();
    })
}    


// async function to fetch data from the api by the zip code 
const getData = async (baseURL,zip,apiKey)=> {
    // the fitch url
    const res = await fetch(baseURL+zip+apiKey)
    console.log(res);
    
    try {
        let data = await res.json();
        // check if there any error and display it to the user and make it disapear is 2s;
        if (data.cod != 200){
            let small = document.querySelector('.small');
            small.innerHTML= data.message;
            setTimeout(()=>{
                small.innerHTML='';
            },2000)
       }
    
        return data;
    }
    catch(err){
        return console.log('err', err);
      
    }

}


// async function to post data to the server from the api and client side
const postData = async (url= '' , information={})=>{
    const res = await fetch(url, {
        // the body of the fitch
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify(information),
    })
    // send the data to the server
    try{
      let newData= await res.json();
      return newData;
     }
     // check for errors
    catch(err){
        return console.log('err', err);
    }
}
// the third function to update the ui when the data return from the server
const updateUi = async ()=>{
   const res = await fetch(server+'/all');
   try{
       const serverData = await res.json();
       // display the essential data
    document.querySelector('#date').innerHTML='date: '+ serverData.date;
    document.querySelector('#temp').innerHTML='temp is: '+serverData.temp;
    document.querySelector('#content').innerHTML='I feel '+serverData.res;
    // make the more information button vissible
    const more_information = document.querySelector('#more_information').style.display="block";
    // make a second event listener to get extra data about the weather
    document.querySelector('#more_information').addEventListener('click', moreInfo);
    function moreInfo(){
        document.querySelector('#temp_max').innerHTML='max_temp: '+ serverData.temp_max;
        document.querySelector('#temp_min').innerHTML='min_temp: '+ serverData.temp_min;
        document.querySelector('#description').innerHTML='description: '+serverData.description;
        document.querySelector('#pressure').innerHTML='pressur: '+ serverData.pressure;
        document.querySelector('#wind').innerHTML='wind: '+serverData.wind;
        document.querySelector('#country').innerHTML='country: '+serverData.country;
        document.querySelector('#state').innerHTML='state: '+serverData.state;

    }

   }
   // check if there an error 
   catch(err){
    console.log('erorr', err);
   }
}
