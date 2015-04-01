define([
    'jquery',
    'coordinateConverter'
], function($,cc){

    var exposed = {
        initialize: function(app) {

            var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            
            var utils = {
                /**
                 * addCSS: 
                 * @param {string} style - the 'actual' CSS payload
                 * @param {string} id - optional id for the style element, used so it could be removed later, set as 'data-meridian-style-id'
                 * example: this.sandbox.utils.addCSS(basemapGalleryCSS, 'basemap-component-style');
                 */
                addCSS: function(style, id) {
                    var styleId = (id) ? id : '';
                    $('<style type="text/css" data-meridian-style-id="' + styleId + '"></style>')
                        .html(style)
                        .appendTo("head");
                },
                ajax: $.ajax, // for help see jquery.ajax
                contains: $.contains, // for help see jquery.contains
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
                data: $.data, // for help see jquery.data
                Deferred: $.Deferred, // for help see jquery.Deferred
                each: $.each, // for help see jquery.each
                error: $.error, // for help see jquery.error
                extend: $.extend, // for help see jquery.extend
                /**
                 * first: returns first thing in the item passed in. Works for Objects as well as arrays and strings, but items in obects have NO GUARENTEED ORDER.
                 * @param  {object/array/string} item - thing you want to look in, to find for first item
                 * @return {object/array/string} - returns macthing item, or undefined if not found
                 */
                first: function(obj) {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) && typeof(i) !== 'function') {
                            return obj[i];
                        }
                    }
                },
                /**
                 * [forever description]
                 * @param  {string} selector - string for event type
                 * @param  {string} data - string to query DOM (tag, class, id)
                 * @param  {Function} fn - callback to fire on event
                 * @return {jquery object}
                 */
                forever: function(selector, data, fn){
                    $(document).on(selector, data, fn);
                },
                grep: $.grep, // for help see jquery.grep
                isEmptyObject: $.isEmptyObject, // for help see jquery.isEmptyObject
                makeArray: $.makeArray, // for help see jquery.makeArray
                map: $.map, // for help see jquery.map
                merge: $.merge, // for help see jquery.merge
                now: $.now, // for help see jquery.now
                parseJSON: $.parseJSON, // for help see jquery.parseJSON
                isEmptyObject: $.isEmptyObject,
                preferences: {
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
                 * removeCSS: removes a CSS payload (if the one to remove was added through its counterpart method and assigned an id)
                 * @param  {string} id - 'data-meridian-style-id' of the style element to be removed
                 * example: this.sandbox.utils.removeCSS(basemap-style');
                 */
                removeCSS: function(id) {
                    $('[data-meridian-style-id=' + id + ']').remove();
                },
                trim: $.trim, // for help see jquery.trim
                type: $.type, // for help see jquery.type
                getCurrentNodeJSEndpoint: function() {
                    return "https://" + window.location.host;
                },
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
                pageHeight: function(el){
                    if(el) {
                        return $(el).height();
                    } else {
                        return $(window).height();
                    }
                },
                pageWidth: function(el){
                    if(el) {
                        return $(el).width();
                    } else {
                        return $(window).width();
                    }
                },
                onWindowResize: function(callback){
                    $(window).on('resize', callback);
                },
                size: function(obj){
                    return _.size(obj);
                },
                /**
                 * Parses a query string into an object containing
                 * the kay-value pairs in it.
                 * @param url
                 * @returns {{}}
                 */
                parseQueryString: function(url){
                    var qs,
                        results = {},
                        tmp;

                    qs = url ? url.split('?')[1] : null;
                    if(qs) {
                        qs.split('&').forEach(function(pair) {
                            tmp = pair.split('=');
                            if(tmp[0].indexOf(',') > -1) {
                                results[tmp[0].trim()] = tmp[1].trim().split(',');
                            } else {
                                results[tmp[0].trim()] = tmp[1].trim();
                            }
                        });
                    }

                    return results;
                },
                convertCoordinate: function(input){
                    var dmsRegex = /\s*(\d{6,7}(\.\d+)?[NS]),\s*(\d{6,7}(\.\d+)?[WE])/,
                        ddRegex = /\s*((\-?\d+)(\.\d+)?)\s*,\s*((\-?\d+)(\.\d+)?)\s*$/,
                        mgrsRegex = /\s*(\d+[A-Z])\s*([A-Z]{2})\s*(\d+)$/,
                        utmRegex = /\s*(\d+[a-zA-Z])\s*(\d{6})\s*(\d{6,7})/,
                        dd,
                        dms,
                        utm,
                        mgrs,
                        coordinates = 'error';

                    //remove all spaces from the string, make all letters caps.
                    input = input.replace(/\s/g, '');
                    input = input.toUpperCase();
                    dd = input.match(ddRegex);
                    dms = input.match(dmsRegex);
                    utm = input.match(utmRegex);
                    mgrs = input.match(mgrsRegex);
                    if(dd !== null){
                        //position 2,3 are lat whole and decimal parts of the number.
                        //position 5,6 are lon whole and decimal parts of the number.
                        dd[1] = parseFloat(dd[1]);
                        dd[4] = parseFloat(dd[4]);
                        coordinates = {};
                        coordinates.dd = {
                            lat: dd[1],
                            lon: dd[4]
                        };
                        coordinates.dms = cc.ddToDms(dd[1],dd[4],'string');
                        coordinates.utm = cc.ddToUtm(dd[1],dd[4],'string');
                        coordinates.mgrs = cc.ddToMgrs(dd[1],dd[4],'string');

                    }else if(dms !== null){
                        //positions 2,4 are the decimal places only
                        coordinates = {};
                        coordinates.dd = cc.dmsToDd(dms[1], dms[3], 'object');
                        coordinates.dms = dms[0];
                        coordinates.utm = cc.dmsToUtm(dms[1], dms[3], 'string');
                        coordinates.mgrs = cc.dmsToMgrs(dms[1], dms[3], 'string');

                    }else if(utm !== null){
                        //position 1 is the zone, 2 is the easting, 3 the northing.
                        coordinates = {};
                        coordinates.dd = cc.utmToDd(utm[1], utm[2], utm[3], 'object');
                        coordinates.dms = cc.utmToDms(utm[1], utm[2], utm[3], 'string');
                        coordinates.utm = utm[0];
                        coordinates.mgrs = cc.utmToMgrs(utm[1], utm[2], utm[3], 'string');

                    }else if(mgrs !== null){
                        //position 1 is the zone, 2 the gridLetters and 3 the numeric location.
                        coordinates = {};
                        coordinates.dd = cc.mgrsToDd(mgrs[1], mgrs[2], mgrs[3], 'object');
                        coordinates.dms = cc.mgrsToDms(mgrs[1], mgrs[2], mgrs[3], 'string');
                        coordinates.utm = cc.mgrsToUtm(mgrs[1], mgrs[2], mgrs[3], 'string');
                        coordinates.mgrs = mgrs[1] + mgrs[2] + mgrs[3];
                    }
                    
                    return coordinates;
                }
            };

            app.sandbox.utils = utils;

            // Map Aura's $find over to $ for less verbose access to Scoped jQuery (scoped to the individual component)
            app.core.Components.Base.prototype.$ = app.core.Components.Base.prototype.$find;
        }
    };

    return exposed;
});



