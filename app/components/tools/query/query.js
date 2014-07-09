define([
    './query-publisher',
    'bootstrap',
    'bootstrapDialog',
    'jqueryDrag'
], function (publisher) {
    var context,
        MENU_DESIGNATION = 'query-tool',
        $queryDialog,
        $maxLon,
        $maxLat,
        $minLon,
        $minLat;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $queryDialog = context.$('#QueryDialog');
            $minLon = context.$('.query-form #query-location-minLon');
            $minLat = context.$('.query-form #query-location-minLat');
            $maxLon = context.$('.query-form #query-location-maxLon');
            $maxLat = context.$('.query-form #query-location-maxLat');

            context.$('.show-query').click(function(event) {
                event.preventDefault();
            });

            $queryDialog.on('shown.bs.dialog', function(){
                publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            });
            
            context.$('.query-form button[type="submit"]').on('click', function(event) {
                event.preventDefault();                
                var minLon = $minLon.val() || '',
                    minLat = $minLat.val() || '',
                    maxLon = $maxLon.val() || '',
                    maxLat = $maxLat.val() || '',
                    name = context.$('#query-name').val() || '',
                    justification = context.$('#query-justification').val() || '',
                    dataSource = context.$('#query-source').val() || '',
                    errorFree = true;

                var queryObject = {
                        "name": name,
                        "serviceName": "mock",
                        "minLat": minLat, 
                        "minLon": minLon, 
                        "maxLat": maxLat, 
                        "maxLon": maxLon, 
                        "pageSize": 300
                };   


                if(minLon === '' || isNaN(minLon)) {
                    $minLon.parent().addClass('has-error');
                    errorFree = false;
                } else {
                    $minLon.parent().removeClass('has-error');
                }
                if(minLat === '' || isNaN(minLat)) {
                    $minLat.parent().addClass('has-error');
                    errorFree = false;
                } else {
                    $minLat.parent().removeClass('has-error');
                }
                if(maxLon === '' || isNaN(maxLon)) {
                    $maxLon.parent().addClass('has-error');
                    errorFree = false;
                } else {
                    $maxLon.parent().removeClass('has-error');
                }
                if(maxLat === '' || isNaN(maxLat)) {
                    $maxLat.parent().addClass('has-error');
                    errorFree = false;
                } else {
                    $maxLat.parent().removeClass('has-error');
                }
                if(name === '') {
                    context.$('#query-name').parent().parent().addClass('has-error');
                    errorFree = false;
                } else {
                    context.$('#query-name').parent().parent().removeClass('has-error');
                }
                if(justification === '') {
                    context.$('#query-justification').parent().parent().addClass('has-error');
                    errorFree = false;  
                } else {
                    context.$('#query-justification').parent().parent().removeClass('has-error');
                }
                if(dataSource === '') {
                    context.$('#query-source').parent().parent().addClass('has-error');
                    errorFree = false;
                } else {
                    context.$('#query-source').parent().parent().removeClass('has-error');
                }
                
                if(errorFree){
                    closeMenu();

                    publisher.executeQuery(queryObject);

                    exposed.clearQueryForm();
                } else {
                    publisher.publishMessage({
                        "messageType": "error",
                        "messageTitle": "Query Tool",
                        "messageText": "Invalid query parameters."
                    });
                }  

                return false;
            });

            context.$('.query-form button[type="cancel"]').on('click', function(event) {
                event.preventDefault();

                exposed.clearQueryForm();
                closeMenu();

            });

             context.$('.dialog-header button[type="button"].close').on('click', function(event) {

                exposed.clearQueryForm();

                publisher.removeBBox();
             });

            context.$('.query-form #drawBBoxButton').on('click', function(event) {
                event.preventDefault();
                
                closeMenu();

                publisher.drawBBox();
            });
            
            context.$('#Query').on('click', function(event) {
                event.preventDefault();

                var drawOnDefault = true;
                if(context.sandbox.queryConfiguration && 
                    typeof context.sandbox.queryConfiguration.queryDrawOnDefault !== undefined) {
                    drawOnDefault = context.sandbox.queryConfiguration.queryDrawOnDefault; 
                }

                if(drawOnDefault) {
                    closeMenu();
                    publisher.drawBBox();
                } else {
                    //TODO Publish that the menu is opening (if it is)
                    $queryDialog.dialog('toggle');

                    publisher.removeBBox();
                    exposed.populateCoordinates(context.sandbox.stateManager.getMapExtent());
                }
            });
        },
        bboxAdded: function(params) {
            $queryDialog.dialog('show');
            exposed.populateCoordinates(params);   
        },
        populateCoordinates: function(params) {
            $minLon.val(params.minLon);
            $minLat.val(params.minLat);
            $maxLon.val(params.maxLon);
            $maxLat.val(params.maxLat);
        },
        clearQueryForm: function(params) {
                $minLon.val('');
                $minLat.val('');
                $maxLon.val('');
                $maxLat.val('');
                context.$('#query-name').val('');
                context.$('#query-justification').val('');
                context.$('#query-source').val(1);

                context.$('.has-error').removeClass('has-error');            
        },
        clear: function(){
            exposed.clearQueryForm();
            $queryDialog.dialog('hide');
        },
        handleMenuOpening: function(params){
            if(params.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                closeMenu();
            }
        }
    };

    function closeMenu(){
        $queryDialog.dialog('hide');
        publisher.removeBBox();
    }

    return exposed;
});