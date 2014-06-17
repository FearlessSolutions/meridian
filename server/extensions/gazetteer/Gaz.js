var http = require('http');

exports.query = function(req, callback){
	var option = {
		hostname: "maps.googleapis.com",
		path: "/maps/api/geocode/json" + req._parsedUrl.search,
		method: "get"
	},
	gazGet = http.request(option, function(response){

		var resData = "";

		response.on('data', function(data){
			resData += data.toString();
		});

		response.on('end', function(data){
			if (data){
				resData += data.toString();
			}

			callback({
				status: 200,
				response: JSON.parse(resData.toString())
			});
		});

		response.on('error', function(error){
			callback({
				status: 500,
				response: error
			});
		});
	});

	gazGet.on('error', function(error){
		callback({
			status: 500,
			response: error
		});
	});

	//gazGet.write("");
	gazGet.end();
};