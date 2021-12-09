let priceBRL;

// Get API data
function getAPIData() {
    const url = `https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL`;
    fetch(url)
        .then(response => response.json())
        .then(data => {priceBRL = {data.USDBRL.bid}`
        }
}