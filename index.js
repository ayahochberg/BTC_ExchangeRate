const fetch = require('node-fetch');
var Airtable = require('airtable');

const COINAPI_BASE_URL = 'https://rest.coinapi.io';
const COINAPI_API_KEY = '';
const AIRTABLE_API_KEY = '';
const AIRTABLE_BASE_ID = 'appUowhaov3xThoFf';

var base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_ID);
const table = base('BTC Table');

async function storeExchangeRate() {
    setInterval(async function() {
        let data = await fetchData();
        createRecord(data);
    }, 60 * 1000)
}

async function fetchData() {
    try {
      const response = await fetch(`${COINAPI_BASE_URL}/v1/exchangerate/BTC/USD?apikey=${COINAPI_API_KEY}`, {method: 'GET'});
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
};

async function createRecord(data) {
    let record = {
        "fields" : {
            "Time": data.time,
            "Rates": data.rate
        }
    }
    
    await table.create([record], function(err) {
        if (err) {
          console.error(err);
          return;
        }
    });
}

storeExchangeRate();