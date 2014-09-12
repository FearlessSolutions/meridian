define([
    './datagrid-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $dataGridToggleButton;

    
    var exposed = {
       /**
        * Utilized by all files that want to add functionality to the component.
        * Activetes the tooltip, initializes variables and action listeners.
        * @instance
        * @memberof module:datagrid-toggle
        */
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
        /**
        * Adds the active class to the component. Sends a message if no data is 
        * avaliable to be displayed.
        * @instance
        * @memberof module:datagrid-toggle
        */
        setActive: function() {
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                $dataGridToggleButton.addClass('active');
            } else {
                publisher.publishMessage({
                    "messageType": "warning",
                    "messageTitle": "Datatable",
                    "messageText": "No data to display in datatable."
                });
            }
        },
        /**
        * Removes the active class from the component.
        * @instance
        * @memberof module:datagrid-toggle
        */
        removeActive: function() {
            $dataGridToggleButton.removeClass('active');
        },
        /**
        * Removes the active class from the component.
        * @instance
        * @memberof module:datagrid-toggle
        */
        clear: function(){
            $dataGridToggleButton.removeClass('active');
        }
    };

    return exposed;
});