define([
    'text!./search.css', 
    'text!./search.hbs',
    './search',
    './search-subscriber',
    'handlebars'
], function (searchToolCSS, seachToolHBS, searchTool, searchToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(searchToolCSS, 'tool-search-component-style');

            var searchToolTemplate = Handlebars.compile(searchToolHBS);
            var html = searchToolTemplate();
            this.html(html);

            //searchToolPublisher.init(this);           
            searchTool.init(this);
            searchToolSubscriber.init(this);
        }
    };                
});