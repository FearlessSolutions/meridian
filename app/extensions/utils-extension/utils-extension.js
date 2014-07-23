define([
    'jquery'
], function($){

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
                                coordinates: [coordinates.lat, coordinates.lon]
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
                }
            };

            app.sandbox.utils = utils;

            // Map Aura's $find over to $ for less verbose access to Scoped jQuery (scoped to the individual component)
            app.core.Components.Base.prototype.$ = app.core.Components.Base.prototype.$find;
        }
    };

    return exposed;
});



