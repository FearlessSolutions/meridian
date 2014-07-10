define([
    './datagrid-toggle-publisher',
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('#dataGridToggleButton').on('click', function(event) {
                event.preventDefault();
                var validDataFound = false;

                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value){
                    if(value.length > 0) {
                        validDataFound = true;
                        return;
                    }
                });

                if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets) && validDataFound) {
                    publisher.toogleGrid();
                    if(context.$(this).hasClass('active')) {
                        context.$(this).removeClass('active');
                    }else {
                        context.$(this).addClass('active');
                    }
                } else {
                    publisher.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Datatable",
                        "messageText": "No data to display in datatable."
                    });
                }
            });

        },
        clear: function(){
            context.$('#dataGridToggleButton').removeClass('active');
        }
    };

    return exposed;
});