
const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_RonSgxSmgiAmHESrSZe7vWRPQic2dFuucHw4Dnh0"; // Replace with your actual API key

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const swapIcon = document.querySelector(".swapIcon");
const msg = document.querySelector(".msg");

for (let select of dropdown) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerHTML = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};



swapIcon.addEventListener("click", async () => {
    // Swap selected currencies
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    await convertCurrency();
});

// Event listener for convert button
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    // Construct URL for fetching exchange rate
    const URL = `${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
    
    try {
        let response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        let data = await response.json();
        
        let rate = data.data[toCurr.value];
        
        let finalAmount = amtVal * rate;
        
        msg.innerHTML = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        msg.innerHTML = "There was an error fetching the exchange rate. Please try again.";
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });