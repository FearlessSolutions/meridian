var fs = require('fs'),
    ogr2ogr = require('ogr2ogr'),
    transformationConfig = { // Defaults from the OGR2OGR module
        "projection": "EPSG:4326",
        "format": "GeoJSON",
        "timeout": 15000,
        "skipFailures": false,
        "options": []
    };

exports.toGeoJSON = function(streamIn, streamOut) {
    exports.execute({
        "streamIn": streamIn,
        "streamOut": streamOut,
        "format": "GeoJSON",
        "skipFailures": true
    });
};

exports.toCSV = function(streamIn, streamOut) {
    exports.execute({
        "streamIn": streamIn,
        "streamOut": streamOut,
        "format": "CSV",
        "skipFailures": true
    });
};

exports.toKML = function(streamIn, streamOut) {
    exports.execute({
        "streamIn": streamIn,
        "streamOut": streamOut,
        "format": "KML",
        "skipFailures": true
    });
};

exports.toShapefile = function(streamIn, streamOut) {
    exports.execute({
        "streamIn": streamIn,
        "streamOut": streamOut,
        "format": "ESRI Shapefile",
        "skipFailures": true
    });
};

exports.execute = function(params) {
    if(params.streamIn && params.streamOut) {
        try {
            ogr2ogr(params.streamIn)
                .project(params.projection || transformationConfig.projection)
                .format(params.format || transformationConfig.format)
                .timeout(params.timeout || transformationConfig.timeout)
                .skipfailures(params.skipFailures || transformationConfig.skipFailures)
                .options(params.options || transformationConfig.options)
                .stream()
                .pipe(params.streamOut);
        }
        catch(err) {
            console.log(err);
        }
    }
}

/**
 * Convert CSV filestream to geoJSON for processing
 * @param file Filestream
 * @param callback function(error, data) Should handle error or processed data (if error, no data)
 */
exports.fromCSV = function(file, callback){
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
    ogr2ogr(file, 'GeoJSON').exec(function(er, data){
        callback(er, data);
    });
};

