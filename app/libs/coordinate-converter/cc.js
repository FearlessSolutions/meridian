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
        k0 = 0.9996; // scale factor of central meridian

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

    /*
     * Verifies a coordinate object by following these steps:
     * - converts string members (degrees, minutes, seconds) to numbers
     * - if direction is present, makes degree positive or negative accordingly
     *
     * @param coord- object with at least degrees, minutes, and seconds
     * @return New, cleaned object (doesn't have direction)
     */
    var dmsVerify = function(coord){
       var newCoord = {};

        if (typeof coord !== 'object' || !coord.degrees || !coord.minutes || !coord.seconds) {
            return false;
        }

        if (typeof coord.degrees === 'string') {
            newCoord.degrees = parseInt(coord.degrees, 10);
        } else {
            newCoord.degrees = coord.degrees;
        }

        if (coord.direction) {
            if (coord.direction === 'S' || coord.direction === 'W') {
                newCoord.degrees *= -Math.abs(newCoord.degrees);
            } else {
                newCoord.degrees *= Math.abs(newCoord.degrees);
            }
        }

        if (typeof coord.minutes === 'string') {
            newCoord.minutes = Math.abs(parseInt(coord.minutes, 10));
        } else {
            newCoord.minutes = Math.abs(coord.minutes);
        }

        if (typeof coord.seconds === 'string') {
            newCoord.seconds = Math.abs(parseInt(coord.seconds, 10));
        } else {
            newCoord.seconds = Math.abs(coord.seconds);
        }
    };

    var dmsToDecimal = function (coordinateString){
        var splitAtDecimal = coordinateString.split('.'),
            integerStringArray = splitAtDecimal[0].split(''),
            degrees,
            minutes,
            seconds,
            coordinate;

        //Split the coordinate as String/Array
        seconds = integerStringArray.splice(-2).concat(['.'], splitAtDecimal[1].split(''));
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

    //@return String
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
     * @param lat- Latitude in decimal.
     * @param lon- Longitude in decimal.
     * @param output- String representing return type (object or string).
     * @param precision- Optional: coordinate precision.
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

        if(typeof output === 'string' && (output === 'object' || output === 'string')){
            mgrs = cc.utmToMgrs(coords, output, precision);
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
     * If Object is chosen it will contain 4 properties:
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
     * @param output- String representing return type (object or string).
     * @param zone- Optional: Force coordinates to be computed in a particular zone.
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

        if(typeof output === 'string' && output === 'object'){
            utmcoords = {};
            utmcoords.easting = utmEasting;
            utmcoords.northing = utmNorthing;
            utmcoords.zoneNumber = zoneNumber;
            utmcoords.zoneLetter = utmLetterDesignator(lat);
            utmcoords.hemisphere = lat < 0 ? 'S' : 'N';
        } else if(typeof output === 'string' && output === 'string'){
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
     * If object is chosen, it will have two properties, latitude and longitude.
     * Each will have these properties:
     * - degrees: positive integer
     * - minutes: positive integer
     * - seconds: positive float
     * - direction: N, S, E, or W
     * 
     * @param lat- latitude (float or string representing a float)
     * @param lon- longitude (float or string representing a float)
     * @param output- String representing return type (object or string).
     * @param digits- Optional: Max digits in seconds. Default: 2.
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

        if(typeof output === 'string' && output === 'object'){
           dms = {
                "latitude": {
                    "degrees": latDeg,
                    "minutes": latMin,
                    "seconds": latSec,
                    "direction": latDir
                },
                "longitude": {
                    "degrees": lonDeg,
                    "minutes": lonMin,
                    "seconds": lonSec,
                    "direction": lonDir
                }
            };
        } else if(typeof output === 'string' && output === 'string'){
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
     * @param coords - Object containing zoneNumber, zoneLetter, easting, northing and hemisphere.
     * @param output- String representing return type (object or string).
     * @param precision- Optional: coordinate precision.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToMgrs = function(coords, output, precision){
      var utmEasting,
            utmNorthing,
            letters,
            usngNorthing,
            usngEasting,
            mgrs = null,
            i;

        if(typeof coords === 'undefined' || typeof output === 'undefined'){
            throw new Error('utmToMgrs(): Missing arguments. Required: coords,output.');
        }
        if(typeof coords !== 'object'){
            throw new Error('utmToMgrs(): Incorrect type for coords. Required: object.');
        }

        if (typeof precision === 'string') {
            precision = parseInt(precision, 10);
        }

        precision = precision ? precision : 5;

        utmEasting = coords.easting;
        utmNorthing = coords.northing;

        // southern hemisphere case
        if (coords.hemisphere === 'S') {
            // Use offset for southern hemisphere
            utmNorthing += NORTHING_OFFSET; 
        }

        letters  = findGridLetters(coords.zoneNumber, utmNorthing, utmEasting);
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
        if (typeof output === 'string' && output === 'object'){
            mgrs = {};
            mgrs.zoneNumber = coords.zoneNumber;
            mgrs.zoneLetter = coords.zoneLetter;
            mgrs.gridLetters = letters;
            mgrs.easting = usngEasting;
            mgrs.northing = usngNorthing
        } else if(typeof output === 'string' && output === 'string'){
            mgrs = coords.zoneNumber + coords.zoneLetter + ' ' + letters + ' ' + usngEasting + usngNorthing;
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
     * If object is chosen, it will have two properties, latitude and longitude.
     *
     * @param UTMNorthing- northing-m (numeric), eg. 432001.8  
     * @param UTMEasting- easting-m  (numeric), eg. 4000000.0
     * @param UTMZoneNumber- 6-deg longitudinal zone (numeric), eg. 18
     * @param output- String representing return type (object or string).
     * @param precision - Optional decimal precision.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToDd = function(UTMNorthing, UTMEasting, UTMZoneNumber, output, precision){
        var xUTM,
            yUTM,
            zoneNumber,
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
            dd = null;

        if( typeof UTMNorthing === 'undefined' || 
            typeof UTMEasting === 'undefined'|| 
            typeof UTMZoneNumber === 'undefined' || 
            typeof output === 'undefined'){
            throw new Error('utmToDd(): Missing arguments. Required: UTMNorthing,UTMEasting,UTMZoneNumber,output.');
        }

        //if no precision is provided, set precision to 2.
        precision = precision ? precision: 2;

        // remove 500,000 meter offset for longitude
        xUTM = parseFloat(UTMEasting) - EASTING_OFFSET; 
        yUTM = parseFloat(UTMNorthing);
        zoneNumber = parseInt(UTMZoneNumber, 10);

        // origin longitude for the zone (+3 puts origin in zone center) 
        lonOrigin = (zoneNumber - 1) * 6 - 180 + 3; 

        M = yUTM / k0;
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

        //cut of decimal places based on precision.
        lat = lat.toFixed(precision);
        lon = lon.toFixed(precision);

        if (typeof output === 'string' && output === 'object'){
            dd = {};
            dd.latitude = lat;
            dd.longitude = lon;
        }else if (typeof output === 'string' && output === 'string'){
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
     * If object is chosen, it will have two properties, latitude and longitude.
     * Each will have these properties:
     * - degrees: positive integer
     * - minutes: positive integer
     * - seconds: positive float
     * - direction: N, S, E, or W
     *
     * @param UTMNorthing- northing-m (numeric), eg. 432001.8  
     * @param UTMEasting- easting-m  (numeric), eg. 4000000.0
     * @param UTMZoneNumber- 6-deg longitudinal zone (numeric), eg. 18
     * @param output- String representing return type (object or string).
     * @param precision - Optional decimal precision.
     * @return Depends on output parameter (Object or a String).
     */
    cc.utmToDms = function(UTMNorthing, UTMEasting, UTMZoneNumber, output, precision){

        if( typeof UTMNorthing === 'undefined' || 
            typeof UTMEasting === 'undefined'|| 
            typeof UTMZoneNumber === 'undefined' || 
            typeof output === 'undefined'){
            throw new Error('utmToDd(): Missing arguments. Required: UTMNorthing,UTMEasting,UTMZoneNumber,output.');
        }

        if (typeof output !== 'string' || output !== 'string' || output !== 'object'){
            throw new Error("utmToDms(): Incorrect output type specified. Required: string or object.");
        }

        //if no precision is provided, set precision to 2.
        precision = precision ? precision: 2;

        var dd = cc.utmToDd(UTMNorthing, UTMEasting, UTMZoneNumber, 'object', precision);

        return cc.ddToDms(dd.latitude, dd.longitude, output);
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
     * If object is chosen, it will have two properties, latitude and longitude.
     * 
     * @param lat- latitude (float or string representing a float)
     * @param lon- longitude (float or string representing a float)
     * @param output- String representing return type (object or string).
     * @return Depends on output parameter (Object or a String).
     */
    cc.dmsToDd = function(lat, lon, output){
        var north = lat.match(/^\d{6,7}(\.\d+)?N/),
            south = lat.match(/^\d{6,7}(\.\d+)?S/),
            west = lon.match(/^\d{6,7}(\.\d+)?W$/),
            east = lon.match(/^\d{6,7}(\.\d+)?E$/),
            lat,
            lon,
            dd = null;

        if(typeof lat === 'undefined' || typeof lon === 'undefined' || typeof output === 'undefined'){
            throw new Error('dmsToDd(): Missing arguments. Required: lat,lon,output.');
        }

        if(north){
            lat = dmsToDecimal(north[0]);
        }else{ //south
            lat = dmsToDecimal(south[0]) * (-1); //South is negative
        }

        if(east){
            lon = dmsToDecimal(east[0]);
        }else{ //West
            lon = dmsToDecimal(west[0]) * (-1); //West is negative
        }

        if (typeof output === 'string' && output === 'object'){
            dd.latitude = lat;
            dd.longitude = lon;
        }else if (typeof output === 'string' && output === 'string'){
            dd = lat + ', ' + lon;
        }else {
             throw new Error("dmsToDd(): Incorrect output type specified. Required: string or object.");
        }

        return dd;

    };


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

  	console.info('CC has been loaded');
}).call(this);
