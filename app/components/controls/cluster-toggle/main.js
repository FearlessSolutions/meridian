
define([
    'text!./cluster-toggle.hbs',
    './cluster-toggle',
    './cluster-toggle-publisher',
    './cluster-toggle-subscriber',
    'handlebars'
], function (clusterToggleHBS,
             clusterToggle, 
             clusterTogglePublisher,
             clusterToggleSubscriber) {
    return {
        initialize: function() {
            var clusterToggleTemplate = Handlebars.compile(clusterToggleHBS),
                html = clusterToggleTemplate();
            this.html(html);

            clusterTogglePublisher.init(this);
            clusterToggle.init(this);
            clusterToggleSubscriber.init(this);
        }
    };

});




