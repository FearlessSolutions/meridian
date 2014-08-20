define([
    'text!./modalDisplay.hbs',
    './modalDisplay',
    './modalDisplay-publisher',
    './modalDisplay-subscriber',
    'handlebars'
], function (modalDisplayToolHBS, modalDisplayTool, modalDisplayToolPublisher, modalDisplayToolSubscriber) {
    return {
        initialize: function() {

            var modalDisplayToolTemplate = Handlebars.compile(modalDisplayToolHBS);
            var html = modalDisplayToolTemplate();
            this.html(html);

            modalDisplayToolPublisher.init(this);
            modalDisplayToolSubscriber.init(this);
            modalDisplayTool.init(this);
        }
    };                
});