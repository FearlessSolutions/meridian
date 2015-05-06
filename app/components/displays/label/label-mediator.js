define([
    './label'
], function (label) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.layer.hide.all', label.removeLabel);
            context.sandbox.on('map.label.create', label.createLabel);
        }
    };

    return exposed;
});