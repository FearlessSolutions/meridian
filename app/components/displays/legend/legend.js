define([
    'text!./legend-image.hbs',
    'handlebars',
    'bootstrap',
    'jqueryUI'
], function (imageHBS, Handlebars) {
    var context,
        mediator,
        $legend,
        $legendDialogBody,
        imageTemplate,
        EMPTY_BODY_HTML = '<div class="empty-body"><i>No content to be displayed.</i></div>';


	var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;

            $legend = context.$('#legendDialog');
            $legendDialogBody = context.$('#legendDialog .dialog-content .dialog-body').html(EMPTY_BODY_HTML);
            imageTemplate = Handlebars.compile(imageHBS);

            $legend.draggable({
                handle: ".dialog-header"
            });

            $legend.find('.close').on('click', function(e) {
                e.preventDefault();
                mediator.hideLegend();
            });
        },
        update: function(params) {
            if(params.image){
                var html = imageTemplate({
                    "image": params.image
                });
                $legendDialogBody.html(html);
            }
            exposed.show();
        },
        hide: function() {
            $legend.addClass('hide');
        },
        show: function() {
            $legend.removeClass('hide');
        },
        clear: function() {
            exposed.hide();
            $legendDialogBody.html(EMPTY_BODY_HTML);
        }
    };

    return exposed;
});