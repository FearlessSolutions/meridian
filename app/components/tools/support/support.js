define([
    'bootstro',
    'bootstrap'
], function (bootstro) {

    var context,
        contentLoaded = false,
        SUPPORT_DESIGNATION = 'support-dialog',
        ABOUT_DESIGNATION = 'about-dialog',
        $supportModal,
        $aboutModal,
        $supportModalBody,
        $supportCloseButton,
        $supportButton,
        $aboutCloseButton;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;

            $supportModal = context.$('#support-modal');
            $supportModalBody = context.$('#support-modal .modal-body');
            $supportCloseButton = context.$('#support-modal.modal button.close');
            $supportButton = context.$('#support');
            $aboutModal = context.$('#about-modal');
            $aboutCloseButton = context.$('#about-modal.modal button.close');

            context.$('#tour').on('click', function(event) {
                var bootstroStepCount;
                mediator.closeSupport();
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
                mediator.closeSupport();
                mediator.openAbout();

            });

            context.$('#ok').on('click', function(event) {
                mediator.closeAbout();
                mediator.openSupport();

            });

            $supportModal.modal({
                backdrop: true,
                keyboard: true,
                show: false
             }).on('hidden.bs.modal', function() {
                mediator.closeSupport();
             });

             $aboutModal.modal({
                backdrop: true,
                keyboard: true,
                show: false
             }).on('hidden.bs.modal', function() {
                mediator.closeAbout();
             });

            $supportCloseButton.on('click', function(event) {
                event.preventDefault();
                mediator.closeSupport();
            });
            $aboutCloseButton.on('click', function(event) {
                event.preventDefault();
                mediator.closeAbout();
            }); 

           
        },
        openSupport: function() {
            mediator.publishOpening({componentOpening: SUPPORT_DESIGNATION});
            $supportModal.modal('show');
        },
        closeSupport: function() {
            $supportModal.modal('hide');
        },
        openAbout: function() {
            mediator.publishOpening({componentOpening: ABOUT_DESIGNATION});
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