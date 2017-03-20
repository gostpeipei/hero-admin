var fs = require('fs')
// var path = require('path')
var handler = require('./handler')

function router (req, res) {
	//定义重定向
	res.redirect = function(location){
		res.writeHead(302,{
			'location': location
		})
		res.end()
	}

	var url = req.url;
	if(url === '/'){
		handler.showIndex(req, res)
	}else if(url.indexOf('/public/') === 0 || url.indexOf('/node_modules/') === 0){
		handler.showStatic(req, res)
	}else if(url === '/add'){
		handler.add(req, res)
	}else if(url.indexOf('/addInfo') === 0){
		handler.addInfo(req, res)
	}else if(url.indexOf('/remove') === 0){
		handler.remove(req, res)
	}else if(url.indexOf('/edit') === 0){
		handler.edit(req, res)
	}else if(url.indexOf('/upload') === 0){
		handler.upload(req, res)
	}
}

module.exports = router;