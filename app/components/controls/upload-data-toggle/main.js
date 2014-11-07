define([
    'text!./data-upload-toggle.hbs',
    './data-upload-toggle',
    './data-upload-toggle-publisher',
    './data-upload-toggle-subscriber',
    'handlebars'
], function (
    toggleHBS,
    toggle,
    togglePublisher,
    toggleSubscriber
){
    return {
        initialize: function() {
            var toggleTemplate = Handlebars.compile(toggleHBS);
            var html = toggleTemplate();
            this.html(html);

            toggle.init(this);
            togglePublisher.init(this);
            toggleSubscriber.init(this);
        }
    };

});