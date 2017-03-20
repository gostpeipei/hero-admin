var http = require('http')
var router = require('./router')

http.createServer( function (req, res) {
	router(req, res)
})
.listen(3000, function () {
	console.log('The Server is running at port 3000...')
})