(function(){
	//CONSTANTS
	var DEG_2_RAD = Math.PI / 180,
        RAD_2_DEG = 180.0 / Math.PI,
        EQUATORIAL_RADIUS,
        ECC_SQUARED,
        ECC_PRIME_SQUARED,
        IS_NAD83_DATUM = true,
        EASTING_OFFSET = 500000.0,
        NORTHING_OFFSET = 10000000.0,
        GRIDSQUARE_SET_COL_SIZE = 8,  // column width of grid square set
        GRIDSQUARE_SET_ROW_SIZE = 20, // row height of grid square set
        BLOCK_SIZE  = 100000, // size of square identifier (within grid zone designation),
        E1,
        k0 = 0.9996; // scale factor of central meridian

    // check for NAD83
    if (IS_NAD83_DATUM) {
        EQUATORIAL_RADIUS = 6378137.0; // GRS80 ellipsoid (meters)
        ECC_SQUARED = 0.006694380023; 
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

  	//Version
  	cc.VERSION = '0.0.1';

    //HELPERS
    
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

  	//FUNCTIONS
  	
  	cc.ddToMgrs = function(lat, lon, precision){

  	};

    cc.utmToMgrs = function(coords, precision){
      var utmEasting,
            utmNorthing,
            letters,
            usngNorthing,
            usngEasting,
            usng,
            i;

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

       
        usng = coords.zoneNumber + coords.zoneLetter + " " + letters + " " + 
              usngEasting + " " + usngNorthing;
        console.info('USNG: ', usng);
        
        //mgrs is basically USNG without any space delimiters.
        mgrs = coords.zoneNumber + coords.zoneLetter + letters + usngEasting + usngNorthing;
        

        return mgrs;
    };

    /*
     * Converts decimallatitude and longitude to UTM.
     *
     * Converts lat/long to UTM coords.  Equations from USGS Bulletin 1532 
     * (or USGS Professional Paper 1395 "Map Projections - A Working Manual", 
     * by John P. Snyder, U.S. Government Printing Office, 1987.)
     * 
     * Note- UTM northings are negative in the southern hemisphere.
     *
     * @param lat- Latitude in decimal; north is positive, south is negative
     * @param lon- Longitude in decimal; east is positive, west is negative
     * @param zone- optional, result zone
     * @return Object with three properties, easting, northing, zone
     */
    cc.ddToUtm = function(lat, lon, zone){
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
            utmcoords = {};

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
        zoneNumber = zone || helpers.getZoneNumber(lat, lon);

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

        utmNorthing = (k0 * ( M + N * Math.tan(latRad) * (
              (A * A) / 2 + (5 - T + 9 * C + 4 * C * C ) * (A * A * A * A) / 2 +
              (61 - 58 * T + T * T + 600 * C - 330 * ECC_PRIME_SQUARED ) *
              (A * A * A * A * A * A) / 720)
          ) );

        if (utmNorthing < 0) {
            utmNorthing += 10000000;
        }

        utmcoords.easting = Math.round(utmEasting);
        utmcoords.northing = Math.round(utmNorthing);
        utmcoords.zoneNumber = zoneNumber;
        utmcoords.zoneLetter = helpers.utmLetterDesignator(lat);
        utmcoords.hemisphere = lat < 0 ? 'S' : 'N';

        return utmcoords;
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
