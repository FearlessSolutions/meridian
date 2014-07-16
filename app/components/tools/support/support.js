define([
    './support-publisher',
    'bootstro',
    'bootstrap',
    'bootstrapDialog'
], function (publisher, bootstro) {

    var context,
        MENU_DESIGNATION = 'support-dialog',
        $supportDialog,
        $supportButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $supportDialog = context.$('#SupportDialog');
            $supportButton = context.$('#support');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $supportButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $supportButton.on('click', function(event) {
                event.preventDefault();
                $supportDialog.dialog('toggle');
            });

            $supportDialog.on('shown.bs.dialog', function(){
                publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            });

            context.$('#tour').on('click', function(event) {
                $supportButton.trigger('click');
                bootstro.start('.bootstro');
            });

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
        },
        handleMenuOpening: function(params){
            if(params.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                closeMenu();
            }
        }
    };

    return exposed;

    function closeMenu(){
        $supportDialog.dialog('hide');
    }
});