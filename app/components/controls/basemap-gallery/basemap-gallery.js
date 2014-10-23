define([
    './basemap-gallery-publisher',
    'bootstrap'
], function(publisher) {
    var context,
        dropdownMaxHeight, //In px
        defaultBasemapCSS,
        openBasemapCSS,
        defaultToggleCSS,
        openToggleCSS,
        $basemapGallery,
        $basemap,
        $dropdown,
        $toggle;

    var exposed = {
        init: function(thisContext) {
            var paddingInt;

            context = thisContext;
            $basemapGallery = context.$('#basemap-gallery');
            $basemap = context.$('.basemap');
            $dropdown = context.$('#basemap-selection');
            $toggle = context.$('.dropdown-toggle');

            //Cacluate css
            defaultBasemapCSS = {
                "width": parseInt($dropdown.width(), 10)
            };
            defaultToggleCSS = {
                "padding-right" : parseInt($toggle.css('padding-right').replace('px', ''), 10)
            };             

            //Click event handlers
            $basemap.on('click', function(event) {
                event.preventDefault();
                var newBasemap = context.$(this).attr('data-basemap');
                publisher.changeBasemap({"basemap":newBasemap});
            });
            $dropdown.find('li a').on('click', function() {
                var $this = context.$(this);
                $this.parents('.btn-group').find('.selection').html($this.html())
                    .val($this.html());

                //destroy old tooltip and then add new information of the new value selected.
                $toggle.tooltip('destroy');
                $toggle.tooltip({
                    'title': $this.find('.img-rounded').attr('data-title'),
                    "container": "body",
                    "delay": {
                        "show": 500
                    }
                });
            });

            //On dropdown show or hide, change width
            $basemapGallery.on('show.bs.dropdown', function(){
                adjustCSSVars();
                $basemapGallery.css(openBasemapCSS);
                $toggle.css(openToggleCSS);  
            });
            $basemapGallery.on('hide.bs.dropdown', function(){
                adjustCSSVars();
                $basemapGallery.css(defaultBasemapCSS);
                $toggle.css(defaultToggleCSS);        
            });

            //On window resize, close selector. This solves resizing isses.
            context.sandbox.utils.onWindowResize(function(e) {
                hideBasemapGallery();
            });

            //start tooltips for the values inside the dropdown
            context.$('.img-rounded').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            //Activate bootstrap tooltip for the selected image. 
            //Specify container to make the tooltip appear in one line.
            //FF doesn't like tooltips inside buttons, so the entire button has the tooltip information. 
            $toggle.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            
            //Toggle menu on hover
            $basemapGallery.hover(
                showBasemapGallery, //mouseenter
                hideBasemapGallery //mouseleave
            );

        },
        show: function() {
            $basemapGallery.show();
        },
        hide: function() {
            $basemapGallery.hide();
        }
    };

    /**
    * Calculates and adjusts module variables on height
    */
    function adjustCSSVars() {
        var dropdownHeight,
            pageHeight = context.sandbox.utils.pageHeight();

        //return height to default to find natural height        
        $dropdown.css({
            "height": "",
            "overflow-y": "none"
        });
        dropdownHeight = $dropdown.height();

        //Find dropdownmax height, based on config; handle %
        dropdownMaxHeight = context.sandbox.mapConfiguration.basemapGalleryMaxHeight;
        if(dropdownMaxHeight.match('px')) {
            dropdownMaxHeight = parseInt(dropdownMaxHeight.replace('px', ''), 10);
        } else if(dropdownMaxHeight.match('%')) {
            var dropdownHeightPercent = parseInt(dropdownMaxHeight.replace('%', ''), 10) / 100;
            dropdownMaxHeight = pageHeight * dropdownHeightPercent;
        } else {
            dropdownMaxHeight = dropdownMaxHeight;
            return;
        }

        //If too big, add scroll and adjust vars
        if(dropdownHeight >= dropdownMaxHeight) { 
            var currentBasemapWidth = $basemapGallery.width(),
                dropdownWidth,
                newPaddingInt;

            //Apply scroll and height; this changes its width
            $dropdown.css({
                "overflow-y": "scroll",
                "height": dropdownMaxHeight
            });
            dropdownWidth = $dropdown.width();
            openBasemapCSS = {
                width: dropdownWidth
            };

            newPaddingInt = defaultToggleCSS['padding-right'] + (dropdownWidth - defaultBasemapCSS.width);
            openToggleCSS = {
                "padding-right": newPaddingInt
            };
        } else {
            openBasemapCSS = defaultBasemapCSS;
            openToggleCSS = defaultToggleCSS;
        }
    }

    function hideBasemapGallery(){
        if($basemapGallery.hasClass('open')) {
            $toggle.click();
        }
    }
    function showBasemapGallery(){
        if(!$basemapGallery.hasClass('open')) {
            $toggle.click();
        }
    }

    return exposed;
});
