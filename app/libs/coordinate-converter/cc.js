(function(){
//---------------------------- CONSTANTS ----------------------------
	var DEG_2_RAD = Math.PI / 180,
        RAD_2_DEG = 180.0 / Math.PI,
        EQUATORIAL_RADIUS,
        ECC_SQUARED,
        F, //polar flattening.
        B, //polar axis.
        ECC_PRIME_SQUARED,
        IS_NAD83_DATUM = true,
        EASTING_OFFSET = 500000.0,
        NORTHING_OFFSET = 10000000.0,
        GRIDSQUARE_SET_COL_SIZE = 8,  // column width of grid square set
        GRIDSQUARE_SET_ROW_SIZE = 20, // row height of grid square set
        BLOCK_SIZE  = 100000, // size of square identifier (within grid zone designation),
        E1,
        k0 = 0.9996, // scale factor of central meridian
        ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // check for NAD83/WGS84
    if (IS_NAD83_DATUM) {
        EQUATORIAL_RADIUS = 6378137.0; // GRS80 ellipsoid (meters)
        F = 1 / 298.2572236; 
        B = EQUATORIAL_RADIUS * (1-F),
        ECC_SQUARED = 1 - (B/EQUATORIAL_RADIUS) * (B/EQUATORIAL_RADIUS);
        //ECC_SQUARED = 0.006694380023; 

    } else {
        // else NAD27 datum is assumed
        EQUATORIAL_RADIUS = 6378206.4; // Clarke 1866 ellipsoid (meters)
        ECC_SQUARED = 0.006768658;
    }

    // variable used in inverse formulas (UTMtoLL function)
    E1 = (1 - Math.sqrt(1 - ECC_SQUARED)) / (1 + Math.sqrt(1 - ECC_SQUARED));

    ECC_PRIME_SQUARED = ECC_SQUARED / (1 - ECC_SQUARED);
	
	// Create a safe reference to the cc object for use below.
	var cc = function(obj) {
    	if (obj instanceof cc) return obj;
    	if (!(this instanceof cc)) return new cc(obj);
  	};

//---------------------------- VERSION ----------------------------
  	cc.VERSION = '0.0.1';

//---------------------------- HELPERS ----------------------------    
    /*
     * Finds the set for a given zone.
     *
     * There are six unique sets, corresponding to individual grid numbers in
     * sets 1-6, 7-12, 13-18, etc. Set 1 is the same as sets 7, 13, ..; Set 2
     * is the same as sets 8, 14, ..
     *
     * See p. 10 of the "United States National Grid" white paper.
     */
    var findSet = function(zoneNum){
       var tReturn;

        zoneNum = parseInt(zoneNum, 10);
        zoneNum = zoneNum % 6;

        switch (zoneNum) {
        case 0:
            tReturn = 6;
            break;

        case 1:
            tReturn = 1;
            break;

        case 2:
            tReturn = 2;
            break;

        case 3:
            tReturn = 3;
            break;

        case 4:
            tReturn = 4;
            break;

        case 5:
            tReturn = 5;
            break;

        default:
            tReturn = -1;
            break;
        }

        return tReturn;
    };

    /*
     * Retrieve the Square Identification (two-character letter code), for the
     * given row, column and set identifier (set refers to the zone set:
     * zones 1-6 have a unique set of square identifiers; these identifiers are
     * repeated for zones 7-12, etc.)
     * See p. 10 of the "United States National Grid" white paper for a diagram
     * of the zone sets.
     */
    var lettersHelper = function(set, row, col){
      var l1, l2;

        // handle case of last row
        if (row === 0) {
            row = GRIDSQUARE_SET_ROW_SIZE - 1;
        } else {
            row -= 1;
        }

        // handle case of last column
        if (col === 0) {
            col = GRIDSQUARE_SET_COL_SIZE - 1;
        } else {
            col -= 1;
        }

        switch (set) {
        case 1:
            l1 = "ABCDEFGH";              // column ids
            l2 = "ABCDEFGHJKLMNPQRSTUV";  // row ids
            break;

        case 2:
            l1 = "JKLMNPQR";
            l2 = "FGHJKLMNPQRSTUVABCDE";
            break;

        case 3:
            l1 = "STUVWXYZ";
            l2 = "ABCDEFGHJKLMNPQRSTUV";
            break;

        case 4:
            l1 = "ABCDEFGH";
            l2 = "FGHJKLMNPQRSTUVABCDE";
            break;

        case 5:
            l1 = "JKLMNPQR";
            l2 = "ABCDEFGHJKLMNPQRSTUV";
            break;

        case 6:
            l1 = "STUVWXYZ";
            l2 = "FGHJKLMNPQRSTUVABCDE";
            break;

        default:
            throw "Invalid set passed to lettersHelper";
        }

        return l1.charAt(col) + l2.charAt(row);
    };
      
    /*
     * Retrieves the square identification for a given coordinate pair & zone.
     * See "lettersHelper" function documentation for more details.
     */
    var findGridLetters = function(zoneNum, northing, easting){
      var north_1m, east_1m, row, col;

        zoneNum  = parseInt(zoneNum, 10);
        northing = parseFloat(northing);
        easting  = parseFloat(easting);
        row = 1;

        // northing coordinate to single-meter precision
        north_1m = Math.round(northing);

        // Get the row position for the square identifier that contains the point
        while (north_1m >= BLOCK_SIZE) {
            north_1m = north_1m - BLOCK_SIZE;
            row += 1;
        }

        // cycle repeats (wraps) after 20 rows
        row = row % GRIDSQUARE_SET_ROW_SIZE;
        col = 0;

        // easting coordinate to single-meter precision
        east_1m = Math.round(easting);

        // Get the column position for the square identifier that contains the point
        while (east_1m >= BLOCK_SIZE){
            east_1m = east_1m - BLOCK_SIZE;
            col += 1;
        }

        // cycle repeats (wraps) after 8 columns
        col = col % GRIDSQUARE_SET_COL_SIZE;

        return lettersHelper(findSet(zoneNum), row, col);
    };

    /*
     * Retrieves the UTM letter designator based on a provided latitude.
     */
    var utmLetterDesignator = function(lat){
      var letterDesignator;

        lat = parseFloat(lat);

        if ((84 >= lat) && (lat >= 72)) {
            letterDesignator = 'X';
        } else if ((72 > lat) && (lat >= 64)) {
            letterDesignator = 'W';
        } else if ((64 > lat) && (lat >= 56)) {
            letterDesignator = 'V';
        } else if ((56 > lat) && (lat >= 48)) {
            letterDesignator = 'U';
        } else if ((48 > lat) && (lat >= 40)) {
            letterDesignator = 'T';
        } else if ((40 > lat) && (lat >= 32)) {
            letterDesignator = 'S';
        } else if ((32 > lat) && (lat >= 24)) {
            letterDesignator = 'R';
        } else if ((24 > lat) && (lat >= 16)) {
            letterDesignator = 'Q';
        } else if ((16 > lat) && (lat >= 8)) {
            letterDesignator = 'P';
        } else if (( 8 > lat) && (lat >= 0)) {
            letterDesignator = 'N';
        } else if (( 0 > lat) && (lat >= -8)) {
            letterDesignator = 'M';
        } else if ((-8> lat) && (lat >= -16)) {
            letterDesignator = 'L';
        } else if ((-16 > lat) && (lat >= -24)) {
            letterDesignator = 'K';
        } else if ((-24 > lat) && (lat >= -32)) {
            letterDesignator = 'J';
        } else if ((-32 > lat) && (lat >= -40)) {
            letterDesignator = 'H';
        } else if ((-40 > lat) && (lat >= -48)) {
            letterDesignator = 'G';
        } else if ((-48 > lat) && (lat >= -56)) {
            letterDesignator = 'F';
        } else if ((-56 > lat) && (lat >= -64)) {
            letterDesignator = 'E';
        } else if ((-64 > lat) && (lat >= -72)) {
            letterDesignator = 'D';
        } else if ((-72 > lat) && (lat >= -80)) {
            letterDesignator = 'C';
        } else {
            letterDesignator = 'Z'; // This is here as an error flag to show
                                  // that the latitude is outside the UTM limits
        }

        return letterDesignator;
    };

    var dmsToDecimal = function (coordinateString){
        var splitAtDecimal = coordinateString.split('.'),
            integerStringArray = splitAtDecimal[0].split(''),
            degrees,
            minutes,
            seconds,
            coordinate;

        //Split the coordinate as String/Array
        if(splitAtDecimal.length > 1){
           seconds = integerStringArray.splice(-2).concat(['.'], splitAtDecimal[1].split(''));
        }
        else{
            seconds = integerStringArray.splice(-2);
        }
        
        seconds = parseFloat(seconds.join(''));
        minutes = integerStringArray.splice(-2);
        minutes = parseFloat(minutes.join(''));
        degrees = parseFloat(integerStringArray.join(''));

        coordinate = degrees + (minutes/60) + (seconds/3600);
        return coordinate;
    };

     /*
     * Retrieves zone number from latitude and longitude.
     *
     * Zone numbers range from 1 - 60 over the range [-180 to +180]. Each
     * range is 6 degrees wide. Special cases for points outside normal
     * [-80 to +84] latitude zone.
     */
    var getZoneNumber = function(lat, lon){
        var zoneNumber;

        lat = parseFloat(lat);
        lon = parseFloat(lon);

        // sanity check on input, remove for production
        if (lon > 360 || lon < -180 || lat > 90 || lat < -90) {
            throw "Bad input. lat: " + lat + " lon: " + lon;
        }

        zoneNumber = parseInt((lon + 180) / 6, 10) + 1;

        // Handle special case of west coast of Norway
        if (lat >= 56.0 && lat < 64.0 && lon >= 3.0 && lon < 12.0) {
            zoneNumber = 32;
        }

        // Special zones for Svalbard
        if (lat >= 72.0 && lat < 84.0) {
            if (lon >= 0.0  && lon <  9.0) {
                zoneNumber = 31;
            } else if (lon >= 9.0  && lon < 21.0) {
                zoneNumber = 33;
            } else if (lon >= 21.0 && lon < 33.0) {
                zoneNumber = 35;
            } else if (lon >= 33.0 && lon < 42.0) {
                zoneNumber = 37;
            }
        }

        return zoneNumber;    
    };

    /*
     * Adds a trailing 0 if the provided number is less than 9.
     * This makes sure that the values in dms conversions always have a 0.
     *
     * @param n- Number to verify.
     * @return String value of the number provided.
     */
    var alwaysTwoDigit = function(n){
        return n===0 || n<=9 ? '0'+n: ''+n; 
    }

//---------------------------- FUNCTIONS ----------------------------
//
//---------------------------- DD to ----------------------------
  	/*
     * Converts DD to MGRS
     * DD: Decimal Degree (latitude, longitude). 
     * MGRS: Military Grid Reference System.
     *
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - gridLetters: String
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter gridLetters easting+northing
     * i.e: 33P AA 123456789
     * 
     * @param lat- Latitude in decimal (String or Numeric).
     * @param lon- Longitude in decimal (String or Numeric).
     * @param output- String representing return type (Object or String).
     * @param precision- Optional: coordinate precision, (String or Numeric). Default: 5.
     * @return Depends on output parameter (Object or a String).
     */
  	cc.ddToMgrs = function(lat, lon, output, precision){
        var coords,
        mgrs = null;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('ddToMgrs(): Missing arguments. Required: lat,lon,output.');
        }

        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }

        precision = precision ? precision : 5;


        lat = parseFloat(lat);
        lon = parseFloat(lon);

        // convert lat/lon to UTM coordinates
        // its easier to pass an object to the utm functions.
        coords = cc.ddToUtm(lat, lon, 'object');

        if(typeof output === 'string' && (output.toLowerCase() === 'object' || output.toLowerCase() === 'string')){
            mgrs = cc.utmToMgrs(coords.zoneNumber+coords.zoneLetter, coords.easting, coords.northing, output, precision);
        }else{
            throw new Error("ddToMgrs(): Incorrect output type specified. Required: string or object.");
        }

        return mgrs;
  	};

    /*
     * Converts DD to UTM.
     * DD: Decimal Degree (latitude, longitude). 
     * UTM: Universal Transverse Mercator Coordinate System.
     *
     * Converts lat/long to UTM coords.  Equations from USGS Bulletin 1532 
     * (or USGS Professional Paper 1395 "Map Projections - A Working Manual", 
     * by John P. Snyder, U.S. Government Printing Office, 1987.)
     * 
     * Note- UTM northings are negative in the southern hemisphere.
     * 
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - hemisphere: 'N' or 'S'
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter easting northing
     * i.e: 33P 123456 12345678
     *
     * @param lat- Latitude in decimal; north is positive, south is negative.
     * @param lon- Longitude in decimal; east is positive, west is negative.
     * @param output- String representing return type (Object or String).
     * @param zone- Optional (String or Numeric): Force coordinates to be computed in a particular zone.
     * @return Depends on output parameter (Object or a String).
     */
    cc.ddToUtm = function(lat, lon, output, zone){
        var zoneNumber,
            latRad,
            lonRad,
            lonOrigin,
            lonOriginRad,
            utmEasting,
            utmNorthing,
            N,
            T,
            C,
            A,
            M,
            utmcoords;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('ddToUtm(): Missing arguments. Required: lat,lon,output.');
        }

        lat = parseFloat(lat);
        lon = parseFloat(lon);

        // Constrain reporting USNG coords to the latitude range [80S .. 84N]
        if (lat > 84.0 || lat < -80.0) {
            return "undefined";
        }

        // sanity check on input - remove for production
        // Make sure the longitude is between -180.00 .. 179.99..
        if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
            throw "Bad input. lat: " + lat + " lon: " + lon;
        }

        // convert lat/lon to radians
        latRad = lat * DEG_2_RAD;
        lonRad = lon * DEG_2_RAD;

        // User-supplied zone number will force coordinates to be computed in a particular zone
        zoneNumber = zone || getZoneNumber(lat, lon);

        // +3 puts origin in middle of zone
        lonOrigin = (zoneNumber - 1) * 6 - 180 + 3;
        lonOriginRad = lonOrigin * DEG_2_RAD;

        N = EQUATORIAL_RADIUS / Math.sqrt(1 - ECC_SQUARED * Math.pow(Math.sin(latRad), 2));
        T = Math.pow(Math.tan(latRad), 2);
        C = ECC_PRIME_SQUARED * Math.pow(Math.cos(latRad), 2);
        A = Math.cos(latRad) * (lonRad - lonOriginRad);

        // Note that the term Mo drops out of the "M" equation, because phi 
        // (latitude crossing the central meridian, lambda0, at the origin of the
        //  x,y coordinates), is equal to zero for UTM.
        M = EQUATORIAL_RADIUS * (
            (1 - ECC_SQUARED / 4 - 3 * (ECC_SQUARED * ECC_SQUARED) / 64 - 5 * (ECC_SQUARED * ECC_SQUARED * ECC_SQUARED) / 256) * latRad -
            (3 * ECC_SQUARED / 8 + 3 * ECC_SQUARED * ECC_SQUARED / 32 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(2 * latRad) +
            (15 * ECC_SQUARED * ECC_SQUARED / 256 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(4 * latRad) -
            (35 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 3072) * Math.sin(6 * latRad));

        utmEasting = (k0 * N *
            (A + (1 - T + C) * (A * A * A) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ECC_PRIME_SQUARED ) * (A * A * A * A * A) / 120) + EASTING_OFFSET);

        // old equation that was off by a few meters.
        // utmNorthing = (k0 * ( M + N * Math.tan(latRad) * (
        //       (A * A) / 2 + (5 - T + 9 * C + 4 * C * C ) * (A * A * A * A) / 2 +
        //       (61 - 58 * T + T * T + 600 * C - 330 * ECC_PRIME_SQUARED ) *
        //       (A * A * A * A * A * A) / 720)
        //   ) );

        utmNorthing = k0*(M + N*Math.tan(latRad)*(A*A*(1/2 + A*A*((5 - T + 9*C + 4*C*C)/24 +
         A*A*(61 - 58*T + T*T + 600*C - 330*ECC_PRIME_SQUARED)/720))));//Northing from equator

        if (utmNorthing < 0) {
            utmNorthing += 10000000;
        }

        utmEasting = Math.round(utmEasting);
        utmNorthing = Math.round(utmNorthing);

        if(typeof output === 'string' && output.toLowerCase() === 'object'){
            utmcoords = {};
            utmcoords.easting = utmEasting;
            utmcoords.northing = utmNorthing;
            utmcoords.zoneNumber = zoneNumber;
            utmcoords.zoneLetter = utmLetterDesignator(lat);
            utmcoords.hemisphere = lat < 0 ? 'S' : 'N';
        } else if(typeof output === 'string' && output.toLowerCase() === 'string'){
            utmcoords = zoneNumber + utmLetterDesignator(lat) + ' ' + utmEasting + ' ' + utmNorthing;
        } else{
             throw new Error("ddToUtm(): Incorrect output type specified. Required: string or object.");
        }

        return utmcoords;
    };


    /*
     * Converts DD to DMS.
     * DD: Decimal Degree (latitude, longitude). 
     * DMS: Degrees, Minutes, Seconds.
     * 
     * This function can either return a formatted string or an object.
     * 
     * If string is specified, it will look like this: 412501N, 123456E
     * 
     * If object is chosen, it will have two properties, lat and lon.
     * Each will have these properties:
     * - degrees: positive integer
     * - minutes: positive integer
     * - seconds: positive float
     * - direction: N, S, E, or W
     * 
     * @param lat- latitude (float or string representing a float)
     * @param lon- longitude (float or string representing a float)
     * @param output- String representing return type (Object or String).
     * @param digits- Optional: Max digits in seconds, (String or Numeric). Default: 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.ddToDms = function(lat, lon, output, digits){
        var latDeg,
            latMin,
            latSec,
            lonDeg,
            lonMin,
            lonSec,
            latDir,
            lonDir,
            dms,
            magic;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('ddToDms(): Missing arguments. Required: lat,lon,output.');
        }

        if (typeof digits === 'string') {
            digits = parseInt(digits, 10);
        } else if (typeof digits !== 'number') {
            digits = 2;
        }

        // magic number that helps us round off un-needed digits
        magic = Math.pow(10, digits);

        lat = (typeof lat === 'string') ? parseFloat(lat) : lat;
        lon = (typeof lon === 'string') ? parseFloat(lon) : lon;

        if (lat < -90 || lat > 90) {
            throw "Latitude out of range: " + lat;
        }

        if (lon < -180 || lon > 180) {
            throw "Longitude out of range: " + lon;
        }

        latDir = (lat >= 0) ? 'N' : 'S';
        lonDir = (lon >= 0) ? 'E' : 'W';

        // Change to absolute value
        lat = Math.abs(lat);
        lon = Math.abs(lon);

        // Convert to Degree Minutes Seconds Representation
        latDeg = Math.floor(lat);
        lat -= latDeg;
        latMin = Math.floor(lat * 60);
        lat -= latMin / 60;
        latSec = Math.round((lat * 3600) * magic) / magic;

        lonDeg = Math.floor(lon);
        lon -= lonDeg;
        lonMin = Math.floor(lon * 60);
        lon -= lonMin / 60;
        lonSec = Math.round((lon * 3600) * magic) / magic;

        if(typeof output === 'string' && output.toLowerCase() === 'object'){
           dms = {
                "lat": {
                    "degrees": latDeg,
                    "minutes": latMin,
                    "seconds": latSec,
                    "direction": latDir
                },
                "lon": {
                    "degrees": lonDeg,
                    "minutes": lonMin,
                    "seconds": lonSec,
                    "direction": lonDir
                }
            };
        } else if(typeof output === 'string' && output.toLowerCase() === 'string'){
            // dms = {
            //     latitude: latDeg + '°' + latMin + '\'' + latSec + '"' + latDir,
            //     longitude: lonDeg + '°' + lonMin + '\'' + lonSec + '"' + lonDir
            // };
            dms = alwaysTwoDigit(latDeg)+alwaysTwoDigit(latMin)+alwaysTwoDigit(latSec)+latDir + ', '
                + alwaysTwoDigit(lonDeg)+alwaysTwoDigit(lonMin)+alwaysTwoDigit(lonSec)+lonDir;
        } else{
             throw new Error("ddToDms(): Incorrect output type specified. Required: string or object.");
        }

        return dms;
    };
  	

//---------------------------- UTM to ----------------------------
    /*
     * Converts UTM to MGRS.
     * UTM: Universal Transverse Mercator Coordinate System.
     * MGRS: Military Grid Reference System.
     *
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - gridLetters: String
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter gridLetters easting+northing
     * i.e: 33P AA 123456789
     *
     * @param UTMZone- 6-deg longitudinal zone and letter (String), eg. 18L
     * @param UTMEasting- easting-m  (String or Numeric), eg. 4000000.0
     * @param UTMNorthing- northing-m (String or Numeric), eg. 432001.8  
     * @param output- String representing return type (Object or String).
     * @param precision - Optional decimal precision, (String or Numeric). Default value: 5.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToMgrs = function(UTMZone, UTMEasting, UTMNorthing, output, precision){
      var utmEasting,
            utmNorthing,
            letters,
            usngNorthing,
            usngEasting,
            zoneLetter,
            zoneNumber,
            mgrs = null,
            i;

        if( typeof UTMNorthing === 'undefined' || 
            typeof UTMEasting === 'undefined'|| 
            typeof UTMZone === 'undefined' || 
            typeof output === 'undefined'){
            throw new Error('utmToDd(): Missing arguments. Required: UTMZone, UTMEasting, UTMNorthing, output.');
        }

        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }

        precision = precision ? precision : 5;

        zoneLetter  = UTMZone.charAt(UTMZone.length - 1);
        zoneNumber = UTMZone.split(zoneLetter);
        zoneNumber = parseInt(zoneNumber[0], 10);

        utmNorthing = UTMNorthing;
        utmEasting = UTMEasting;

        //any letter coming before "N" in the alphabet is in the southern hemisphere.
        if(ALPHABET.indexOf(zoneLetter) < 13){
            //South
           utmNorthing += NORTHING_OFFSET; 
        }
        
        letters  = findGridLetters(zoneNumber, utmNorthing, utmEasting);
        usngNorthing = Math.round(utmNorthing) % BLOCK_SIZE;
        usngEasting  = Math.round(utmEasting)  % BLOCK_SIZE;

        // added... truncate digits to achieve specified precision
        usngNorthing = Math.floor(usngNorthing / Math.pow(10,(5-precision)));
        usngEasting = Math.floor(usngEasting / Math.pow(10,(5-precision)));

        // REVISIT: Modify to incorporate dynamic precision ?
        for (i = String(usngEasting).length; i < precision; i += 1) {
             usngEasting = "0" + usngEasting;
        }

        for (i = String(usngNorthing).length; i < precision; i += 1) {
            usngNorthing = "0" + usngNorthing;
        }
       
        // usng = coords.zoneNumber + coords.zoneLetter + " " + letters + " " + 
        //       usngEasting + " " + usngNorthing;
        
        //mgrs is basically USNG without any space delimiters.
        if (typeof output === 'string' && output.toLowerCase() === 'object'){
            mgrs = {};
            mgrs.zoneNumber = zoneNumber;
            mgrs.zoneLetter = zoneLetter;
            mgrs.gridLetters = letters;
            mgrs.easting = usngEasting;
            mgrs.northing = usngNorthing
        } else if(typeof output === 'string' && output.toLowerCase() === 'string'){
            mgrs = zoneNumber + zoneLetter + ' ' + letters + ' ' + usngEasting + usngNorthing;
        } else{
             throw new Error("utmToMgrs(): Incorrect output type specified. Required: string or object.");
        }
        
        return mgrs;
    };


    /*
     * Converts UTM to DD.
     * UTM: Universal Transverse Mercator Coordinate System.
     * DD: Decimal Degree (latitude, longitude). 
     *
     * Equations from USGS Bulletin 1532 (or USGS Professional Paper 1395)
     * East Longitudes are positive, West longitudes are negative. 
     * North latitudes are positive, South latitudes are negative.
     *
     * If string is specified, it will look like this: 41, 12.
     *
     * If object is chosen, it will have two properties, lat and lon.
     *
     * @param UTMZone- 6-deg longitudinal zone and letter (String), eg. 18L
     * @param UTMEasting- easting-m (String or Numeric), eg. 4000000.0
     * @param UTMNorthing- northing-m (String or Numeric), eg. 432001.8  
     * @param output- String representing return type (Object or String).
     * @param precision - Optional decimal precision, (String or Numeric). Default 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToDd = function(UTMZone, UTMEasting, UTMNorthing, output, precision){
        var xUTM,
            yUTM,
            zoneNumber,
            zoneLetter,
            lonOrigin,
            M, // M is the "true distance along the central meridian from the Equator to phi (latitude)
            mu,
            phi1Rad,
            phi1,
            N1,
            T1,
            C1,
            R1,
            D,
            lat,
            lon,
            roundingNumber,
            dd = null;
            
        if( typeof UTMNorthing === 'undefined' || 
            typeof UTMEasting === 'undefined'|| 
            typeof UTMZone === 'undefined' || 
            typeof output === 'undefined'){
            throw new Error('utmToDd(): Missing arguments. Required: UTMZone, UTMEasting, UTMNorthing, output.');
        }

        zoneLetter  = UTMZone.charAt(UTMZone.length - 1);
        zoneNumber = UTMZone.split(zoneLetter);
        zoneNumber = parseInt(zoneNumber[0], 10);

        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }

        //if no precision is provided, set precision to 2.
        precision = precision ? precision: 2;

        // remove 500,000 meter offset for longitude
        xUTM = parseFloat(UTMEasting) - EASTING_OFFSET; 
        yUTM = parseFloat(UTMNorthing);

        // origin longitude for the zone (+3 puts origin in zone center) 
        lonOrigin = (zoneNumber - 1) * 6 - 180 + 3; 

        //the value of M changes if the zone is south of the equator. 
        //any letter coming before "N" in the alphabet is in the southern hemisphere, 
        //and any letter "N" or after is in the northern hemisphere.
        if(ALPHABET.indexOf(zoneLetter) < 13){
            //South
            M = (yUTM-NORTHING_OFFSET);
        }
        else{
            //North
            M = yUTM / k0;
        }
        
        mu = M / ( EQUATORIAL_RADIUS * (1 - ECC_SQUARED / 4 - 3 * ECC_SQUARED * 
                        ECC_SQUARED / 64 - 5 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 256 ));

        // phi1 is the "footprint latitude" or the latitude at the central meridian which
        // has the same y coordinate as that of the point (phi (lat), lambda (lon) ).
        phi1Rad = mu + (3 * E1 / 2 - 27 * E1 * E1 * E1 / 32 ) * Math.sin( 2 * mu) + ( 21 * E1 * E1 / 16 - 55 * E1 * E1 * E1 * E1 / 32) * Math.sin( 4 * mu) + (151 * E1 * E1 * E1 / 96) * Math.sin(6 * mu);
        phi1 = phi1Rad * RAD_2_DEG;

        // Terms used in the conversion equations
        N1 = EQUATORIAL_RADIUS / Math.sqrt( 1 - ECC_SQUARED * Math.sin(phi1Rad) * 
                    Math.sin(phi1Rad));
        T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
        C1 = ECC_PRIME_SQUARED * Math.cos(phi1Rad) * Math.cos(phi1Rad);
        R1 = EQUATORIAL_RADIUS * (1 - ECC_SQUARED) / Math.pow(1 - ECC_SQUARED * 
                      Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
        D = xUTM / (N1 * k0);

        // Calculate latitude, in decimal degrees
        lat = phi1Rad - ( N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 *
                C1 - 4 * C1 * C1 - 9 * ECC_PRIME_SQUARED) * D * D * D * D / 24 + (61 + 90 * 
                T1 + 298 * C1 + 45 * T1 * T1 - 252 * ECC_PRIME_SQUARED - 3 * C1 * C1) * D * D *
                D * D * D * D / 720);
        lat = lat * RAD_2_DEG;

        // Calculate longitude, in decimal degrees
        lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * 
                  C1 * C1 + 8 * ECC_PRIME_SQUARED + 24 * T1 * T1) * D * D * D * D * D / 120) /
                  Math.cos(phi1Rad);

        lon = lonOrigin + lon * RAD_2_DEG;

        // number that helps us round off un-needed digits
        roundingNumber = Math.pow(10, precision);

        //cut of decimal places based on precision.
        lat = Math.round(lat*roundingNumber)/roundingNumber;
        lon = Math.round(lon*roundingNumber)/roundingNumber;

        if (typeof output === 'string' && output.toLowerCase() === 'object'){
            dd = {};
            dd.lat = lat;
            dd.lon = lon;
        }else if (typeof output === 'string' && output.toLowerCase() === 'string'){
            dd = lat + ', ' + lon;
        }else {
             throw new Error("utmToDd(): Incorrect output type specified. Required: string or object.");
        }

        return dd;
    };

    /*
     * Converts UTM to DMS.
     * UTM: Universal Transverse Mercator Coordinate System.
     * DMS: Degrees, Minutes, Seconds.
     * 
     * This function can either return a formatted string or an object.
     * 
     * If string or nothing is specified, it will look like this: 412501N, 123456E
     * 
     * If object is chosen, it will have two properties, lat and lon.
     * Each will have these properties:
     * - degrees: positive integer
     * - minutes: positive integer
     * - seconds: positive float
     * - direction: N, S, E, or W
     *
     * @param UTMZone- 6-deg longitudinal zone and letter (String), eg. 18L
     * @param UTMEasting- easting-m  (String or Numeric), eg. 4000000.0
     * @param UTMNorthing- northing-m (String or Numeric), eg. 432001.8 
     * @param output- String representing return type (Object or String).
     * @param digits - Optional: Max digits in seconds, (String or Numeric). Default: 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToDms = function(UTMZone, UTMEasting, UTMNorthing, output, digits){

        if( typeof UTMNorthing === 'undefined' || 
            typeof UTMEasting === 'undefined'|| 
            typeof UTMZone === 'undefined' || 
            typeof output === 'undefined'){
            throw new Error('utmToDms(): Missing arguments. Required: UTMZone, UTMEasting, UTMNorthing, output.');
        }

        if (typeof output !== 'string' || (output.toLowerCase() !== 'string' && output.toLowerCase() !== 'object')){
            throw new Error("utmToDms(): Incorrect output type specified. Required: string or object.");
        }

        if (typeof digits === 'string') {
            digits = parseInt(digits, 10);
        }

        //if no digit is provided, set digits to 2.
        digits = digits ? digits: 2;

        var dd = cc.utmToDd(UTMZone, UTMEasting, UTMNorthing, 'object', 2);

        return cc.ddToDms(dd.lat, dd.lon, output, digits);
    };


//---------------------------- DMS to ----------------------------

    /*
     * Converts DMS to DD.
     * DMS: Degrees, Minutes, Seconds.
     * DD: Decimal Degree (latitude, longitude). 
     * 
     * This function can either return a formatted string or an object.
     * 
     * If string is specified, it will look like this: 41, 12.
     * 
     * If object is chosen, it will have two properties, lat and lon.
     * 
     * @param lat- latitude (String representing a float)
     * @param lon- longitude (String representing a float)
     * @param output- String representing return type (Object or String).
     * @param precision - Optional decimal precision, (String or Numeric). Default 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.dmsToDd = function(lat, lon, output, precision){
        var north = lat.match(/^\d{6,7}(\.\d+)?[Nn]/),
            south = lat.match(/^\d{6,7}(\.\d+)?[Ss]/),
            west = lon.match(/^\d{6,7}(\.\d+)?[Ww]$/),
            east = lon.match(/^\d{6,7}(\.\d+)?[Ee]$/),
            lat,
            lon,
            dd = null;

        //Input checks
        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('dmsToDd(): Missing arguments. Required: lat,lon,output.');
        }
        if(typeof north === 'undefined' && typeof south === 'undefined'){
             throw new Error('dmsToDd(): Missing N or S direction in lat param.');
        }
        if(typeof west === 'undefined' && typeof east === 'undefined'){
             throw new Error('dmsToDd(): Missing W or E direction in lon param.');
        }
        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }

        //if no precision is provided, set precision to 2.
        precision = precision ? precision: 2;


        if(north){
            lat = dmsToDecimal(north[0].substring(0, north[0].length - 1));
        }else{ //south
            lat = dmsToDecimal(south[0].substring(0, south[0].length - 1)) * (-1); //South is negative
        }

        if(east){
            lon = dmsToDecimal(east[0].substring(0, east[0].length - 1));
        }else{ //West
            lon = dmsToDecimal(west[0].substring(0, west[0].length - 1)) * (-1); //West is negative
        }

        if (typeof output === 'string' && output.toLowerCase() === 'object'){
            dd = {};
            dd.lat = lat;
            dd.lon = lon;
        }else if (typeof output === 'string' && output.toLowerCase() === 'string'){
            dd = lat + ', ' + lon;
        }else {
             throw new Error("dmsToDd(): Incorrect output type specified. Required: string or object.");
        }

        return dd;
    };

    /*
     * Converts DMS to MGRS.
     * DMS: Degrees, Minutes, Seconds.
     * MGRS: Military Grid Reference System.
     *
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - gridLetters: String
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter gridLetters easting+northing
     * i.e: 33P AA 123456789
     * 
     * @param lat- latitude (String representing a float)
     * @param lon- longitude (String representing a float)
     * @param output- String representing return type (Object or String).
     * @param precision - Optional decimal precision, (String or Numeric). Default 5.
     * @return Depends on output parameter (Object or a String).
     */
    cc.dmsToMgrs = function(lat, lon, output, precision){
        var north = lat.match(/^\d{6,7}(\.\d+)?N/),
            south = lat.match(/^\d{6,7}(\.\d+)?S/),
            west = lon.match(/^\d{6,7}(\.\d+)?W$/),
            east = lon.match(/^\d{6,7}(\.\d+)?E$/),
            dd;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('dmsToMgrs(): Missing arguments. Required: lat,lon,output.');
        }
        if(typeof north === 'undefined' && typeof south === 'undefined'){
             throw new Error('dmsToMgrs(): Missing N or S direction in lat param.');
        }
        if(typeof west === 'undefined' && typeof east === 'undefined'){
             throw new Error('dmsToMgrs(): Missing W or E direction in lon param.');
        }
        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }
        if (typeof output !== 'string' || (output.toLowerCase() !== 'string' && output.toLowerCase() !== 'object')){
            throw new Error("dmsToMgrs(): Incorrect output type specified. Required: string or object.");
        }

        precision = precision ? precision: 5;

        dd = cc.dmsToDd(lat, lon, 'object', 2);

        return cc.ddToMgrs(dd.lat, dd.lon, output, precision);
    };

    /*
     * Converts DMS to UTM.
     * DMS: Degrees, Minutes, Seconds.
     * UTM: Universal Transverse Mercator Coordinate System.
     *
     * Converts lat/long to UTM coords.  
     * Note- UTM northings are negative in the southern hemisphere.
     * 
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - hemisphere: 'N' or 'S'
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter easting northing
     * i.e: 33P 123456 12345678
     * 
     * @param lat- latitude (String representing a float)
     * @param lon- longitude (String representing a float)
     * @param output- String representing return type (Object or String).
     * @param zone- Optional (String or Numeric): Force coordinates to be computed in a particular zone.
     * @return Depends on output parameter (Object or a String).
     */
    cc.dmsToUtm = function(lat, lon, output, zone){
        var north = lat.match(/^\d{6,7}(\.\d+)?N/),
            south = lat.match(/^\d{6,7}(\.\d+)?S/),
            west = lon.match(/^\d{6,7}(\.\d+)?W$/),
            east = lon.match(/^\d{6,7}(\.\d+)?E$/),
            dd;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('dmsToUtm(): Missing arguments. Required: lat,lon,output.');
        }
        if(typeof north === 'undefined' && typeof south === 'undefined'){
             throw new Error('dmsToUtm(): Missing N or S direction in lat param.');
        }
        if(typeof west === 'undefined' && typeof east === 'undefined'){
             throw new Error('dmsToUtm(): Missing W or E direction in lon param.');
        }
        if (typeof output !== 'string' || (output.toLowerCase() !== 'string' && output.toLowerCase() !== 'object')){
            throw new Error("dmsToUtm(): Incorrect output type specified. Required: string or object.");
        }

        dd = cc.dmsToDd(lat, lon, 'object', 2);

        return cc.ddToUtm(dd.lat, dd.lon, output, zone);
    };

//---------------------------- MGRS to ----------------------------

    /*
     * Converts MGRS to UTM.
     * MGRS: Military Grid Reference System.
     * UTM: Universal Transverse Mercator Coordinate System.
     *
     * Converts lat/long to UTM coords.  
     * Note- UTM northings are negative in the southern hemisphere.
     * 
     * If Object is chosen it will contain 5 properties:
     * - easting: Float
     * - northing: Float
     * - zoneNumber: Integer
     * - zoneLetter: String
     * - hemisphere: 'N' or 'S'
     *
     * If String is selected it will look like this: 
     * zoneNumber+zoneLetter easting northing
     * i.e: 33P 123456 12345678
     * 
     * @param MGRSZone- Grid zone designator (String), eg. 18L
     * @param MGRSgridLetters- Square Identifier (String or Numeric), eg. 4000000.0
     * @param MGRSlocation- Northing-m (String or Numeric), eg. 432001.8  
     * @param output- String representing return type (Object or String).
     * @return Depends on output parameter (Object or a String).
     */
    cc.mgrsToUtm = function(MGRSZone, MGRSgridLetters, MGRSnumbers, output){
        var zoneBase,
            segBase,
            eSqrs,
            appxEast,
            appxNorth,
            letNorth,
            nSqrs,
            zoneStart,
            USNGSqEast = "ABCDEFGHJKLMNPQRSTUVWXYZ",
            zoneNumber,
            zoneLetter,
            gridLetter1,
            gridLetter2,
            utm,
            mgrsPrecision,
            east,
            north,
            easting,
            northing;

        if(typeof MGRSZone === 'undefined' ||
           typeof MGRSgridLetters === 'undefined' ||
           typeof MGRSnumbers === 'undefined' ||
           typeof output === 'undefined'){
            throw new Error('mgrsToUtm(): Missing arguments. Required: '
                +'MGRSZone, MGRSgridLetters, MGRSnumbers and output.');
        }

        if(typeof MGRSnumbers !== 'string'){
            MGRSnumbers = MGRSnumbers.toString();
        }
        //MGRS location numbers are never odd.
        if(MGRSnumbers.length % 2 !== 0){
            throw new Error("mgrsToUtm(): The number of digits in the numerical location must be even");
        }
        if(MGRSgridLetters.length < 2){
            throw new Error("mgrsToUtm(): Incorrect Grid Square Id. Must be two letters.");
        }

        zoneLetter = MGRSZone.charAt(MGRSZone.length - 1);
        zoneNumber = MGRSZone.split(zoneLetter);
        zoneNumber = parseInt(zoneNumber[0], 10);
        gridLetter1 = MGRSgridLetters.charAt(0);
        gridLetter2 = MGRSgridLetters.charAt(1);

        mgrsPrecision = MGRSnumbers.length / 2;

        east = parseInt(MGRSnumbers.substring(0, mgrsPrecision), 10);
        north = parseInt(MGRSnumbers.substring(mgrsPrecision), 10);

        //Starts (southern edge) of N-S zones in millons of meters
        zoneBase = [
            1.1, 2.0, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1,
            0, 0.8, 1.7, 2.6, 3.5, 4.4, 5.3, 6.2, 7.0, 7.9
        ];

        //Starts of 2 million meter segments, indexed by zone 
        segBase = [
            0, 2, 2, 2, 4, 4, 6, 6, 8, 8,
            0, 0, 0, 2, 2, 4, 4, 6, 6, 6
        ];

        // convert easting to UTM
        eSqrs = USNGSqEast.indexOf(gridLetter1);          
        appxEast = 1 + eSqrs % 8; 

        // convert northing to UTM
        letNorth = "CDEFGHJKLMNPQRSTUVWX".indexOf(zoneLetter);
        if (zoneNumber % 2) {
            //odd number zone
            nSqrs = "ABCDEFGHJKLMNPQRSTUV".indexOf(gridLetter2);
        } else {
            // even number zone
            nSqrs = "FGHJKLMNPQRSTUVABCDE".indexOf(gridLetter2);
        }

        zoneStart = zoneBase[letNorth];
        appxNorth = segBase[letNorth] + nSqrs / 10;
        if (appxNorth < zoneStart) {
            appxNorth += 2;
        }

        easting = appxEast * 100000 + east * Math.pow(10, 5 - east.toString().length);
        northing = appxNorth * 1000000 + north * Math.pow(10, 5 - north.toString().length);

        if (typeof output === 'string' && output.toLowerCase() === 'object'){
            utm = {};
            utm.northing = northing
            utm.easting = easting
            utm.zoneNumber = zoneNumber;
            utm.zoneLetter = zoneLetter;
        }else if (typeof output === 'string' && output.toLowerCase() === 'string'){
            utm = zoneNumber + zoneLetter + ' ' + easting + ' ' + northing;
        }else {
             throw new Error("mgrsToUtm(): Incorrect output type specified. Required: string or object.");
        }

        return utm;
    };


    /*
     * Converts MGRS to DD.
     * MGRS: Military Grid Reference System.
     * DD: Decimal Degree (latitude, longitude). 
     *
     * If string is specified, it will look like this: 41, 12.
     *
     * If object is chosen, it will have two properties, lat and lon.
     *
     * @param MGRSZone- Grid zone designator (String), eg. 18L
     * @param MGRSgridLetters- Square Identifier (String or Numeric), eg. 4000000.0
     * @param MGRSlocation- Northing-m (String or Numeric), eg. 432001.8  
     * @param output- String representing return type (Object or String).
     * @param precision - Optional decimal precision, (String or Numeric). Default 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.mgrsToDd = function(MGRSZone, MGRSgridLetters, MGRSnumbers, output, precision){
        var dd,
        utm;

        if(typeof MGRSZone === 'undefined' ||
           typeof MGRSgridLetters === 'undefined' ||
           typeof MGRSnumbers === 'undefined' ||
           typeof output === 'undefined'){
            throw new Error('mgrsToDd(): Missing arguments. Required: '
                +'MGRSZone, MGRSgridLetters, MGRSnumbers and output.');
        }
        if (typeof output !== 'string' || (output.toLowerCase() !== 'string' && output.toLowerCase() !== 'object')){
            throw new Error("mgrsToDd(): Incorrect output type specified. Required: string or object.");
        }

        if(typeof MGRSnumbers !== 'string'){
            MGRSnumbers = MGRSnumbers.toString();
        }

        utm = cc.mgrsToUtm(MGRSZone, MGRSgridLetters, MGRSnumbers, 'object');

        return cc.utmToDd(utm.zoneNumber+utm.zoneLetter, utm.easting, utm.northing, output, precision);
    };

    /*
     * Converts MGRS to DMS.
     * MGRS: Military Grid Reference System.
     * DMS: Degrees, Minutes, Seconds.
     * 
     * This function can either return a formatted string or an object.
     * 
     * If string or nothing is specified, it will look like this: 412501N, 123456E
     * 
     * If object is chosen, it will have two properties, lat and lon.
     * Each will have these properties:
     * - degrees: positive integer
     * - minutes: positive integer
     * - seconds: positive float
     * - direction: N, S, E, or W
     *
     * @param MGRSZone- Grid zone designator (String), eg. 18L
     * @param MGRSgridLetters- Square Identifier (String or Numeric), eg. 4000000.0
     * @param MGRSlocation- Northing-m (String or Numeric), eg. 432001.8  
     * @param digits - Optional: Max digits in seconds, (String or Numeric). Default: 2.
     * @return Depends on output parameter (Object or a String).
     */
    cc.mgrsToDms = function(MGRSZone, MGRSgridLetters, MGRSnumbers, output, digits){
        var dms,
            utm;

        if(typeof MGRSZone === 'undefined' ||
           typeof MGRSgridLetters === 'undefined' ||
           typeof MGRSnumbers === 'undefined' ||
           typeof output === 'undefined'){
            throw new Error('mgrsToDms(): Missing arguments. Required: '
                +'MGRSZone, MGRSgridLetters, MGRSnumbers and output.');
        }
        if (typeof output !== 'string' || (output.toLowerCase() !== 'string' && output.toLowerCase() !== 'object')){
            throw new Error("mgrsToDms(): Incorrect output type specified. Required: string or object.");
        }

        if(typeof MGRSnumbers !== 'string'){
            MGRSnumbers = MGRSnumbers.toString();
        }

        utm = cc.mgrsToUtm(MGRSZone, MGRSgridLetters, MGRSnumbers, 'object');

        return cc.utmToDms(utm.zoneNumber+utm.zoneLetter, utm.easting, utm.northing, output, digits);
    }

  	// AMD registration happens at the end for compatibility with AMD loaders
  	// that may not enforce next-turn semantics on modules. Even though general
  	// practice for AMD registration is to be anonymous, cc registers
  	// as a named module because, like jQuery, it is a base library that can 
  	// be bundled in a third party lib, but not be part of
  	// an AMD load request. Those cases could generate an error when an
  	// anonymous define() is called outside of a loader request.
  	if (typeof define === 'function' && define.amd) {
    	define('coordinateConverter', [], function() {
      		return cc;
    	});
  	}

}).call(this);
