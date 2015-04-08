var fs = require('fs'),
    ogr2ogr = require('ogr2ogr'),
    transformationConfig = { // Defaults from the OGR2OGR module
        projection: 'EPSG:4326',
        format: 'GeoJSON',
        timeout: 15000,
        skipFailures: false,
        options: []
    };

exports.toGeoJSON = function(dataIn, callback) {
    exports.execute({
        dataIn: dataIn,
        callback: callback,
        format: 'GeoJSON',
        skipFailures: true
    });
};

/**
 * NOTE This is impractical except for small batches (no streaming) because
 *      ogr2ogr cannot apply headers dynamically, or for only the first batch.
 * @param streamIn
 * @param streamOut
 */
exports.toCSV = function(streamIn, streamOut) {
    exports.execute({
        streamIn: streamIn,
        streamOut: streamOut,
        format: 'CSV',
        skipFailures: true
    });
};

exports.toKML = function(dataIn, callback) {
    exports.execute({
        dataIn: dataIn,
        callback: callback,
        format: 'KML',
        skipFailures: true
    });
};

exports.toShapefile = function(streamIn, streamOut) {
    exports.execute({
        streamIn: streamIn,
        streamOut: streamOut,
        format: 'ESRI Shapefile',
        skipFailures: true
    });
};

exports.execute = function(params) {
    if(params.dataIn && params.callback) {
        try {
            ogr2ogr(params.dataIn)
                .project(params.projection || transformationConfig.projection)
                .format(params.format || transformationConfig.format)
                .timeout(params.timeout || transformationConfig.timeout)
                .skipfailures(params.skipFailures || transformationConfig.skipFailures)
                .options(params.options || transformationConfig.options)
                .exec(params.callback);
        }
        catch(err) {
            console.log(err); //The above callback is still being called on error, and this is causing it to be called twice
        }
    }
};

/**
 * Convert CSV filestream to geoJSON for processing
 * @param file Filestream
 * @param callback function(error, data) Should handle error or processed data (if error, no data)
 */
exports.fromCSV = function(file, callback){
    console.log("Import CSV file");
    ogr2ogr(file, 'csv').exec(function(er, data){
        callback(er, data);
    });
};

/**
 * Convert KML filestream to geoJSON for processing
 * @param file Filestream
 * @param callback function(error, data) Should handle error or processed data (if error, no data)
 */
exports.fromKML = function(file, callback){
    console.log("Import KML file");
    ogr2ogr(file, 'KML').exec(function(er, data){
        callback(er, data);
    });
};

/**
 * Convert geoJSON filestream to geoJSON for processing
 * @param file Filestream
 * @param callback function(error, data) Should handle error or processed data (if error, no data)
 */
exports.fromGeoJSON = function(file, callback){
    console.log("Import GeoJSON file");
    ogr2ogr(file, 'GeoJSON').exec(function(er, data){
        callback(er, data);
    });
};
