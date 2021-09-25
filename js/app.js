const drop_list = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");
let apikey = "ecc8afe87ff18f55746985ae";

for (let i = 0; i < drop_list.length; i++) {
    for (currency_code in country_code) {
        // selected PKR by default as FROM currency and USD as TO currency
        let selected;
        if (i == 0) {
            selected = currency_code == "PKR" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "USD" ? "selected" : "";
        }
        // creating option tag with passing currency code as a text a value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting option tag inside select tag
        drop_list[i].insertAdjacentHTML("beforeend", optionTag)
    }
    drop_list[i].addEventListener("change", (e) => {
        loadFlag(e.target); // calling log flags with passing target element as an argument
    });
};


// defining a function for calling flags
const loadFlag = element => {
    for (code in country_code) {
        if (code == element.value) { // if corruncy code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // selecting img tag for particuler drop list            
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://www.countryflags.io/${country_code[code]}/flat/64.png`;
        }
    }
}


window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// let change the convert icon

let exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value; // tempory currency code of from drop list 
    fromCurrency.value = toCurrency.value; // passing to currency code  to From currency code 
    toCurrency.value = tempCode; // passing temporary currency code to TO curency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element  (fromCurrency) of FROM 
    loadFlag(toCurrency); // calling loadFlag with passing select element  (toCurrency) of to 
    getExchangeRate();
})

const getExchangeRate = () => {
    const amount = document.querySelector(".amount input")
    let exchangeRatetxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    // if user input 0 value then w'll put 1 value by default in the input field
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRatetxt.innerHTML = "Getting Exchange Rate..."
    let url = `https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromCurrency.value}`;
    // fetching api responce and returning it with parsing into js obj nad in another then method result 
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        // console.log(exchangeRate);
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        // console.log(totalExchangeRate)
        exchangeRatetxt.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() => {
        // if user is offline or any other error occured while fetching data then catch error
        exchangeRatetxt.innerHTML = "Something went Wrong";
    })
};