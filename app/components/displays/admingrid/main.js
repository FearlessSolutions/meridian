define([	
    'text!./admingrid.css',
    'text!./admingrid.hbs',
    './admingrid',
    './admingrid-subscriber',
    './admingrid-publisher',	
    'handlebars'
], function (admingridCSS, admingridHBS, admingrid, admingridPublisher, admingridSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(admingridCSS, 'display-admingrid-component-style');

            var admingridTemplate = Handlebars.compile(admingridHBS);
            var html = admingridTemplate();

            this.html(html);

            admingrid.init(this);
            admingridPublisher.init(this);
            admingridSubscriber.init(this);
        }
    };
                
});