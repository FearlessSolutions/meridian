define([
], function() {
    var activeAJAXs;
    var exposed = {
        initialize: function(app) {
            activeAJAXs = [];

            app.sandbox.ajax = {
                "addActiveAJAX": function (newAJAX, queryId){
                    if(queryId){
                        newAJAX.queryId = queryId;00
                    }

                    activeAJAXs.push(newAJAX);
                },
                "clean": function(){
                    activeAJAXs.forEach(function(ajax, index){
                        if(ajax.readyState === 4){ //4 is "complete" status
                            activeAJAXs.splice(index, 1);
                        }
                    });
                },
                "clear": function(){
                    activeAJAXs.forEach(function(ajax, index){
                        if(ajax.queryId === params.queryId){ //This was set in queryData
                            ajax.abort();
                            activeAJAXs.splice(index, 1);
                        }
                    });
                },
                "stopQuery": function(queryId){
                    activeAJAXs.forEach(function(ajax, index){
                        if(ajax.queryId === queryId){
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
