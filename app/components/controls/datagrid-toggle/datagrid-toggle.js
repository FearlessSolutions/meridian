define([
    'bootstrap'
], function () {
    var context,
        $dataGridToggleButton;

    var exposed = {
        init: function(thisContext, mediator) {
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
                    mediator.closeDatagrid();
                } else {
                    mediator.openDatagrid();
                }
            });

        },
        setActive: function() {
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                $dataGridToggleButton.addClass('active');
            } else {
                mediator.publishMessage({
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

    return exposed;
});