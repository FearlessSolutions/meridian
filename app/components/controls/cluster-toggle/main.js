
define([
    'text!./cluster-toggle.hbs',
    './cluster-toggle',
    './cluster-toggle-mediator',
    'handlebars'
], function (clusterToggleHBS,
             clusterToggle, 
             clusterToggleMediator) {
    return {
        initialize: function() {
            var clusterToggleTemplate = Handlebars.compile(clusterToggleHBS),
                html = clusterToggleTemplate();
            this.html(html);

            clusterToggleMediator.init(this);
            clusterToggle.init(this, clusterToggleMediator);
        }
    };

});




