define([
    'text!./bookmark-toggle.css',
    'text!./bookmark-toggle.hbs',
    './bookmark-toggle',
    './bookmark-toggle-publisher',
    './bookmark-toggle-subscriber',
    'handlebars'
], function (
    bookmarkToggleCSS,
    bookmarkToggleHBS,
    bookmarkToggle,
    bookmarkTogglePublisher,
    bookmarkToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(bookmarkToggleCSS, 'controls-bookmark-toggle-component-style');

            var bookmarkToggleTemplate = Handlebars.compile(bookmarkToggleHBS);
            var html = bookmarkToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            bookmarkToggle.init(this);
            bookmarkTogglePublisher.init(this);
            bookmarkToggleSubscriber.init(this);
        }
    };

});