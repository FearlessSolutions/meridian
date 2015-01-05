define([
    './support-publisher',
    'bootstro',
    'bootstrap'
], function (publisher, bootstro) {

    var context,
        contentLoaded = false,
        SUPPORT_DESIGNATION = 'support-dialog',
        ABOUT_DESIGNATION = 'about-dialog',
        $supportModal,
        $aboutModal,
        $supportModalBody,
        $supportCloseButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            $supportModal = context.$('#support-modal');
            $supportModalBody = context.$('#support-modal .modal-body');
            $supportCloseButton = context.$('#support-modal.modal button.close');
            $supportButton = context.$('#support');
            $aboutModal = context.$('#about-modal');
            $aboutCloseButton = context.$('#about-modal.modal button.close');

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

            context.$('#about').on('click', function(event) {
                publisher.closeSupport();
                publisher.openAbout();

            });

            context.$('#ok').on('click', function(event) {
                publisher.closeAbout();
                publisher.openSupport();

            });

            $supportModal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeSupport();
             });

             $aboutModal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeAbout();
             });

            $supportCloseButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeSupport();
            });
            $aboutCloseButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeAbout();
            }); 

           
        },
        openSupport: function() {
            publisher.publishOpening({"componentOpening": SUPPORT_DESIGNATION});
            $supportModal.modal('show');
        },
        closeSupport: function() {
            $supportModal.modal('hide');
        },
        openAbout: function() {
            publisher.publishOpening({"componentOpening": ABOUT_DESIGNATION});
            $aboutModal.modal('show');
        },
        closeAbout: function() {
            $aboutModal.modal('hide');
        },
        clear: function() {
            $supportModal.modal('hide');
            $aboutModal.modal('hide');
        }
    };

    return exposed;

});