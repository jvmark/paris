var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var proxy = require('express-http-proxy');

var duitangRouter = require('./routes/DuitangAPIRouter');
var buyAdminRouter = require('./routes/BuyAdminAPIRouter');
var apiRouter = require('./routes/APIRouter');

var APIResponseMiddleware = require('./middlewares/APIResponseMiddleware');
var SessionMiddleware = require('./middlewares/SessionMiddleware');
var AuthMiddleware = require('./middlewares/AuthMiddleware');
var ServiceMiddleware = require('./middlewares/ServiceMiddleware');

var port = process.env.PORT || 3000;

// 模板
app.engine('handlebars', exphbs({
	// defaultLayout: 'main'
	layoutsDir: __dirname
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname);

// 工具
var tool_urls = [
	'/tools/power_search/',
	'/tools/ticket_merge',
	'/tools/ticket_merge',
	'/tools/feedback_link',
	'/tools/inventory_dump',
	'/tools/spu_dump',
	'/static/css/home.css',
	'/static/bundle.index.js',
	'/search',
	'/shorturl',
	'/parse_excel',
	'/dump_excel',
	'/dump_inventories',
	'/dump_spus',
	'/excel'
];

for (var i = 0; i < tool_urls.length; i++) {
	var url = tool_urls[i];
	app.use(url, proxy('127.0.0.1:3001', {
		forwardPath: function(req, res) {
			console.log(req.originalUrl);
			return req.originalUrl;
		}
	}));
}

app.use(APIResponseMiddleware);
app.use(SessionMiddleware);
app.use(AuthMiddleware);
app.use(ServiceMiddleware);

// cookie 解析
app.use(cookieParser());

// body 解析
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());


app.use('/napi/buyadmin/', buyAdminRouter);
app.use('/napi/', buyAdminRouter);
app.use('/api/', apiRouter);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function() {
	console.log('Example app listening on port ' + port);
});