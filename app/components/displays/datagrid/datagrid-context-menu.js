define([
    './datagrid-publisher',
    'text!./datagrid-context-menu.hbs',
    'handlebars'
], function (publisher, datagridContextMenuHBS) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * [disableOption description]
         * @param {object} params - JSON parameters
         * @param {string} params.layerId - id of layer
         * @param {string} params.channel - internal pubsub channel
         * @return N/A
         */
        disableOption: function(params){
            var $option = context.$('#datagrid-' + params.layerId + '-' + params.featureId + '-context-menu a[data-channel="'+ params.channel + '"]').parent('li').addClass('disabled');
        },
        menuCallback: function(params) {
            context.sandbox.emit(params.menuChannel, params.payload);  // dynamically emit publish messages
        },
        showMenu: function(params) {
            var datagridContextMenuHTML,
                $currentMenu;

            // Remove any existing datagrid context menus
            context.$('#datagrid-context-menu').remove();

            datagridContextMenuTemplate = Handlebars.compile(datagridContextMenuHBS);
            datagridContextMenuHTML = datagridContextMenuTemplate({
                "layerId": params.layerId,
                "featureId": params.featureId
            });
            
            $('#datagridContainer').after(datagridContextMenuHTML);
            $currentMenu = context.$('#datagrid-context-menu');

            // close menu on hover out
            $currentMenu.hover(
                function(){return;},
                function(){
                    exposed.hideMenu();
                }
            );

            // set menu item callback control
            context.$('#datagrid-context-menu li a').click(function(e){
                e.preventDefault();

                // Update StateManager to avoid Race Condition
                if(this.getAttribute('data-channel') === 'map.features.hide') {
                    context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                        "layerId": this.getAttribute('data-layerId'),
                        "featureIds": [this.getAttribute('data-featureId')]
                    });
                }
                // Update StateManager to avoid Race Condition
                if(this.getAttribute('data-channel') === 'map.features.show') {
                    context.sandbox.stateManager.removeHiddenFeaturesByLayerId({
                        "layerId": this.getAttribute('data-layerId'),
                        "featureIds": [this.getAttribute('data-featureId')]
                    });
                }

                // Execute callback from menu click
                exposed.menuCallback({
                    "menuChannel": this.getAttribute('data-channel'),
                    "payload": {
                        "layerId": this.getAttribute('data-layerId'),
                        "featureIds": [this.getAttribute('data-featureId')]
                    }  
                });

                // Close Context Menu
                exposed.hideMenu();
                
            });
            

            $currentMenu
                .data("invokedOn", params.event.target)
                .show()
                .css({
                    position: "absolute",
                    left: getLeftLocation(params.event, $currentMenu),
                    top: getTopLocation(params.event, $currentMenu)
                });
            $currentMenu.show();
        },
        hideMenu: function() {
            context.$('#datagrid-context-menu').remove();
        }
    };

    function contextMenuClickHandler(selector) {
        context.$(selector)
            .off('click')
            .on( 'click', function (e) {
                context.$(this).hide();
        
                var $invokedOn = context.$(this).data("invokedOn");
                var $selectedMenu = context.$(e.target);
        });
    }

    function getLeftLocation(event, $menu) {
        var elementleft,
            pageWidth,
            elementWidth;

        elementleft = event.clientX;
        pageWidth = context.sandbox.utils.pageWidth();
        elementWidth = $menu.width();
        
        // opening menu would pass the side of the page
        if (elementleft + elementWidth > pageWidth &&
            elementWidth < elementleft) {
            return elementleft - elementWidth;
        } 
        return elementleft;
    }        
    

    function getTopLocation(event, $menu) {
        var bannerHeight = 0,
            elementTop,
            pageHeight,
            elementHeight;

        // Accounting for height of banners, if they exist (TODO: find a better way)
        context.sandbox.utils.each($('.banner'), function(){ // going outside of scope, not cool... find a better way
            bannerHeight += $(this).height(); // going outside of scope, not cool... find a better way
        });

        elementTop = event.clientY;
        pageHeight = context.sandbox.utils.pageHeight('#mapContainer');
        elementHeight = $menu.height();

        // Check if opening menu would pass the bottom of the page
        if (elementTop  > pageHeight &&
            elementHeight < elementTop) {
            return elementTop - elementHeight - (bannerHeight/2);
        } 
        return elementTop;
    }

    return exposed;
});