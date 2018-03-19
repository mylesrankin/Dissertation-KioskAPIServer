var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var auth = require('./modules/auth.js')
var app = express()
var mid = require('node-machine-id')

console.log(mid.machineIdSync())

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

var server = http.createServer(app)
auth.test()
// Reload code here

server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})
