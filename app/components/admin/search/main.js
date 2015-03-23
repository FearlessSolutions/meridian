define([
    'text!./search.css', 
    'text!./search.hbs',
    './search',
    './search-publisher',
    './search-subscriber',
    'handlebars'
], function (searchToolCSS, searchToolHBS, searchTool, searchToolPublisher, searchToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(searchToolCSS, 'tool-search-component-style');

            var searchToolTemplate = Handlebars.compile(searchToolHBS);
            var html = searchToolTemplate();
            this.html(html);
                    
            searchTool.init(this);
            searchToolPublisher.init(this);   
            searchToolSubscriber.init(this);
        }
    };                
});