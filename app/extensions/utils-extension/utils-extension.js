define([
    'jquery'
], function($){
    /**
      * @exports utils-extension
      */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.utils} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {

            var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

            var utils = {
                /**
                 * Add a CSS payload.
                 * @function
                 * @instance 
                 * @param {String} style - The CSS payload
                 * @param {String} [id] - Id for the style element, used so it could be removed later.
                 * Set as 'data-meridian-style-id'. Empty string used if no id is provided.
                 * @example this.sandbox.utils.addCSS(basemapGalleryCSS, 'basemap-component-style');
                 * @memberof Sandbox.utils
                 */
                addCSS: function(style, id) {
                    var styleId = (id) ? id : '';
                    $('<style type="text/css" data-meridian-style-id="' + styleId + '"></style>')
                        .html(style)
                        .appendTo("head");
                },
                /**
                 * Provides access to jQuery's ajax function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.ajax.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                ajax: $.ajax,
                /**
                 * Provides access to jQuery's contains function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.contains.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                contains: $.contains, // for help see jquery.contains
                /**
                 * Creates a geoJson Object based on coordinates provided.
                 * @function
                 * @instance 
                 * @param {Object} coordinates - Coordinates provided.
                 * @param {String} coordinates.lat - Latitude given.
                 * @param {String} coordinates.lon - Longitude given.
                 * @memberof Sandbox.utils
                 * @return {Object} The geoJson object created.
                 * @example 
                 * geoJson = {
                 *     type: 'feature',
                 *     geometry: {
                 *         type: 'point',
                 *         coordinates: [coordinates.lat, coordinates.lon]
                 *         },
                 *     properties: {}
                 * };
                 */
                createGeoJson: function(coordinates){
                    var geoJson = {
                            type: 'feature',
                            geometry: {
                                type: 'point',
                                coordinates: [coordinates.lon, coordinates.lat]
                            },
                            properties: {}
                        };
                    return geoJson;
                },
                /**
                 * Provides access to jQuery's data function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.data.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                data: $.data, 
                /**
                 * Provides access to jQuery's Deferred function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.Deferred.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                Deferred: $.Deferred, 
                /**
                 * Provides access to jQuery's each function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.each.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                each: $.each, 
                /**
                 * Provides access to jQuery's error function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.error.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                error: $.error, 
                /**
                 * Provides access to jQuery's extend function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.extend.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                extend: $.extend, 
                /**
                 * Return the first value of the input, but items in Objects have NO GUARENTEED ORDER.
                 * @function
                 * @instance
                 * @param {Object|Array|String} obj - List or object with the data.  
                 * @returns First matching item, or undefined if not found.
                 * @memberof Sandbox.utils
                 */
                first: function(obj) {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) && typeof(i) !== 'function') {
                            return obj[i];
                        }
                    }
                },
                /**
                 * Create listener on document.
                 * @function
                 * @instance
                 * @param  {String} selector - Event type.
                 * @param  {String} data - Value to query DOM (tag, class, id).
                 * @param  {Function} fn - Callback function to fire 'on' event.
                 * @memberof Sandbox.utils
                 * @example $(document).on(selector, data, fn);
                 */
                forever: function(selector, data, fn){
                    $(document).on(selector, data, fn);
                },
                /**
                 * Provides access to jQuery's grep function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.grep.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                grep: $.grep,
                /**
                 * Provides access to jQuery's isEmptyObject function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.isEmptyObject.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                isEmptyObject: $.isEmptyObject,
                /**
                 * Provides access to jQuery's makeArray function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.makeArray.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                makeArray: $.makeArray,
                /**
                 * Provides access to jQuery's map function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.map.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                map: $.map,
                /**
                 * Provides access to jQuery's merge function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.merge.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                merge: $.merge, 
                /**
                 * Provides access to jQuery's now function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.now.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                now: $.now, 
                /**
                 * Provides access to jQuery's parseJSON function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.parseJSON.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                parseJSON: $.parseJSON, 

                /**
                 * A namespace reserved for functions used specificaly for preferences.
                 * @namespace Sandbox.utils.preferences
                 * @memberof Sandbox.utils
                 */
                preferences: {
                    /**
                     * Returns value stored in local storage based on a given key.
                     * @function
                     * @instance 
                     * @param {String} key - Key provided.
                     * @memberof Sandbox.utils.preferences
                     * @return {Object|Boolean} The data found, false if nothing was found. 
                     */
                    get: function(key){
                        if(typeof(Storage)!=="undefined"){
                            var data;
                            try{
                                data = JSON.parse(localStorage.getItem(key));
                            }
                            catch(err){
                                data = localStorage.getItem(key);
                            }
                            return data;
                        }
                        else{
                            return false;
                        }
                    },
                    /**
                     * Store data of a key value pair in local storage.
                     * @function 
                     * @instance 
                     * @param {String} key - Key provided.
                     * @param {String | Object} val - Value content.
                     * @memberof Sandbox.utils.preferences
                     * @return {Boolean} True if successfully stored, otherwise, false.
                     */
                    set: function(key, val){
                        if(typeof(Storage)!=="undefined"){
                            if(typeof val === 'object'){
                                val = JSON.stringify(val);
                            }
                            localStorage.setItem(key, val);
                            return true;
                        }
                        else{
                            return false;
                        }

                    }
                },
                /**
                 * Removes a CSS payload (if the one to remove was added through its counterpart method and assigned an id)
                 * @function
                 * @instance
                 * @param  {String} id - 'data-meridian-style-id' of the style element to be removed.
                 * @example this.sandbox.utils.removeCSS('basemap-style');
                 * @memberof Sandbox.util
                 */
                removeCSS: function(id) {
                    $('[data-meridian-style-id=' + id + ']').remove();
                },
                /**
                 * Provides access to jQuery's trim function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.trim.
                 * @function 
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                trim: $.trim,
                /**
                 * Provides access to jQuery's type function by exposing it to the {@link Sandbox} namespace.
                 * For more help, see jquery.type.
                 * @function 
                 * @instance 
                 * @memberof Sandbox.utils
                 */
                type: $.type,
                /**
                 * Provides URL host name information.
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 * @return {String} Internet protocol with the URL host name.
                 */
                getCurrentNodeJSEndpoint: function() {
                    return "https://" + window.location.host;
                },
                /**
                 * Generates and returns a Universal Unique Identifier (UUID).
                 * @function
                 * @instance 
                 * @memberof Sandbox.utils
                 * @return Randomly generated Universal unique identifier (UUID). 
                 */
                UUID: function(){
                    var r,
                        rnd= 0,
                        uuid = new Array(36);

                    for (var i = 0; i < 36; i++){
                        if (i === 8 || i === 13 || i === 18 || i === 23){
                            uuid[i] = "-";
                        } else if (i === 14){
                            uuid[i] = '4';
                        } else {
                            if (rnd <= 0x02){
                                rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                            }
                            r = rnd & 0xf;
                            rnd = rnd >> 4;
                            uuid[i] = CHARS[(i === 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                    return uuid.join("");
                },
                /**
                 * Trims input values larger than 10,000 to 'value/1000'K+
                 * @function
                 * @instance 
                 * @param {String|Integer} number - Number to be trimmed.
                 * @memberof Sandbox.utils
                 * @returns {String} Trimed number if the value is more than 10,000. 
                 * Same number is returned when value is bellow 10,000.
                 * @example 10,000 as input ends up as: 10k
                 *  20,000 as input ends up as: 20k
                 *  5 as inpud ends up as: 5
                 *  etc.
                 */
                trimNumber: function(number){
                    if(typeof number === "string") {
                        number = parseFloat(number);
                    }

                    if(number >= 10000) {
                        return Math.floor(number/1000) + 'K+';
                    } else {
                        return String(number);
                    }
                },
                /**
                 * Reads input as text and results are passed to the callback function.
                 * @param {File} file - Input to be read as Text using a FileReader.
                 * @param {Function} callback - Function where the resulting text will passed.
                 * @funciton
                 * @instance
                 * @memberof Sandbox.utils
                 */
                getAsText: function(file, callback){
                    var reader = new FileReader();

                    reader.readAsText(file, 'UTF-8');
                    reader.onloadend = function(e){
                        var text = e.target.result;
                        callback(text);
                    };
                },
                /**
                 * Return the extension of a file.
                 * This assumes that the last '.' shows the extension.
                 * @param file
                 * @returns {*}
                 */
                getFileExtension: function(file){
                    var filenameParts;

                    if(!file){
                        return;
                    }

                    filenameParts = file.name.split('.');

                    return filenameParts[filenameParts.length - 1];
                },
                /**
                 * Return the height of the element provided. 
                 * Window height is given when no element is provided.
                 * @param  {String} [el] - Name of element used to search as a jQuery
                 * @function
                 * @instance
                 * @memberof Sandbox.utils
                 */
                pageHeight: function(el){
                    if(el) {
                        return $(el).height();
                    } else {
                        return $(window).height();
                    }
                },
                /**
                 * Return the width of the element provided. 
                 * Window width is given when no element is provided.
                 * @param  {String} [el] - Name of element used to search as a jQuery
                 * @function
                 * @instance
                 * @memberof Sandbox.utils
                 */
                pageWidth: function(el){
                    if(el) {
                        return $(el).width();
                    } else {
                        return $(window).width();
                    }
                },
                /**
                 * Sets a 'on resize' listener on the window element with the provided callback.
                 * @param  {Function} callback - Callback function.
                 * @function
                 * @instance
                 * @memberof Sandbox.utils
                 */
                onWindowResize: function(callback){
                    $(window).on('resize', callback);
                },
                /**
                 * Provides access to Underscore's _.size function by exposing it to the {@link Sandbox} namespace.
                 * @function 
                 * @instance 
                 * @param {*} obj - The object and/or list where _.size will be applied to.
                 * @returns The number of values in the object or list.
                 * @memberof Sandbox.utils
                 */
                size: function(obj){
                    return _.size(obj);
                }
            };
            /**
             * @namespace Sandbox.utils
             * @memberof Sandbox
             */
            app.sandbox.utils = utils;

            // Map Aura's $find over to $ for less verbose access to Scoped jQuery (scoped to the individual component)
            app.core.Components.Base.prototype.$ = app.core.Components.Base.prototype.$find;
        }
    };

    return exposed;
});



