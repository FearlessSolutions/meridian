define([
    './datagrid-toggle-publisher',
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('#dataGridToggleButton').on('click', function(event) {
                event.preventDefault();
                
                if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets) && context.sandbox.utils.first(context.sandbox.dataStorage.datasets).length >0) {
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