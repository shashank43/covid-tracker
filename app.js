//Express
const express = require('express');
const app = express();
const port = 3000;

//ejs
const ejs = require('ejs');

const dayjs = require('dayjs');

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("./public"));

//novelcovid package
const api = require('novelcovid');
api.settings({
    baseUrl: 'https://corona.lmao.ninja'
});

//Home route
app.get('/', async function(req, res){
    const global = await api.all();
    const confirmedCases = thousands_separators(global.cases);
    const deaths = thousands_separators(global.deaths);
    const recovered = thousands_separators(global.recovered);
    const active = thousands_separators(global.active);

    const countries = await api.countries({ sort: 'cases'});

    // const updated = global.updated;
    // console.log(updated);

    //api.all().then(console.log)

    const covidData = {
        confirmedCases: confirmedCases,
        deaths: deaths,
        recovered: recovered,
        active: active,
        countries:countries,
    }
    res.render('home', covidData);
});

app.get('/data/:countryName', async function(req, res){
    const countryName = req.params.countryName;
    const country = await api.countries({country: countryName});
    console.log(country);
    res.render('country', {country: country});
});

function thousands_separators(num){
    let num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
} 

//App started
app.listen(port, function(req, res){
    console.log(`covid-tracker app listening at http://localhost:${port}`);
});