var csv = require('ya-csv'),
    generateUUID = require('node-uuid').v4,

    db = {},
    LAT_INDEX = 0,
    LON_INDEX = 1,
    indexToKeyName = {};

function init(){
    console.log('Loading mock data set');
    var isFirstRow = true,
        records = 0,
        reader = csv.createCsvFileReader('server/components/mock/Random-Points-250k.csv');
    reader.addListener('data', function(data) {
        var i,
            obj;

        if (isFirstRow){
            isFirstRow = !isFirstRow;

            for (i = 0; i < data.length; i++) {
                indexToKeyName[i] = data[i];
            }

        } else {
            obj = {};


            // Convert data to GeoJSON
            obj['type'] = 'Feature';
            obj['geometry'] = {
                type: 'Point',
                coordinates: []
            };
            obj['properties'] = {
                classification: 'U'
            };

            for (i = 0; i < data.length; i++) {
                // why am i doing this pls halp
                if(indexToKeyName[i] === 'count'){
                   obj.properties[indexToKeyName[i]] = parseInt(data[i]);
                } else if (indexToKeyName[i] === 'lat' ||
                    indexToKeyName[i] === 'lon' ||
                    indexToKeyName[i] === 'percent'){
                    obj.properties[indexToKeyName[i]] = parseFloat(data[i]);
                } else {
                    obj.properties[indexToKeyName[i]] = data[i];
                }
            }
            obj.properties.featureId = generateUUID();

            // Coordinates are lon,lat per GeoJSON spec
            obj.geometry.coordinates = [parseFloat(data[LON_INDEX]), parseFloat(data[LAT_INDEX])];

            db[obj.properties.featureId] = obj;
            records += 1;
        }
    });
    reader.addListener('end', function(){
        console.log('Mock set loaded with ' + records + ' records');
    });
}
init();

exports.query = function(minLat, maxLat, minLon, maxLon, start, pageSize, throttleMs, pageCallback){
    var response = [],
        recordNum = 0,
        uuid,
        lat,
        lon,
        tempRecord;

    var pageLagCallback = function(){
        pageCallback(response, true);
    };

    for (uuid in db){
        if (db.hasOwnProperty(uuid)){
            lat = db[uuid].geometry.coordinates[1];
            lon = db[uuid].geometry.coordinates[0];
            if (minLat <= lat && lat <= maxLat &&
                minLon <= lon && lon <= maxLon){

                recordNum += 1;
                // World's most efficient cursor right here folks
                if (recordNum > start){
                    tempRecord = JSON.parse(JSON.stringify(db[uuid]));
                    tempRecord.properties.featureId = generateUUID(); // Per Query, ensure a unique featureIDs per record returned from the mock data service (overwrite featureID assigned to mock local DB)
                    response.push(tempRecord);
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