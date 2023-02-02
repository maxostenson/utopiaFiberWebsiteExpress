//Express declaration
var express = require('express');
var app = express();

//Other declarations
var config = require('./config.js');
var mysql = require('mysql')

//Set pug as view engine and include views folder
app.set('view engine', 'pug');
app.set('views', './views');

//Importing files
app.use(express.static(__dirname + '/css'));

//Seting up database connection
const connection = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE
});

connection.connect();

//Default URI redirects to home
app.get('/', function (req, res) {
    res.redirect('/home');
})

//Home route
app.get('/home', function (req, res) {

    //Initialize city array
    var cityList = [];

    //Fetch list of cities from database
    query = 'SELECT cityId, cityName FROM cities';
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        //Turn each retrieved row into object and add to city array
        rows.forEach(row => {
            var cityObject = {
                'cityId': row.cityId,
                'cityName': row.cityName
            };
            cityList.push(cityObject);
        });

        //Render home page with city list
        res.render('home', {
            cityList: cityList
        });
    });
});

//City route
app.get('/city/:cityid', function (req, res) {

    //Initialize park array
    var parkList = [];

    //Fetch list of cities from database
    query = 'SELECT parkId, parkName FROM parks WHERE ownerId = ' + req.params.cityid;
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        //Turn each retrieved row into object and add to city array
        rows.forEach(row => {
            var parkObject = {
                'parkId': row.parkId,
                'parkName': row.parkName
            };
            parkList.push(parkObject);
        });

        //Render home page with city list
        res.render('city', {
            cityParkList: parkList
        });
    });
});

//Park route
app.get('/park/:parkid', function (req, res) {
    res.render('park')
});

//Start server
app.listen(3000);