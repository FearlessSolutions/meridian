define([
    'text!./search.css', 
    'text!./search.hbs',
    './search',
    './search-mediator',
    'handlebars'
], function (searchToolCSS, searchToolHBS, searchTool, searchMediator) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(searchToolCSS, 'tool-search-component-style');

            var searchToolTemplate = Handlebars.compile(searchToolHBS);
            var html = searchToolTemplate();
            this.html(html);
                    
            searchTool.init(this);
            searchMediator.init(this);
        }
    };                
});