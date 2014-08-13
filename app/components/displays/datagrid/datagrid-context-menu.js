define([
    './datagrid-publisher',
    'text!./datagrid-context-menu.hbs',
    'handlebars'
], function (publisher, datagridContextMenuHBS) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            datagridContextMenuTemplate = Handlebars.compile(datagridContextMenuHBS);
            var datagridContextMenuHTML = datagridContextMenuTemplate({});
            context.$('#datagridContainer').after(datagridContextMenuHTML);

            // close menu on hover out
            context.$('#datagrid-context-menu').hover(
                function(){return;},
                function(){
                    exposed.hideMenu({"layerId": layerId, "featureId": featureId});
                }
            );
            // set menu item callback control
            context.$('#datagrid-context-menu li a').click(function(e){
                e.preventDefault();
                alert("Datagrid Context Menu Item Was Clicked");
            });
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
            var $currentMenu = context.$('#datagrid-context-menu');

            context.$('#datagrid-context-menu')
                .data("invokedOn", params.event.target)
                .show()
                .css({
                    position: "absolute",
                    left: getLeftLocation(params.event, $currentMenu),
                    top: getTopLocation(params.event, $currentMenu)
                });
            context.$('#datagrid-context-menu').show();
        },
        hideMenu: function(params) {
            context.$('#datagrid-' + params.layerId + '-' + params.featureId + '-context-menu').hide();
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