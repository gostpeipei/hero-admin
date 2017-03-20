var fs = require('fs')
var path = require('path')
var url = require('url')
var template = require('art-template')
var queryString = require('querystring')  //处理post请求发送的数据 核心模块
var formidable = require('formidable')   //处理post发送的带有文件的请求 第三方包
var Hero = require('./model')

module.exports = {
	showIndex: function (req, res){
		fs.readFile(path.join(__dirname, 'views/index.html'), 'utf8', function (err, tplData){
			if(err){
				return res.end('404 Not Found.')
			}
			Hero.getHerosData(function(err, data){
				if(err){
					throw err
				}
				res.end( template.compile(tplData)(data) )
			})
		})
	},
	showStatic: function(req, res){
		fs.readFile(path.join(__dirname, req.url), function (err, data){
			if(err){
				return res.end('404 Not Found.')
			}
			res.end(data)
		})
	},
	add: function(req, res){
		fs.readFile(path.join(__dirname, 'views/add.html'), 'utf8', function(err, data){
			if(err){
				return res.end('404 Not Found.')
			}
			res.end(data)
		})
	},

	//get方式提交数据获取方法
	// addInfo: function(req, res){
	// 	var urlObj = url.parse(req.url, true);
	// 	var query = urlObj.query;
	// 	var pathname = urlObj.pathname;
	// 	fs.readFile(path.join(__dirname, 'data.json'), function(err, data){
	// 		if(err){
	// 			throw err
	// 		}
	// 		data = JSON.parse(data)
	// 		data.heros.push({
	// 			id: data.heros[data.heros.length - 1].id + 1,
	// 			name: query.name,
	// 			gender: query.gender,
	// 			avatar: '118.jpg'
	// 		})
	// 		data = JSON.stringify(data,null,'  ')
	// 		fs.writeFile(path.join(__dirname, 'data.json'), data, function(err){
	// 			if(err){
	// 				throw err
	// 			}
	// 			res.writeHead(200,{
	// 				"Content-Type": "text/html;charset=utf-8"
	// 			})
	// 			res.end('添加成功')
	// 		})
	// 	})
	// },

	//post方式提交数据获取方法
	// addInfo: function(req, res){
	// 	var query = '';
	// 	req.on('data', function (chunk) {
	// 		query += chunk
	// 	})
	// 	req.on('end', function () {
	// 		query = queryString.parse(query);
	// 		fs.readFile(path.join(__dirname, 'data.json'), function(err, data){
	// 			if(err){
	// 				throw err
	// 			}
	// 			data = JSON.parse(data)
	// 			data.heros.push({
	// 				id: data.heros[data.heros.length - 1].id + 1,
	// 				name: query.name,
	// 				gender: query.gender,
	// 				avatar: '180.jpg'
	// 			})
	// 			data = JSON.stringify(data, null, '  ')

	// 			fs.writeFile(path.join(__dirname, 'data.json'), data, function(err){
	// 				if(err){
	// 					throw err
	// 				}
	// 				res.writeHead(200, {
	// 					"Content-Type": "text/html;charset=utf-8"
	// 				})
	// 				res.end('完毕')
	// 			})
	// 		})
	// 	})
	// }
	//post 发送有文件的数据
	addInfo: function(req, res){
		var form = new formidable.IncomingForm();

		form.uploadDir = path.join(__dirname, 'public/img/')
		form.keepExtensions = true;

		form.parse(req, function (err, fields, files) {
			if(err){
				throw err
			}
			//更改保存路径
			Hero.getHerosData(function(err, data){
				if(err){
					throw err
				}
				var hero = new Hero({
					id: data.heros[data.heros.length - 1].id + 1,
					name: fields.name,
					gender: fields.gender,
      		avatar: path.basename(files.avatar.path)
				})
				hero.save(function(err){
					if(err){
						throw err
					}
					res.redirect('/')
				})
			})
		})
	},


	//删除数据
	remove: function(req, res){
		var urlObj = url.parse(req.url, true);
		var id = urlObj.query.id - 0;

		Hero.getById(id, function(err, hero, index, data){
			if(err){
				throw err
			}

			data.heros.splice(index,1)

			Hero.update(data, function(err){
				if(err){
					throw err
				}
				res.redirect('/')
			})
		})
	},

	//编辑
	edit: function(req, res){
		var urlObj = url.parse(req.url, true);
		var id = urlObj.query.id - 0;
		fs.readFile(path.join(__dirname, 'views/edit.html'), 'utf8', function(err, tplData){
			if(err){
				return res.end('404 Not Found.')
			}
			Hero.getById(id, function(err, hero, index, data){
				if(err){
					throw err
				}
				res.end(template.compile(tplData)(hero))
			})
		})
	},

	//提交编辑
	upload: function(req, res){

		var form = new formidable.IncomingForm()
		form.parse(req, function(err, fields, files){
			var id = fields.id - 0;
			console.log(id)
			Hero.getById(id, function(err, hero, index, data){
				if(err){
					throw err
				}
				console.log('suc')
				hero.name = fields.name
				hero.gender = fields.gender
				Hero.update(data, function(err){
					if(err){
						throw err
					}
					res.redirect('/')
				})
			})
		})
	}
}