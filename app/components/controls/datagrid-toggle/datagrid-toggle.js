define([
    './datagrid-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $dataGridToggleButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $dataGridToggleButton = context.$('#dataGridToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $dataGridToggleButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $dataGridToggleButton.on('click', function(event) {
                event.preventDefault();

                if(context.$(this).hasClass('active')) {
                    publisher.closeDatagrid();
                } else {
                    publisher.openDatagrid();
                }
            });

        },
        setActive: function() {
            if(checkDataStorageHasData()) {
                $dataGridToggleButton.addClass('active');
            } else {
                publisher.publishMessage({
                    "messageType": "warning",
                    "messageTitle": "Datatable",
                    "messageText": "No data to display in datatable."
                });
            }
        },
        removeActive: function() {
            $dataGridToggleButton.removeClass('active');
        },
        clear: function(){
            $dataGridToggleButton.removeClass('active');
        }
    };

    function checkDataStorageHasData() {
        var validDataFound = false;

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value){
            if(value.length > 0) {
                validDataFound = true;
                return;
            }
        });

        return validDataFound;
    }

    return exposed;
});