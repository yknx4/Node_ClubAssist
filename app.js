/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var vars = require("./global.v");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({
    src: path.join(__dirname, 'public')
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var links = JSON.parse(fs.readFileSync('./json/links.json', 'utf8'));

function getPageParams(name) {
    var def = routesParams.defaultParams();
    var read = JSON.parse(fs.readFileSync('./configs/pages/' + name + '.json', 'utf8'));
    read.title = def.title + ' - ' + read.title;
    return vars.mergeJson(def, read);
}

links.forEach(function (obj, index, arr) {
    if (obj.file != "") {
        app.get(obj.url, function (req, res) {
            var d = getPageParams(obj.file);
            res.render(d.page_file, d);

        });
    }

});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});