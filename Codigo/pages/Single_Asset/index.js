const siteName = 'Mentor';

// Format as currency
const formatCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Format as number
const formatNumber = new Intl.NumberFormat('pt-BR');

// 
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let query = params.id;

// Get screen elements
const assetId = document.querySelector('.asset-icon');
const assetRank = document.querySelector('.asset-rank');
const assetName = document.querySelector('.asset-name');
const assetTicker = document.querySelector('.asset-ticker');
const assetMarketcap = document.querySelector('.asset-marketcap');
const assetVolume = document.querySelector('.asset-volume');
const assetPrice = document.querySelector('.asset-price');
const assetIcon = document.querySelector('.asset-icon');
const assetExchanges = document.querySelector('.asset-exchanges');
const assetHistory = document.querySelector('.asset-history');
const high24h = document.querySelector('.asset-high24h');
const low24h = document.querySelector('.asset-low24h');
const assetAth = document.querySelector('.asset-ath');
const assetAtl = document.querySelector('.asset-atl');
const assetTotalSupply = document.querySelector('.asset-total-supply');
const assetCirculatingSupply = document.querySelector(
    '.asset-circulating-supply'
);
const chart = document.querySelector('.asset-chart');

addEventListener('load', getAPIData)

// Get API data
function getAPIData() {
    const url = `https://api.coingecko.com/api/v3/coins/${query}?tickers=false`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Changes HTML data
            document.title = `${data.name} | Preço, Volume, Perfil | ${siteName}`;
            assetRank.innerHTML = `${data.market_cap_rank}º`;
            assetName.innerHTML = `${data.name} (${data.symbol.toUpperCase()})`;
            assetIcon.src = data.image.thumb;
            high24h.innerHTML = `<strong>Máximo (24h):</strong> ${formatCurrency.format(
                data.market_data.high_24h.brl
            )}`;
            low24h.innerHTML = `<strong>Mínimo (24h):</strong> ${formatCurrency.format(
                data.market_data.low_24h.brl
            )}`;
            assetPrice.innerHTML = formatCurrency.format(
                data.market_data.current_price.brl
            );
            assetMarketcap.innerHTML = `<strong>Capitalização de mercado:</strong> ${formatCurrency.format(
                data.market_data.market_cap.brl
            )}`;
            assetVolume.innerHTML = `<strong>Volume (24h):</strong> ${formatCurrency.format(
                data.market_data.total_volume.brl
            )}`;
            assetAth.innerHTML = `<strong>Máximo histórico:</strong> ${formatCurrency.format(
                data.market_data.ath.brl
            )}`;
            assetAtl.innerHTML = `<strong>Mínimo histórico:</strong> ${formatCurrency.format(
                data.market_data.atl.brl
            )}`;
            assetTotalSupply.innerHTML = `<strong>Fornecimento total:</strong> ${formatNumber.format(
                data.market_data.total_supply.toFixed(2)
            )}`;
            assetCirculatingSupply.innerHTML = `<strong>Fornecimento em circulação:</strong> ${formatNumber.format(
                data.market_data.circulating_supply.toFixed(2)
            )} (${(
                (data.market_data.circulating_supply /
                    data.market_data.total_supply) *
                100
            ).toFixed(2)}%)`

            getAssetInfo(data.symbol)
            }
        )
}
