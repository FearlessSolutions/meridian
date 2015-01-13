define([
    'text!./query.css', 
    'text!./query.hbs',
    './query',
    './query-publisher',
    './query-subscriber',
    'handlebars'
], function (queryToolCSS, queryToolHBS, queryTool, queryToolPublisher, queryToolSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(queryToolCSS, 'tools-query-component-style');

            var queryToolTemplate = Handlebars.compile(queryToolHBS);
            var html = queryToolTemplate({datasources: this.sandbox.datasources});
            this.html(html);

            queryToolPublisher.init(this);
            queryTool.init(this);
            queryToolSubscriber.init(this);
        }
    };
                
});