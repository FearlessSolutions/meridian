define([
    'text!./bookmark.css',
    'text!./bookmark.hbs',
    './bookmark',
    './bookmark-publisher',
    './bookmark-subscriber',
    'handlebars'
], function (
    bookmarkToolCSS,
    bookmarkToolHBS,
    bookmarkTool,
    bookmarkPublisher,
    bookmarkSubscriber
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(bookmarkToolCSS, 'tools-bookmark-component-style');

            var bookmarkToolTemplate = Handlebars.compile(bookmarkToolHBS);
            var html = bookmarkToolTemplate();

            this.html(html);

            bookmarkPublisher.init(this);
            bookmarkTool.init(this);
            bookmarkSubscriber.init(this);
        }
    };

});
