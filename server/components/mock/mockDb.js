const _ = require('lodash');
const csv = require('ya-csv');
const generateUUID = require('node-uuid').v4;

const app = require('server/app');
const auth = require('server/extensions/auth');

const LAT_INDEX = 0;
const LON_INDEX = 1;
const COLOR_INDEX = 2;
const PERCENT_INDEX = 3;
const COUNT_INDEX = 3;
const VALID_INDEX = 3;

let db = [];

module.exports = {
    query: query
};

/**
 * curl -XPOST https://localhost:8000/query/bbox/mock -d'{"minLat":"40","maxLat":"50","minLon":"40","maxLon":"50"}' --cert sean.pines.p12:schemaless --insecure --header "Content-Type:application/json"
 * @param app
 */
app.post('/rest/query/bbox/mock', auth.verifyUser, function(req, res){
    const newMetadata = req.body.metadata;
    const newQuery = req.body.query;

    query(
        parseFloat(newMetadata.minLat),
        parseFloat(newMetadata.maxLat),
        parseFloat(newMetadata.minLon),
        parseFloat(newMetadata.maxLon),
        +newQuery.start,
        +newQuery.pageSize,
        newQuery.throttleMs ? +newQuery.throttleMs : 0,
        function(page){
            res.status(page.length ? 200 : 204);
            res.send(page);
        }
    );
});

console.log('Loading mock data set');

let isFirstRow = true,
    records = 0,
    reader = csv.createCsvFileReader('server/components/mock/Random-Points-250k.csv');

reader.addListener('data', function(data){
    if (isFirstRow){ //Ignore headers, since we already know what they are
        isFirstRow = false;
    } else {
        const lat = parseFloat(data[LAT_INDEX]);
        const lon = parseFloat(data[LON_INDEX]);

        db.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lon, lat] // Coordinates are lon,lat per GeoJSON spec
            },
            properties: {
                featureId: generateUUID(),
                lat: lat,
                lon: lon,
                color: data[COLOR_INDEX],
                percent: parseFloat(data[PERCENT_INDEX]),
                count: parseFloat(data[COUNT_INDEX]),
                valid: data[VALID_INDEX],
                source: 'mock'
            }
        });
        records += 1;
    }
});
reader.addListener('end', function(){
    console.log(`Mock set loaded with ${records} records`);
});

function query(minLat, maxLat, minLon, maxLon, start, pageSize, throttleMs, pageCallback){
    let response = [],
        recordNum = 0;

    _.every(db, (feature) => { //Every allows us to iterate until we're done or the end.
        const lat = feature.properties.lat;
        const lon = feature.properties.lon;

        if (minLat <= lat && lat <= maxLat &&
            minLon <= lon && lon <= maxLon){

            recordNum += 1;

            if (recordNum > start){
                let tempRecord = _.cloneDeep(feature);

                tempRecord.properties.featureId = generateUUID(); // Per Query, ensure a unique featureIDs per record returned from the mock data service (overwrite featureID assigned to mock local DB)
                response.push(tempRecord);

                if(response.length === pageSize){
                    return false; //End the loop
                }
            }
        }

        return true; //Continue the loop
    });

    setTimeout(function(){
        pageCallback(response, true);
    }, throttleMs || 0);
}
