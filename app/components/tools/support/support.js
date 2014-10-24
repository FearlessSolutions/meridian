define([
    './support-publisher',
    'bootstro',
    'bootstrap',
], function (publisher, bootstro) {

    var context,
        contentLoaded = false,
        MENU_DESIGNATION = 'support-dialog',
        $modal,
        $modalBody,
        $closeButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            $modal = context.$('#support-modal');
            $modalBody = context.$('#support-modal .modal-body');
            $closeButton = context.$('#support-modal.modal button.close');
            $supportButton = context.$('#support');

            context.$('#tour').on('click', function(event) {
                publisher.closeSupport();
                $supportButton.trigger('click');

                if(contentLoaded === false){
                    contentLoaded = true;
                    console.log("Loading bootstro!");
                    //Add the bootstro attributes to the components found in the supportConfiguration file.
                    bootstroStepCount = 0;
                    context.sandbox.utils.each(context.sandbox.supportConfiguration.components, function(i, item) {
                        var component = $('#' + item.componentName); // This is unscoped access to jQuery, breaking module design pattern (TODO: look into alternatives)
                        if(component.length > 0) {
                            component.addClass('bootstro');
                            component.attr('data-bootstro-step', bootstroStepCount);
                            component.attr('data-bootstro-placement', item.placement);
                            component.attr('data-bootstro-width', item.width);
                            component.attr('data-bootstro-title', item.title);
                            component.attr('data-bootstro-content', item.content);
                            bootstroStepCount++;
                        }
                    });
                }
                bootstro.start('.bootstro');
            });

            $modal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeSupport();
             });

             $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeSupport();
            }); 

           
        },
        open: function() {
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        clear: function() {
            $modal.modal('hide');
        }
    };

    return exposed;

});