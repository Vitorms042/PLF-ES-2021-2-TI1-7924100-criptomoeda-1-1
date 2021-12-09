import { assetID } from '../pages/Ranking/index.js';

export function getAssetData(id) {
    const url = `https://api.coingecko.com/api/v3/coins/${id}?tickers=false
    `;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let assetSymbol,
                assetName,
                assetHomePage,
                assetImageThumb,
                assetImageSmall,
                assetImageLarge;

            assetSymbol = data.symbol;
            assetName = data.name;
            assetHomePage = data.links.homepage;
            assetImageThumb = data.image.thumb;
            assetImageSmall = data.image.small;
            assetImageLarge = data.image.large;

            console.log(assetName);
            export assetSymbol;
        });
}
