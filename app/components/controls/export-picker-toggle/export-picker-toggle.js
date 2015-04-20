define([
    'bootstrap'
], function(){

    var context,
        $button;

    var exposed = {
        init: function(thisContext, mediator) {
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
                    mediator.closeModal();
                } else {
                    exposed.setActive();
                }
            });
        },
        setActive: function() {
            if(context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                mediator.publishMessage({
                    "messageType": 'warning',
                    "messageTitle": 'Export',
                    "messageText": 'No data to export.'
                });
                //make sure export is defined and that options is not empty
            } else if(!context.sandbox.export || !context.sandbox.export.options ||
                context.sandbox.utils.isEmptyObject(context.sandbox.export.options)) {
                mediator.publishMessage({
                    "messageType": 'warning',
                    "messageTitle": 'Export',
                    "messageText": 'No export options available in the application.'
                });
            } else {
                $button.addClass('active');
                mediator.openModal();
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