define([
    'text!./legend-image.hbs',
    'text!./legend-table.hbs',
    'handlebars',
    'jqueryUI',
    'jqueryDrag'
], function (imageHBS, tableHBS) {
    var context,
        imageTemplate,
        tableTemplate,
        $legend,
        $body;
    var EMPTY_BODY_HTML = '<div class="empty-body"><i>Empty</i></div>';


	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            imageTemplate = Handlebars.compile(imageHBS);
            tableTemplate = Handlebars.compile(tableHBS);
            $body = context.$('#legend-content');
            $legend = context.$('#legend');

            $body.html(EMPTY_BODY_HTML);
            $legend.draggable({
                "addClasses": false,
                "appendTo": "body",
                "cursor": "move",
                "cursorAt":{ //Keep the div centered on the mouse
                    "top": 70,
                    "left": 150
                },
                //"handle": ".title" //TODO Use this to only allow dragging from the title
                "containment": "document"
            });

            context.$('button.close').on('click', function(){
                exposed.hide();
            });

            exposed.update({
                "image": "/extensions/legend-extension/images/legend.png"
            })
        },
        update: function(params){

            if(params.image){
                var html = imageTemplate({
                    "image": context.sandbox.legend.getIconForLegend(params.image)
                });
                $body.html(html);
            }else{
                var html = tableTemplate(params);
                $body.html(html);
            }
        },
        hide: function(){
            $legend.hide();
        },
        show: function(){
            $legend.show();
        },
        clear: function(){
            $body.html(EMPTY_BODY_HTML);
        }
    };

    return exposed;
});