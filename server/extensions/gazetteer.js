const http = require('http');

const app = require('server/app');
const auth = require('server/extensions/auth');

module.exports = {
    query: query
};

app.get('/gaz', auth.verifyUser, function(req, res){
    query(req, function (response){
        if(response.status === 200){
            res.status(200);
            res.send(response.response);
        } else {
            res.status(500);
            res.send(response);
        }
    });
});

function query(req, callback){
	const option = {
		hostname: "maps.googleapis.com",
		path: "/maps/api/geocode/json" + req._parsedUrl.search,
		method: "get"
	},
	gazGet = http.request(option, function(response){
		let resData = "";

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

	gazGet.end();
}
