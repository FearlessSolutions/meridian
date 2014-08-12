define([
    'text!./modalDisplay.css',
    'text!./modalDisplay.hbs',
    './modalDisplay',
    './modalDisplay-publisher',
    './modalDisplay-subscriber',
    'handlebars'
], function (modalDisplayToolCSS, modalDisplayToolHBS, modalDisplayTool, modalDisplayToolPublisher, modalDisplayToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(modalDisplayToolCSS, 'tool-modalDisplay-component-style');

            var modalDisplayToolTemplate = Handlebars.compile(modalDisplayToolHBS);
            var html = modalDisplayToolTemplate();
            this.html(html);

            modalDisplayToolPublisher.init(this);
            //modalDisplayToolSubscriber.init(this);
            modalDisplayTool.init(this);
        }
    };                
});