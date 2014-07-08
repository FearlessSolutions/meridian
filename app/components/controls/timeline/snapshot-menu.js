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
        createMenu: function(args){
            var queryId = args.queryId,
                $currentMenu;

            var snapshotMenuTemplate = Handlebars.compile(snapshotMenuHBS);
            var snapshotMenuHTML = snapshotMenuTemplate({
                "queryId": queryId
            });

            context.$('#timeline').after(snapshotMenuHTML);

            $currentMenu = context.$('#snapshot-' + queryId + '-settings-menu');

            context.$('#snapshot-' + queryId + '-settings').on("click", function (e) {
                var $settingsButton = context.$(this);

                if($currentMenu.css('display') !== 'none') {
                    $currentMenu.css('display', 'none');
                } else {
                    // hide all open snapshot menus
                    context.$('.snapshot-menu').hide();
                    //open menu
                    context.$('#snapshot-' + queryId + '-settings-menu')
                        .data("invokedOn", context.$(e.target))
                        .show()
                        .css({
                            position: "absolute",
                            left: getLeftLocation($settingsButton, $currentMenu),
                            top: getTopLocation($settingsButton, $currentMenu)
                        });
                    
                    //add click listener on menu
                    contextMenuClickHandler('#snapshot-' + queryId + '-settings-menu');
                }
                e.preventDefault();
            });

            // close menu on hover out
            context.$('#snapshot-' + queryId + '-settings-menu').hover(
                function(){return;},
                function(){
                    exposed.hideMenu({"queryId": queryId});
                });
            // set menu item callback control
            context.$('#snapshot-' + queryId + '-settings-menu li a').click(function(){
                exposed.menuCallback({
                    "menuChannel": this.getAttribute('data-channel'),
                    "payload": {"layerId": queryId} // TODO: need to somehow hide/show AOI layers with the corredsponding data layer
                });
            });


        },
        menuCallback: function(args) {
            context.sandbox.emit(args.menuChannel, args.payload);  // dynamically emit publish messages
        },
        showMenu: function(args) {
            context.$('#snapshot-' + args.queryId + '-settings-menu').show();
        },
        hideMenu: function(args) {
            context.$('#snapshot-' + args.queryId + '-settings-menu').hide();
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