define([
    'text!./internal-pubsub-tester-toggle.hbs',
    './internal-pubsub-tester-toggle',
    './internal-pubsub-tester-toggle-publisher',
    './internal-pubsub-tester-toggle-subscriber',
    'handlebars'
], function (
    internalPubsubTesterToggleHBS,
    internalPubsubTesterToggle,
    internalPubsubTesterTogglePublisher,
    internalPubsubTesterToggleSubscriber,
    Handlebars
){
    return {
        initialize: function() {
            var internalPubsubTesterToggleTemplate = Handlebars.compile(internalPubsubTesterToggleHBS);
            var html = internalPubsubTesterToggleTemplate();
            this.html(html);

            internalPubsubTesterToggle.init(this);
            internalPubsubTesterTogglePublisher.init(this);
            internalPubsubTesterToggleSubscriber.init(this);
        }
    };

});