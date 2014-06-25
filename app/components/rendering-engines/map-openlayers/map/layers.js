define([
    './../libs/openlayers-2.13.1/OpenLayers'
], function(){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        }
    };
    return exposed;
});