
define([
    'text!./support.css',
    'text!./support.hbs',
    './support',
    './support-publisher',
    './support-subscriber',
    'handlebars'
], function (supportToolCSS, supportToolHBS, supportTool, supportPublisher, supportSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(supportToolCSS, 'tools-support-component-style');

            var supportToolTemplate = Handlebars.compile(supportToolHBS);
            var html = supportToolTemplate();
            this.html(html);

            supportPublisher.init(this);
            supportTool.init(this);
            supportSubscriber.init(this);
        }
    };

});
