var fs = require('fs')
var path = require('path')

var dataPath = path.join(__dirname, 'data.json')

function Hero (item) {
	this.id = item.id,
	this.name = item.name,
	this.gender = item.gender,
	this.avatar = item.avatar
}

//不需要每次使用都new  添加到静态成员
//获取data.json数据
Hero.getHerosData = function (callback) {
	fs.readFile(dataPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		callback(null,JSON.parse(data))
	})
}

//更新数据
Hero.update = function (data, callback) {
	data = JSON.stringify(data, null, '  ')
	fs.writeFile(dataPath, data, function (err) {
		if(err){
			return callback(err)
		}
		callback(null)
	})
}

//保存数据
Hero.prototype.save = function(callback){
	var that = this
	Hero.getHerosData(function(err,data){
		if(err){
			throw err
		}
		data.heros.push({
			id: that.id,
			name: that.name,
			gender: that.gender,
			avatar: that.avatar
		})
		Hero.update(data,callback)
	})
}

//根据ID获取
Hero.getById = function( id, callback ){
	this.getHerosData(function(err, data){
		if(err){
			return callback(err)
		}
		data.heros.some(function(value,index){
			if(value.id === id){
				callback(null, value, index, data)
				return true
			}
		})
	})
}

module.exports = Hero;