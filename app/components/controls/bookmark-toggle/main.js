define([
    'text!./bookmark-toggle.hbs',
    './bookmark-toggle',
    './bookmark-toggle-mediator',
    'handlebars'
], function (
    bookmarkToggleHBS,
    bookmarkToggle,
    bookmarkToggleMediator
){
    return {
        initialize: function() {
            var bookmarkToggleTemplate = Handlebars.compile(bookmarkToggleHBS);
            var html = bookmarkToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            bookmarkToggleMediator.init(this);
            bookmarkToggle.init(this, bookmarkToggleMediator);
        }
    };

});