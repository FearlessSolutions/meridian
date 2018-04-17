define([
    'text!./query.css', 
    'text!./query.hbs',
    './query',
    './query-mediator',
    'handlebars'
], function (
    queryToolCSS, 
    queryToolHBS, 
    queryTool, 
    queryToolMediator,
    Handlebars
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(queryToolCSS, 'tools-query-component-style');

            var queryToolTemplate = Handlebars.compile(queryToolHBS);
            var html = queryToolTemplate({datasources: this.sandbox.datasources});
            this.html(html);

            queryToolMediator.init(this);
            queryTool.init(this, queryToolMediator);
        }
    };
                
});