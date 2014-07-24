define([
    './timeline-publisher',
    'text!./snapshot-menu.hbs',
    'handlebars'
], function (publisher, snapshotMenuHBS) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createMenu: function(params){
            var layerId = params.layerId,
                $currentMenu,
                snapshotMenuTemplate = Handlebars.compile(snapshotMenuHBS);
            var snapshotMenuHTML = snapshotMenuTemplate({
                "layerId": layerId
            });

            context.$('#timeline').after(snapshotMenuHTML);

            $currentMenu = context.$('#snapshot-' + layerId + '-settings-menu');

            context.$('#snapshot-' + layerId + '-settings').on("click", function (e) {
                var $settingsButton = context.$(this);

                if($currentMenu.css('display') !== 'none') {
                    $currentMenu.css('display', 'none');
                } else {
                    // hide all open snapshot menus
                    context.$('.snapshot-menu').hide();
                    //open menu
                    context.$('#snapshot-' + layerId + '-settings-menu')
                        .data("invokedOn", context.$(e.target))
                        .show()
                        .css({
                            position: "absolute",
                            left: getLeftLocation($settingsButton, $currentMenu),
                            top: getTopLocation($settingsButton, $currentMenu)
                        });
                    
                    //add click listener on menu
                    contextMenuClickHandler('#snapshot-' + layerId + '-settings-menu');
                }
                e.preventDefault();
            });

            // close menu on hover out
            context.$('#snapshot-' + layerId + '-settings-menu').hover(
                function(){return;},
                function(){
                    exposed.hideMenu({"layerId": layerId});
                });
            // set menu item callback control
            context.$('#snapshot-' + layerId + '-settings-menu li a').click(function(){
                exposed.menuCallback({
                    "menuChannel": this.getAttribute('data-channel'),
                    "payload": {
                        "layerId": layerId
                    }
                });
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
            var $option = context.$('#snapshot-' + params.layerId + '-settings-menu a[data-channel="'+ params.channel + '"]').parent('li').addClass('disabled');
        },
        menuCallback: function(params) {
            context.sandbox.emit(params.menuChannel, params.payload);  // dynamically emit publish messages
        },
        showMenu: function(params) {
            context.$('#snapshot-' + params.layerId + '-settings-menu').show();
        },
        hideMenu: function(params) {
            context.$('#snapshot-' + params.layerId + '-settings-menu').hide();
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

    function getLeftLocation($el, $menu) {
        var elementleft,
            pageWidth,
            elementWidth;

        elementleft = $el.offset().left;
        pageWidth = context.sandbox.utils.pageWidth();
        elementWidth = $menu.width();
        
        // opening menu would pass the side of the page
        if (elementleft + elementWidth > pageWidth &&
            elementWidth < elementleft) {
            return elementleft - elementWidth;
        } 
        return elementleft;
    }        
    

    function getTopLocation($el, $menu) {
        var bannerHeight = 0,
            elementTop,
            pageHeight,
            elementHeight;

        // Accounting for height of banners, if they exist (TODO: find a better way)
        context.sandbox.utils.each($('.banner'), function(){ // going outside of scope, not cool... find a better way
            bannerHeight += $(this).height(); // going outside of scope, not cool... find a better way
        });

        elementTop = $el.offset().top;
        pageHeight = context.sandbox.utils.pageHeight('#mapContainer') - bannerHeight;
        elementHeight = $menu.height();

        // Check if opening menu would pass the bottom of the page
        if (elementTop + elementHeight > pageHeight &&
            elementHeight < elementTop) {
            return elementTop - elementHeight - bannerHeight;
        } 
        return elementTop;
    }

    return exposed;
});