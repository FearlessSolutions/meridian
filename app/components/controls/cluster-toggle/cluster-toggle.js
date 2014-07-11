define([
    'text!./cluster-toggle-notification.hbs',
    './cluster-toggle-publisher',
    'bootstrap',
    'handlebars'
], function (notificationHBS, publisher) {

    var context,
        $button,
        userNotified,
        notificationTemplate,
        MAX_VISIBLE = 500,
        CONTROL_DESIGNATION = 'cluster-toggle';

    var exposed = {
        init: function(thisContext, notificationHTML) {
            context = thisContext;
            notificationMessage = notificationHTML;
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
            publisher.cluster();
            $button.addClass('active');
        },
        uncluster: function() {
            if(userNotified){
                publisher.uncluster();

                $button.removeClass('active');

                if(countVisiblePoints() > MAX_VISIBLE){
                    publisher.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Clustering",
                        "messageText": "Unsafe to uncluster"
                    });    
                }
            }else{
                publisher.publishNotification({
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