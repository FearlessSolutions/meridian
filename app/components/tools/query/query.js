define([
    'bootstrap'
], function () {
    var context,
        mediator,
        MENU_DESIGNATION = 'query-tool',
        $modal,
        $maxLon,
        $maxLat,
        $minLon,
        $minLat,
        $chkboxBookmark,
        isActive;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            isActive = false;
            
            $modal = context.$('#query-modal');
            $minLon = context.$('.query-form #query-location-minLon');
            $minLat = context.$('.query-form #query-location-minLat');
            $maxLon = context.$('.query-form #query-location-maxLon');
            $maxLat = context.$('.query-form #query-location-maxLat');
            $chkboxBookmark = context.$('#chkboxBookmark');

            $modal.modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
       
            context.$('.modal-footer button[type="submit"]').on('click', function(event) {
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
                        name: name,
                        dataSourceId: dataSource,
                        justification: justification,
                        minLat: minLat,
                        minLon: minLon,
                        maxLat: maxLat,
                        maxLon: maxLon,
                        pageSize: 300
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
                    mediator.closeQueryTool();

                    mediator.executeQuery(queryObject);

                    exposed.clearQueryForm();
                } else {
                    mediator.publishMessage({
                        messageType: 'error',
                        messageTitle: 'Query Tool',
                        messageText: 'Invalid query parameters.'
                    });
                }  

                return false;
            });

            context.$('.modal-footer button[type="cancel"]').on('click', function(event) {
                event.preventDefault();
                exposed.clearQueryForm();
                mediator.closeQueryTool();
            });

            context.$('.modal-header button[type="button"].close').on('click', function(event) {
                event.preventDefault();
                exposed.clearQueryForm();
                mediator.closeQueryTool();
            });

            context.$('.query-form #drawBBoxButton').on('click', function(event) {
                event.preventDefault();
                closeMenu();
                mediator.drawBBox();
            });
        },
        open: function(params) {
            $chkboxBookmark.prop('checked', false);
            isActive = true;
            var drawOnDefault = true;
            if(context.sandbox.queryConfiguration && 
                typeof context.sandbox.queryConfiguration.queryDrawOnDefault !== undefined) {
                drawOnDefault = context.sandbox.queryConfiguration.queryDrawOnDefault; 
            }

            if(drawOnDefault) {
                closeMenu();
                mediator.drawBBox();
            } else {
                //TODO Publish that the menu is opening (if it is)
                $modal.modal('toggle');

                mediator.removeBBox();
                exposed.populateCoordinates(context.sandbox.stateManager.getMapExtent());
            }
        },
        close: function(params) {
            isActive = false;
            closeMenu();
        },
        bboxAdded: function(params) {
            if (isActive) {
                $modal.modal('show');
                exposed.populateCoordinates(params);
            };
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
                context.$('#query-source').val('mock');
                context.$('.has-error').removeClass('has-error');            
        },
        clear: function(){
            exposed.clearQueryForm();
            $modal.modal('hide');
        },
        handleMenuOpening: function(params){
            if(params.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                closeMenu();
            }
        },
        populateQueryFromParams: function(params){
           $modal.modal('toggle');
           exposed.populateCoordinates(params.queryBbox);
           context.$('#query-name').val(params.queryName);
           context.$('#query-justification').val(params.justification);
           context.$('#query-source').val(params.queryType);
        },
        validateBookmark: function(params) {
            if ($chkboxBookmark.is(':checked')) {
                mediator.createBookmark(params);
            }
        }
    };

    function closeMenu(){
        $modal.modal('hide');
        mediator.removeBBox();
    }

    return exposed;
});