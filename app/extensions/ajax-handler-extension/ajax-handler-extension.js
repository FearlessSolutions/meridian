/**
 * Consolidated holding place for open AJAX calls.
 * Cleans and aborts as required
 */
define([
], function() {
    var activeAJAXs;
    var exposed = {
        initialize: function(app) {
            activeAJAXs = [];

            app.sandbox.ajax = {
                /**
                 * Add a new AJAX to the list.
                 * If it is a query, add the property to the call
                 * @param newAJAX
                 * @param layerId
                 */
                addActiveAJAX: function (params) {
                    if(params.layerId) {
                        params.newAJAX.layerId = params.layerId;
                    }
                    params.newAJAX.progressId = params.layerId || app.sandbox.utils.uuid(); // Use the Layer ID, else generate a new UUID
                    activeAJAXs.push(params.newAJAX);
                    app.sandbox.emit('progress.queue.add', {"progressId": params.newAJAX.progressId});
                },
                /**
                 * Remove finished AJAX from list
                 */
                clean: function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.readyState === 4) { //4 is "complete" status
                            activeAJAXs.splice(index, 1);
                            app.sandbox.emit('progress.queue.remove', {"progressId": ajax.progressId});
                        }
                    });
                },
                /**
                 * Abort ALL open AJAX
                 */
                clear: function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        ajax.abort();
                        activeAJAXs.splice(index, 1);
                        app.sandbox.emit('progress.queue.remove', {"progressId": ajax.progressId});
                    });
                },
                /**
                 * Aborts AJAX based on layerId
                 * @param layerId
                 */
                stopQuery: function(params) {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.layerId === params.layerId) {
                            ajax.abort();
                            activeAJAXs.splice(index, 1);
                            app.sandbox.emit('progress.queue.remove', {"progressId": ajax.progressId});
                        }
                    });
                }
            };

            //Register a listener so that clean is automatically called after each ajax call
            $(document).ajaxComplete(app.sandbox.ajax.clean);
        }
    };



    return exposed;
});
