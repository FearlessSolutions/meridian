define([
    './export-picker-toggle-publisher',
    'bootstrap'
], function(publisher){

    var context,
        $button;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $button = context.$('#export-picker-toggle');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $button.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $button.on('click', function(event) {
                event.preventDefault();
                if($button.hasClass('active')) {
                    publisher.closeModal();
                } else {
                    exposed.setActive();
                }
            });
        },
        setActive: function() {
            if(context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                publisher.publishMessage({
                    "messageType": 'warning',
                    "messageTitle": 'Export',
                    "messageText": 'No data to export.'
                });
                //make sure export is defined and that options is not empty
            } else if(!context.sandbox.export || !context.sandbox.export.options ||
                context.sandbox.utils.isEmptyObject(context.sandbox.export.options)) {
                publisher.publishMessage({
                    "messageType": 'warning',
                    "messageTitle": 'Export',
                    "messageText": 'No export options available in the application.'
                });
            } else {
                $button.addClass('active');
                publisher.openModal();
            }
        },
        removeActive: function() {
            $button.removeClass('active');
        },
        clear: function() {
            exposed.removeActive();
        }

    };

    return exposed;

});