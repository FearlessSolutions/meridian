define([
    'text!./cluster-toggle-notification.hbs',
    'handlebars',
    'bootstrap'
], function (notificationHBS, Handlebars) {

    var context,
        mediator,
        $button,
        userNotified,
        notificationTemplate,
        MAX_VISIBLE = 500,
        CONTROL_DESIGNATION = 'cluster-toggle';

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            $button = context.$('#clusterToggle');
            userNotified = false;
            notificationTemplate = Handlebars.compile(notificationHBS);

            $button.on( 'click', function(event) {
                event.preventDefault();

                if($button.hasClass('active')) {
                    exposed.uncluster();
                } else {
                    exposed.cluster();
                }
            });
        },
        cluster: function() {            
            mediator.cluster();
            $button.addClass('active');
        },
        uncluster: function() {
            if(userNotified){
                mediator.uncluster();

                $button.removeClass('active');

                if(countVisiblePoints() > MAX_VISIBLE){
                    mediator.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Clustering",
                        "messageText": "Unsafe to uncluster"
                    });    
                }
            }else{
                mediator.publishNotification({
                    "origin": CONTROL_DESIGNATION,
                    "body": notificationTemplate({
                        "maxCount": MAX_VISIBLE
                    })
                });
            }
        },
        checkConfirmation: function(params){
            if(params.origin !== CONTROL_DESIGNATION){
                return;
            }

            userNotified = true;
            exposed.uncluster();
        },
        clear: function(){} //Not implimented

    };

    return exposed;

    function countVisiblePoints(){
        var count = 0;
        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
            if(value.visible === true){
                count += value.models.length;
            }
        });
        
        return count;
    }
});