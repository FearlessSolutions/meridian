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
                 * @param queryId
                 */
                "addActiveAJAX": function (newAJAX, queryId) {
                    if(queryId) {
                        newAJAX.queryId = queryId;
                    }

                    activeAJAXs.push(newAJAX);
                },
                /**
                 * Remove finished AJAX from list
                 */
                "clean": function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.readyState === 4) { //4 is "complete" status
                            activeAJAXs.splice(index, 1);
                        }
                    });
                },
                /**
                 * Abort ALL open AJAX
                 */
                "clear": function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.queryId === params.queryId) { //This was set in queryData
                            ajax.abort();
                            activeAJAXs.splice(index, 1);
                        }
                    });
                },
                /**
                 * Aborts AJAX based on queryId
                 * @param queryId
                 */
                "stopQuery": function(queryId) {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.queryId === queryId) {
                            ajax.abort();
                            activeAJAXs.splice(index, 1);
                        }
                    });
                }
            };

            //Register a listener so that clean is automatically called after each ajax call
            $(document).ajaxComplete( app.sandbox.ajax.clean);
        }
    };



    return exposed;
});
