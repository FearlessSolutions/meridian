var csv = require('ya-csv');
var uuid = require('node-uuid');

var db = {};
var LAT_INDEX = 0;
var LON_INDEX = 1;
var indexToKeyName = {};

function init(){
    console.log("Loading mock data set");
    var isFirstRow = true;
    var records = 0;
    var reader = csv.createCsvFileReader('server/components/mock/Random-Points-250k.csv');
    reader.addListener('data', function(data) {
        var i;

        if (isFirstRow){
            isFirstRow = !isFirstRow;

            for (i = 0; i < data.length; i++) {
                indexToKeyName[i] = data[i];
            }

        } else {
            var obj = {};


            // Convert data to GeoJSON
            obj["type"] = "Feature";
            obj["geometry"] = {
                "type": "Point",
                "coordinates": []
            };
            obj["properties"] = {
                "classification": "U"
            };

            for (i = 0; i < data.length; i++) {
                // why am i doing this pls halp
                if(indexToKeyName[i] === "count"){
                   obj.properties[indexToKeyName[i]] = parseInt(data[i]);
                } else if (indexToKeyName[i] === "lat" ||
                    indexToKeyName[i] === "lon" ||
                    indexToKeyName[i] === "percent"){
                    obj.properties[indexToKeyName[i]] = parseFloat(data[i]);
                } else {
                    obj.properties[indexToKeyName[i]] = data[i];
                }

            }
            obj.properties.featureId = uuid.v4();

            // Coordinates are lon,lat per GeoJSON spec
            obj.geometry.coordinates = [parseFloat(data[LON_INDEX]), parseFloat(data[LAT_INDEX])];

            db[obj.properties.featureId] = obj;
            records += 1;
        }
    });
    reader.addListener('end', function(){
        console.log("Mock set loaded with " + records + " records");
    });
}
init();

exports.query = function(minLat, maxLat, minLon, maxLon, start, pageSize, throttleMs, pageCallback){
    var response = [];
    var recordNum = 0;

    var pageLagCallback = function(){
        pageCallback(response, true);
    };

    for (var uuid in db){
        if (db.hasOwnProperty(uuid)){
            var lat = db[uuid].geometry.coordinates[1];
            var lon = db[uuid].geometry.coordinates[0];
            if (minLat <= lat && lat <= maxLat &&
                minLon <= lon && lon <= maxLon){

                recordNum += 1;
                // World's most efficient cursor right here folks
                if (recordNum > start){
                    response.push(db[uuid]);
                }

            }
        }
        if (response.length === pageSize){
            setTimeout(pageLagCallback, throttleMs || 0);

            return;
        }
    }
    setTimeout(pageLagCallback, throttleMs || 0);
};

exports.getById = function(id){
    return db[id];
};