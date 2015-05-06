define([
    'text!./bookmark.css',
    'text!./bookmark.hbs',
    './bookmark',
    './bookmark-mediator',
    'handlebars'
], function (
    bookmarkToolCSS,
    bookmarkToolHBS,
    bookmarkTool,
    bookmarkMediator
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(bookmarkToolCSS, 'tools-bookmark-component-style');

            var bookmarkToolTemplate = Handlebars.compile(bookmarkToolHBS);
            var html = bookmarkToolTemplate();

            this.html(html);

            bookmarkMediator.init(this);
            bookmarkTool.init(this, bookmarkMediator);
        }
    };

});
