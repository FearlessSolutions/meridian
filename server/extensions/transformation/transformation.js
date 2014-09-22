var fs = require('fs'),
    ogr2ogr = require('ogr2ogr'),
    transformationConfig = { // Defaults from the OGR2OGR module
        "projection": "EPSG:4326",
        "format": "GeoJSON",
        "timeout": 15000,
        "skipFailures": false,
        "options": []
    };

exports.toGeoJSON = function(pathToInputFile, pathToOutputFile) {
    exports.execute({
        "pathToInputFile": pathToInputFile,
        "pathToOutputFile": pathToOutputFile,
        "format": "GeoJSON",
        "skipFailures": true
    });
}

exports.toCSV = function(pathToInputFile, pathToOutputFile) {
    exports.execute({
        "pathToInputFile": pathToInputFile,
        "pathToOutputFile": pathToOutputFile,
        "format": "CSV",
        "skipFailures": true
    });
}

exports.toKML = function(pathToInputFile, pathToOutputFile) {
    exports.execute({
        "pathToInputFile": pathToInputFile,
        "pathToOutputFile": pathToOutputFile,
        "format": "KML",
        "skipFailures": true
    });
}

exports.toShapefile = function(pathToInputFile, pathToOutputFile) {
    exports.execute({
        "pathToInputFile": pathToInputFile,
        "pathToOutputFile": pathToOutputFile,
        "format": "ESRI Shapefile",
        "skipFailures": true
    });
}

exports.execute = function(params) {
    if(params.pathToInputFile && params.pathToOutputFile) {
        try {
            ogr2ogr(params.pathToInputFile)
                .project(params.projection || transformationConfig.projection)
                .format(params.format || transformationConfig.format)
                .timeout(params.timeout || transformationConfig.timeout)
                .skipfailures(params.skipFailures || transformationConfig.skipFailures)
                .options(params.options || transformationConfig.options)
                .stream()
                .pipe(fs.createWriteStream(params.pathToOutputFile));
        }
        catch(err) {
            console.log(err);
        }
    }
}