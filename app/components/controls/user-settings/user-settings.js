define([
    './user-settings-publisher',
    'text!./user-settings-basemapList.hbs',
    'bootstrap',
    'handlebars'
], function (publisher,userSettingsListHBS) {

    var context,
        MENU_DESIGNATION = 'user-settings',
        menuDisabled, //If the whole menu is disabled
        queryDrawOnDefault = true,
        showCursorLocationDefault = true,
        $minLat,
        $minLon,
        $maxLat,
        $maxLon,
        $modal,
        $modalBody,
        $closeButton;

    var $queryToolDefaultToggle,
        $cursorLocationDefaultToggle;
    
    var exposed = {
        init:function(thisContext) {
            context = thisContext;

            $modal = context.$('#user-settings-modal');
            $modalBody = context.$('#user-settings-modal .modal-body');
            $closeButton = context.$('#user-settings-modal.modal button.close');

            // $modalBody = context.$("#userSettingsDialog");

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            context.$('#userSettings').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            if(context.options.label && context.options.label === true) {
                exposed.makeUserLabel();
                menuDisabled = true;
            }
            else{
                exposed.loadUserSettings();
                menuDisabled = false;
            }

            $modal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeUserSettings();
             });

             $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeUserSettings();
            }); 

        },
        open: function() {
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        makeUserLabel: function() {
            //removed unwanted html and adds the required css files that give the look and location of the button.
            context.$('.caret').remove();
            $modalBody.remove(); //to have a cleaner html.
            context.$('#userSettings').addClass('disabled');
        },
        loadUserSettings: function() {
            queryDrawOnDefault = true;
            showCursorLocationDefault = true;

            if(context.sandbox.queryConfiguration && 
                typeof context.sandbox.queryConfiguration.queryDrawOnDefault !== undefined) {
                queryDrawOnDefault = context.sandbox.queryConfiguration.queryDrawOnDefault; 
            }

            if(context.sandbox.cursorLocation && 
                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined) {
                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay; 
            }

            /**
             * Creates the list of available base maps. 
             * 'option value=' is the base map name used for base map switches. e.g landscape, imagery, etc.
             * options.fn looks up the property specified in the hbs, in our case the 'label' property.
             * @param  {Array of JSON} items  Represents the base map array found in map-configuration.js
             * @param  {HandleBar Object} options  Contains: {Object}data, {function}fn, {Object}hash and {function}inverse.
             * @return {null}  Registers the Handlebar helper. 
             */
            Handlebars.registerHelper('list', function(items, options) {
                var out = '<select id="basemap-list" name="basemap-list" class="form-control">';
                for(var i= 0; i<items.length; i++) {
                    out = out +  '<option value=' +
                     context.sandbox.mapConfiguration.basemaps[i].basemap +
                     '>'+options.fn(items[i])+ '</option>';
                }
                return out + '</select>';
            });

            var userSettingsListTemplate = Handlebars.compile(userSettingsListHBS);

            /**
             * Set all the values of the template.
             * 'baseMaps' must contain 'label' property that will be
             * used as the value of the drop down option. e.g. OSM Landscape, etc.
             */
            var html = userSettingsListTemplate({
                "baseMaps": context.sandbox.mapConfiguration.basemaps,
                "minLon": context.sandbox.mapConfiguration.initialMinLon,
                "maxLat": context.sandbox.mapConfiguration.initialMaxLat,
                "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                "minLat": context.sandbox.mapConfiguration.initialMinLat
            });
            $modalBody.append(html);

            //After the html is populated, grab jquery objects
            $minLat = context.$('#user-settings-minLat');
            $minLon = context.$('#user-settings-minLon');
            $maxLat = context.$('#user-settings-maxLat');
            $maxLon = context.$('#user-settings-maxLon');
            $queryToolDefaultToggle = context.$('#query-tool-default .btn-toggle-container');
            $cursorLocationDefaultToggle = context.$('#cursor-location-default .btn-toggle-container');

            //auto-select the loaded base map in the drop down.
            context.$('option[value='+
                context.sandbox.mapConfiguration.defaultBaseMap +
                ']').attr('selected', 'selected');

            /**
             * user-settings button listener.
             */
            context.$('#userSettings').on('click', function(event) {
                event.preventDefault();
                $modal.modal('toggle');
            });

            //Publish when shown
            $modalBody.on('shown.bs.dialog', function(){
                publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            });

            /**
             * user-settings cancel button listener.
             */
            context.$('.form-horizontal button[type="cancel"]').on('click', function(event) {
                event.preventDefault();

                $modal.modal('hide');
                resetDialog();
            });

            /**
             * user-settings close 'x' button listener.
             */
            // context.$('.dialog-header button[type="button"].close').on('click', function(event) {
            //     //TODO publish on channel
            //     exposed.closeMenu();
            // });

            /**
             * user-settings submit button listener.
             */
            context.$('.form-horizontal button[type="save"]').on('click', function(event) {
                event.preventDefault();

                var preferencesSaveStatus,
                    minLon = $minLon.val() || '',
                    maxLat = $maxLat.val() || '',
                    maxLon = $maxLon.val() || '',
                    minLat = $minLat.val() || '',
                    errorFree = true;

                if(isNaN(minLon) || !isFinite(minLon) || minLon === ''){
                    $minLon.parent().addClass('has-error');
                    errorFree = false;
                }
                if(isNaN(maxLat) || !isFinite(maxLat) || maxLat === ''){
                    $maxLat.parent().addClass('has-error');
                    errorFree = false;
                }
                if(isNaN(maxLon) || !isFinite(maxLon) || maxLon === ''){
                    $maxLon.parent().addClass('has-error');
                    errorFree = false;
                }
                if(isNaN(minLat) || !isFinite(minLat) || minLat === ''){
                    $minLat.parent().addClass('has-error');
                    errorFree = false;
                }

                if($queryToolDefaultToggle.find('.btn-on').hasClass('btn-primary')) {
                    queryDrawOnDefault = true;
                }else {
                    queryDrawOnDefault = false;
                }

                if($cursorLocationDefaultToggle.find('.btn-on').hasClass('btn-primary')) {
                    showCursorLocationDefault = true;
                }else {
                    showCursorLocationDefault = false;
                }

                if(errorFree) {
                    removeCssError();
                    $modal.modal('hide');
                    //save contents to memory
                    preferencesSaveStatus = context.sandbox.utils.preferences.set('john', {
                        "mapConfiguration": {
                            "initialMinLon": minLon,
                            "initialMaxLat": maxLat,
                            "initialMaxLon": maxLon,
                            "initialMinLat": minLat,
                            "defaultBaseMap": context.$('#basemap-list').val()
                        },
                        "queryConfiguration": {
                            "queryDrawOnDefault": queryDrawOnDefault
                        },
                        "cursorLocation": {
                            "defaultDisplay": showCursorLocationDefault
                        }
                    });

                    if(preferencesSaveStatus) {
                        publisher.publishMessage({
                            "messageType": "success",
                            "messageTitle": "User Settings",
                            "messageText": "User settings saved."
                        });
                    }else {
                        publisher.publishMessage({
                            "messageType": "error",
                            "messageTitle": "User Settings",
                            "messageText": "User settings failed to save."
                        });
                    }
                }else {
                    publisher.publishMessage({
                        "messageType": "error",
                        "messageTitle": "User Settings",
                        "messageText": "Invalid coordinates."
                    });
                }
            });

            /**
             * user-settings getExtent button listener.
             */
            context.$('.form-horizontal button[type="extent"]').on('click', function(event) {
                event.preventDefault();
                exposed.populateCoordinates(context.sandbox.stateManager.getMapExtent());
            });

            /**
             * user-settings default query tool button listener.
             */
            $queryToolDefaultToggle.find('.btn-toggle').on('click', function(event) {
                event.preventDefault();
                if(context.$(this).find('.btn-primary').size()>0) {
                    context.$(this).find('.btn').toggleClass('btn-primary');
                }
            });

            if(queryDrawOnDefault) {
                $queryToolDefaultToggle.find('.btn-on').addClass('btn-primary');
                $queryToolDefaultToggle.find('.btn-off').removeClass('btn-primary');
            } else {
                $queryToolDefaultToggle.find('.btn-on').removeClass('btn-primary');
                $queryToolDefaultToggle.find('.btn-off').addClass('btn-primary');
            }

            /**
             * user-settings cursor location default button listener.
             */
            $cursorLocationDefaultToggle.find('.btn-toggle').on('click', function(event) {
                event.preventDefault();
                if(context.$(this).find('.btn-primary').size()>0) {
                    context.$(this).find('.btn').toggleClass('btn-primary');
                }
            });

            if(showCursorLocationDefault) {
                $cursorLocationDefaultToggle.find('.btn-on').addClass('btn-primary');
                $cursorLocationDefaultToggle.find('.btn-off').removeClass('btn-primary');
            } else {
                $cursorLocationDefaultToggle.find('.btn-on').removeClass('btn-primary');
                $cursorLocationDefaultToggle.find('.btn-off').addClass('btn-primary');
            }
        },
        populateCoordinates: function(params) {
            removeCssError();
            $minLon.val(params.minLon);
            $maxLat.val(params.maxLat);
            $maxLon.val(params.maxLon);
            $minLat.val(params.minLat);

            publisher.publishMessage({
                "messageType": "success",
                "messageTitle": "User Settings",
                "messageText": "Extent loaded. Remember to save."
            });
        },
        closeMenu: function(){
            if(menuDisabled){
                return;
            }
            $modal.modal('hide');

            resetDialog();
        },
        handleMenuOpening: function(params){
            if(params.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                exposed.closeMenu();
            }
        },
        clear: function() {
            $modal.modal('hide');
        }
    };

    /**
     * Remove error css class from coordinate fields.
     * @return {null} Visual changes to HTML.
     */
    function removeCssError(){
        context.$('.has-error').removeClass('has-error');
    }

    /**
     * Clears and set fields to default values.
     * @return {null} Visual changes to HTML.
     */
    function resetDialog() {
        //clear any css error classes applied to any field.
        removeCssError();

        //set all coordinate fields to their default value.         
        $minLon.val(context.sandbox.mapConfiguration.initialMinLon);
        $maxLat.val(context.sandbox.mapConfiguration.initialMaxLat);
        $maxLon.val(context.sandbox.mapConfiguration.initialMaxLon);
        $minLat.val(context.sandbox.mapConfiguration.initialMinLat);
        //set the default dropdown basemap value.
        context.$('option[value=' + context.sandbox.mapConfiguration.defaultBaseMap + ']').attr('selected', 'selected');
        //set the correct state of the query tool toggle button.
        if(queryDrawOnDefault) {
            $queryToolDefaultToggle.find('.btn-on').addClass('btn-primary');
            $queryToolDefaultToggle.find('.btn-off').removeClass('btn-primary');
        }else {
            $queryToolDefaultToggle.find('.btn-on').removeClass('btn-primary');
            $queryToolDefaultToggle.find('.btn-off').addClass('btn-primary');
        }
        //set the correct state of the cursor location display toggle button.
        if(showCursorLocationDefault) {
            $cursorLocationDefaultToggle.find('.btn-on').addClass('btn-primary');
            $cursorLocationDefaultToggle.find('.btn-off').removeClass('btn-primary');
        }else {
            $cursorLocationDefaultToggle.find('.btn-on').removeClass('btn-primary');
            $cursorLocationDefaultToggle.find('.btn-off').addClass('btn-primary');
        }
    }

    return exposed;
});