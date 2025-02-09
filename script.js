
const droplist = document.querySelectorAll(".dropdown select"),
      getbutton = document.querySelector("form .btn button"),
      from_currency = document.querySelector(".from select"),
      to_currency = document.querySelector(".to select"),
      finalamount = document.querySelector("#final");

for (let i = 0; i < droplist.length; i++) {
    for (let currency_code in countryList) {
        let selected = (i === 0 && currency_code === "USD") ? "selected" :
                       (i === 1 && currency_code === "INR") ? "selected" : "";
        let optiontag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        droplist[i].insertAdjacentHTML("beforeend", optiontag);
    }
    droplist[i].addEventListener("change",(e)=>{
          loadflag(e.target);
    })
}
function loadflag(element){
    for(code in countryList){
        if(code == element.value){
            let imgTag=element.parentElement.querySelector("img");
            imgTag.src=`https://flagsapi.com/${countryList[code]}/flat/64.png`
        }
    }
}

const change=document.querySelector("form i");

change.addEventListener("click",(e)=>{
    let temp=to_currency.value;
    to_currency.value=from_currency.value;
    from_currency.value=temp;
    loadflag(from_currency);
    loadflag(to_currency);
    exchange();
})




window.addEventListener("load", () => {
    exchange();
});
getbutton.addEventListener("click", (e) => {
    e.preventDefault();
    exchange();
});

function exchange() {
    let amount = document.querySelector("form input");
    let amountval = amount.value;
    
    if (amountval === "" || amountval === "0") {
        amount.value = "1";
        amountval = 1;
    }
  finalamount.innerText="Getting exchange rate...";
    let to_currencyL = to_currency.value.toLowerCase();
    let from_currencyL = from_currency.value.toLowerCase();
    let url = `https://2025-01-08.currency-api.pages.dev/v1/currencies/${from_currencyL}.json`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangerate = result[from_currencyL][to_currencyL]; // Fixed API response parsing
            if (!exchangerate) {
                finalamount.innerText = "Exchange rate not found!";
                return;
            }
            let totalexchangerate = (exchangerate * amountval).toFixed(2);
            finalamount.innerText = `${amountval} ${from_currency.value} = ${totalexchangerate} ${to_currency.value}`;
        })
        .catch(error => {  //promise return reject 
            console.error("Error fetching exchange rate:", error);
            finalamount.innerText = "Failed to fetch exchange rate.";
        });
}
