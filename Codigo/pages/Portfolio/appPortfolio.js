/*
------- SUMÁRIO -------

- chamadas de API;
- Parte do Câmbio;
- Parte dos rendimentos;
- Parte de apresentação de informações;

*/


// chamadas de API
getAPIData();// API para os valores de cambio:

let cronometro_2 = 500;
//Chamadas consecutivas da API para obter os antigos valores de criptomoeda compradas pelo usuário:
for (let index = 0; index < db.cripto.length; index++) {
    const cripto = db.cripto[index];
    setTimeout(() => {valoresAntigos(cripto.nome, cripto.data)}, cronometro_2);// Atrasa as chamadas para manter a ordem de respostas
    cronometro_2 +=70;
}

let cronometro = 500;
//Chamadas consecutivas da API para obter os atuais valores de criptomoeda compradas pelo usuário:
for (let index = 0; index < db.cripto.length; index++) {
    const cripto = db.cripto[index];
    setTimeout(() => {valoresAtuais(cripto.nome)}, cronometro);// Atrasa as chamadas para manter a ordem de respostas
    cronometro +=70;
}

function start() {

    //EXECUTA DEPOIS DAS RESPOSTAS DE API

    listaCriptos();// monta a tabela com os criptos
    calculaPatrimonio(); //soma os valores de compra para ter o patrimonio e joga para a tela o resultado
    desenhaGrafico(); // desenha grafico_cripto na tela
    

}

// É executada quando o usuário troca de câmbio:
function alteraCambio() {
    listaCriptos();// monta a tabela com os criptos
    calculaPatrimonio(); //soma os valores de compra para ter o patrimonio
    desenhaGrafico(); // desenha grafico_cripto 
    testando();
}



//----- PARTE DO CAMBIO ------------
//variaveis para essa parte:
// valores relativos das moedas:
let dolar;    // dolar -> real
let euro;    // euro -> real
let usdeur; // dolar -> euro
let eurusd;// euro -> dolar

function getAPIData() {

    //API COM AS COTAÇÕES DAS MOEDAS
    var xhr = new XMLHttpRequest();
    xhr.onload = valoresCotacao;
    xhr.open('GET', 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,USD-EUR,EUR-USD');
    xhr.send();
}
// Complexo de Golgi -> transfere os valores para as variaveis adequadas
function valoresCotacao() {
    let dados = JSON.parse((this.responseText));
    dolar = parseFloat(dados.USDBRL.high);
    euro = parseFloat(dados.EURBRL.high);
    usdeur = parseFloat(dados.USDEUR.high);
    eurusd = parseFloat(dados.EURUSD.high);
}

// Recebe um valor e a moeda de compra e adequa ao cambio desejado pelo usuário: Devolve um float
function trataCambio(valor, moeda) {

    //Obtem a moeda que o usuário deseja:
    let cambio = document.getElementById('cambio').value;

    if (cambio == 'BRL') {
        //Transforma os valores para o real

        if (moeda == 'USD') {
            return valor = parseFloat(valor) * dolar;
        } else if (moeda == 'EUR') {
            return valor = parseFloat(valor) * euro;
        } else {
            return valor = parseFloat(valor);
        }

    } else if (cambio == 'USD') {
        //Transforma os valores para o dolar

        if (moeda == 'BRL') {
            return valor = parseFloat(valor) / dolar;
        } else if (moeda == 'EUR') {
            return valor = parseFloat(valor) * usdeur;
        } else {
            return valor = parseFloat(valor);
        }

    } else if (cambio == 'EUR') {
        //Transforma os valores para o euro

        if (moeda == 'BRL') {
            return valor = parseFloat(valor) / euro;
        } else if (moeda == 'USD') {
            return valor = parseFloat(valor) * eurusd;
        } else {
            return valor = parseFloat(valor);
        }
    }
}
//----- FIM DA PARTE DO CAMBIO ------------

//----- PARTE DOS RENDIMENTOS ------------

// variaveis para essa parte:
let valorDatadoR = [];// Lista de valores antigos de criptos comprados pelo em reais.
let valorDatadoD = [];// Lista de valores antigos de criptos comprados pelo em dolar.
let valorDatadoE = [];// Lista de valores antigos de criptos comprados pelo em euro.
let valorAtualR = []; // salva o valor atual da cripto em reais
let valorAtualD = []; // salva o valor atual da cripto em dolar
let valorAtualE = []; // salva o valor atual da cripto em euro

 
// API: PARA VALORES ANTIGOS:

//Recupera o valor da criptomoeda na data comprada pelo usuário ;
function valoresAntigos(cripto, data) {
    //entrada da data precisa ser no formato: dd-mm-yyyy
    // Tratando a data para o formato adequado:
    let dataF =new Date(data);
    let dataFormatada = (dataF.getDate() + 1) + '-' + (dataF.getMonth() + 1) + '-' + dataF.getFullYear();
    
    var xhr = new XMLHttpRequest();
    xhr.onload = transfereDadosAntigos;
    xhr.open('GET', `https://api.coingecko.com/api/v3/coins/${cripto}/history?date=${dataFormatada}&localization=false`);
    xhr.send();
}

//Complexo de Golgi -> Recebe os valores antigos e os direciona para a lista adequada;
function transfereDadosAntigos() {

    let dados = JSON.parse(this.responseText);
    // console.log(dados.market_data.current_price.brl);
    valorDatadoR.push(dados.market_data.current_price.brl);
    valorDatadoD.push(dados.market_data.current_price.usd);
    valorDatadoE.push(dados.market_data.current_price.eur);

    //Preencimento da lista de valores antigos de criptos comprados pelo usuário.
}

// API: valores atuais das criptos compradas;
function valoresAtuais(cripto) {

    var xhr = new XMLHttpRequest();
    xhr.onload = transfereDadosAtuais;
    xhr.open('GET', `https://api.coingecko.com/api/v3/coins/${cripto}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    xhr.send();
}

//Complexo de Golgi -> Recebe os valores antigos e os direciona para a lista adequada;
function transfereDadosAtuais() {

    let dados = JSON.parse(this.responseText);

    //Preencimento da lista de valores atuais de criptos comprados pelo usuário.
    valorAtualR.push(dados.market_data.current_price.brl);
    valorAtualD.push(dados.market_data.current_price.usd);
    valorAtualE.push(dados.market_data.current_price.eur);
}

//Recebe um valor, a moeda de compra, e o id -1 (posição na lista): devolve um float
function calculaRendimentos(valor, moeda, index) {
    let rendiBruto; // o valor  do rendimento bruto:
    let convercao; // o valor de entrada convertida no valor de cripto respectivo

    if (moeda == 'BRL') {
        convercao = parseFloat(valor / valorDatadoR[index]);
        rendiBruto = parseFloat(convercao * valorAtualR[index]);
    } else if (moeda == 'USD') {
        convercao = parseFloat(valor / valorDatadoD[index]);
        rendiBruto = parseFloat(convercao * valorAtualD[index]);
    } else if (moeda == 'EUR') {
        convercao = parseFloat(valor / valorDatadoE[index]);
        rendiBruto = parseFloat(convercao * valorAtualE[index]);
    }

    return rendiBruto;
}

// devolve a variação percentual da entrada de dinheiro do usuário: devolve um float
function PorcentagemRendi(entrada, rendimento) {
    let percentual = ((rendimento- entrada) / entrada) * 100;
    return percentual;
}

// Serve para averiguar resultados no console
function testando() {
    
    for (let index = 0; index < db.cripto.length; index++) {

        console.log('valor atual r ' + index + ' ' + valorAtualR[index]);
        console.log('valor Datado r ' + index + ' ' + valorDatadoR[index]);
        console.log('valor atual d ' + index + ' ' + valorAtualD[index]);
        console.log('valor Datado d ' + index + ' ' + valorDatadoD[index]);
        console.log('valor atual e ' + index + ' ' + valorAtualE[index]);
        console.log('valor Datado e ' + index + ' ' + valorDatadoE[index]);
    }
}


//----- FIM PARTE DOS RENDIMENTOS ------------

// ---- Parte da Apresentação de informações ------

function listaCriptos() {


    // limpa a lista de criptos apresentados
    $("#table-criptos").empty();

    // Popula a tabela com os registros do banco de dados
    for (let index = 0; index < db.cripto.length; index++) {
        const cripto = db.cripto[index];
        let valor;
        let rendiBruto;
        let percentaul;

        //Tratando a data - formato: dd-mm-yyyy
        let data =new Date(cripto.data);
        let dataFormatada = (data.getDate() + 1) + '-' + (data.getMonth() + 1) + '-' + data.getFullYear();

        // TRATANDO A QUESTÃO DO CAMBIO: 
        
        valor = trataCambio(cripto.valor, cripto.moeda);
        rendiBruto = trataCambio(calculaRendimentos(cripto.valor, cripto.moeda, index), cripto.moeda);
        percentaul = PorcentagemRendi(cripto.valor,rendiBruto);
        
        $("#table-criptos").append(`<tr><td scope="row">${cripto.id}</td>
                                            <td>${cripto.nome}</td>
                                            <td>${dataFormatada}</td>
                                            <td>${valor.toFixed(2)}</td>
                                            <td>${rendiBruto.toFixed(2)}</td>
                                            <td>${percentaul.toFixed(2)}%</td>                                       
                                        </tr>`);
    }
}

function calculaPatrimonio() {

    //limpa o div
    $("#patrimonio").empty();

    // variaveis com elementos HTML:
    let cambio = document.getElementById('cambio').value;
    let patrimonio = document.getElementById('patrimonio');

    //variaveis locais:
    let total = 0;
    let strHtml = '';
    let valor = 0;
    let simbolo;

    for (let index = 0; index < db.cripto.length; index++) {
        const cripto = db.cripto[index];
        valor = trataCambio(calculaRendimentos(cripto.valor,cripto.moeda,index), cripto.moeda);
       // valor = trataCambio(cripto.valor, cripto.moeda);

        total += valor; // soma os valores após as tranformações;
    }

    if (cambio == 'BRL') {
        simbolo = 'R$';
    } else if (cambio == 'USD') {
        simbolo = 'US$';
    } else if (cambio == 'EUR') {
        simbolo = '€';
    }

    strHtml += `<h1><strong> Patrimônio: </strong> ${simbolo} ${total.toFixed(2)}</h1> `;
    patrimonio.innerHTML = strHtml;

}

// Construção do grafico-cripto
function desenhaGrafico() {
    let nome = [10];
    let valor = [10];

    for (let index = 0; index < db.cripto.length; index++) {
        const cripto = db.cripto[index];

        nome[index] = cripto.nome;

        valor[index] = trataCambio(calculaRendimentos(cripto.valor,cripto.moeda,index), cripto.moeda);
        //valor[index] = trataCambio(cripto.valor, cripto.moeda);
    }

    //-----------------------------------------------------------
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

        var data = google.visualization.arrayToDataTable([
            ['cripto', 'value per total'],
            [nome[0], valor[0]],
            [nome[1], valor[1]],
            [nome[2], valor[2]],
            [nome[3], valor[3]],
            [nome[4], valor[4]],
            [nome[5], valor[5]],
            [nome[6], valor[6]],
            [nome[7], valor[7]],
            [nome[8], valor[8]],
            [nome[9], valor[9]]
        ]);

        var options = {
            title: 'Distribuição das criptomoedas na carteira',
            pieHole: 0.4,
        };


        var chart = new google.visualization.PieChart(document.getElementById('graficoCripto'));
        chart.draw(data, options);
    }
}
// ---- Fim da Parte da Apresentação de informações ------