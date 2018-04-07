var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var app = express()
var screen = require('./modules/screen.js')

//var auth = require('./modules/auth.js')

// MySQL DB Details
const dbData = {
    host: "37.122.214.88",
    user: "kiosk-3a9r-u-175546",
    password: "T/hWJGF!Y",
    database: "kiosk-3a9r-u-175546"
}

var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded

app.get('/', function (req, res) {
    res.send('API Server Aliveggg');
})

app.get('/test', function(req,res){
    res.json({
        status: 'Alive',
        data: {
            title: 'test',
            content: 'more testing'
        }
    })
})

app.get('/screen/adverts/:id', function(req,res){
    screen.getScreenAdverts(dbData, req.params.id, function(result){
        res.json(result)
    })
})

var server = http.createServer(app)
//auth.test()
// Reload code here

server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})
