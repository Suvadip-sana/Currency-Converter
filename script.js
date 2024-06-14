const dropDown = document.querySelectorAll(".dropdown select"),
formCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getBtn = document.querySelector("form button"),
amount = document.querySelector(".amount input"),
exchangeRateText = document.querySelector(".message"),
exchangeIcon = document.querySelector(".dropdown .icon"),
apiKey = "99a0aec004527b1a155623da";



for(let i = 0; i < dropDown.length; i++){
    for(currency_code in countryList){
        //By default it select From USD to INR
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "INR" ? "selected" : "";
        }
        //Creating option tag that passing currency code as a text & value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        //Insert option tag into select tag
        dropDown[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropDown[i].addEventListener("change", e =>{
        loadFlag(e.target);
        //Calling loadflag with passing target element as an argument
    })
}

function loadFlag(element){
    for(code in countryList){
        if(code == element.value){ //If currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img");//Select img tag for particular drop list
            imgTag.src = `https://flagsapi.com/${countryList[code]}/flat/64.png`; //Passing country code of this selected currency code in this img url
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
});

getBtn.addEventListener("click", e =>{
    e.preventDefault(); //Prevent default form submission through button
    getExchangeRate();
});

//Rotate the exchange icon
let rotationAngle = 0;// Initialize the rotation angle

exchangeIcon.addEventListener("click", () => {
    let tempCode = formCurrency.value;//Temporary currency code of FROM dropdown list
    formCurrency.value = toCurrency.value;//Passing TO currency code to FROM currency code
    toCurrency.value = tempCode;//Passing Temporary currency code to To currency code
    loadFlag(formCurrency);// Calling loadFlag with passing select element of FROM
    loadFlag(toCurrency);// Calling loadFlag with passing select element of TO
    getExchangeRate();

    rotationAngle = (rotationAngle === 0) ? 180 : 0;

    // Apply the rotation to the exchange icon
    exchangeIcon.style.transform = `rotate(${rotationAngle}deg)`;
    exchangeIcon.style.transition = "transform 0.5s ease";    
})

function getExchangeRate(){


    let amountVal = amount.value;

    //If enter nothing or enter 0 then it autometically become 1
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    } 

    exchangeRateText.innerHTML = '<i class="fa-solid fa-arrows-rotate rotation"></i>';
    

    //Fetch API and convert into JSON format

    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${formCurrency.value}`;

    fetch(url).then(response => response.json()).then(result => {

        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateText.innerHTML = `${amountVal} ${formCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        
    })

    .catch(error => {
        exchangeRateText.innerHTML = "Failed to get exchange rate..";
        console.error('Error fetching exchange rate:',error);
    })
}
