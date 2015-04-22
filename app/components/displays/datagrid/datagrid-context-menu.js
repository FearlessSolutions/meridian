define([
    'text!./datagrid-context-menu-row.hbs',
    'handlebars'
], function (menuRowHBS) {
    var context,
        $menu,
        template,
        HIDDEN_PROPERTY = 'MERIDIAN_HIDDEN';

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            template = Handlebars.compile(menuRowHBS);
            $menu = context.$('#menu');
            $menu.hide();

            //Close menu on hover out
            $menu.hover(
                function(){return;},
                function(){
                    exposed.hideMenu();
                }
            );
        },
        menuCallback: function(params) {
            context.sandbox.emit(params.menuChannel, params.payload);  // dynamically emit publish messages
        },
        showMenu: function(params) {
            var featureId = params.item.featureId,
                layerId = params.item.layerId,
                layerVisibility,
                featureVisibility = !params.item[HIDDEN_PROPERTY]; //Opposite of hidden

            layerVisibility = context.sandbox.stateManager.getLayerStateById({
                layerId: layerId
            }).visible;

            // Clear previous menu
            $menu.empty();

            //Show Feature option
            $menu.append(template({
                channel: 'map.features.show',
                text: 'Show Feature',
                disabled: featureVisibility || !layerVisibility, // If the layer is not visible, also disable the menu item for show (can't show if the layer is off)
                layerId: layerId,
                featureId: featureId
            }));

            //Hide Feature option
            $menu.append(template({
                channel: 'map.features.hide',
                text: 'Hide Feature',
                disabled: !featureVisibility, // Can only hide it if it is shown
                layerId: layerId,
                featureId: featureId
            }));

            //Zoom to Feature option
            $menu.append(template({
                channel: 'map.zoom.toFeatures',
                text: 'Zoom to Feature',
                disabled: !featureVisibility, // Can only zoom if it is shown
                layerId: layerId,
                featureId: featureId

            }));

            // set menu item callback control
            $menu.find('li a').click(function(e){
                e.preventDefault();
                // Only process the click if the menu item doesn't have disabled class
                if(!context.$(this).parent('li').hasClass('disabled')) {

                    // Update StateManager to avoid Race Condition
                    if(this.getAttribute('data-channel') === 'map.features.hide') {
                        context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                            layerId: this.getAttribute('data-layerId'),
                            featureIds: [this.getAttribute('data-featureId')]
                        });
                    }
                    // Update StateManager to avoid Race Condition
                    if(this.getAttribute('data-channel') === 'map.features.show') {
                        context.sandbox.stateManager.removeHiddenFeaturesByLayerId({
                            layerId: this.getAttribute('data-layerId'),
                            featureIds: [this.getAttribute('data-featureId')]
                        });
                    }

                    // Execute callback from menu click
                    exposed.menuCallback({
                        menuChannel: this.getAttribute('data-channel'),
                        payload: {
                            layerId: this.getAttribute('data-layerId'),
                            featureIds: [this.getAttribute('data-featureId')]
                        }
                    });

                    // Close Context Menu
                    exposed.hideMenu();
                }

            });

            //Set position and show
            $menu.css('top', params.event.pageY)
                .css('left', params.event.pageX)
                .show();
        },
        hideMenu: function() {
            $menu.hide();
        }
    };

    return exposed;
});