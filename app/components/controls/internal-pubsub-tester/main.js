define([
    './internal-pubsub-tester',
    'text!./internal-pubsub-tester.css',
    'text!./internal-pubsub-tester.hbs',
    './internal-pubsub-tester-config',
    'handlebars'
], function (
    internalPubSubTester,
    internalPubSubTesterCss,
    internalPubSubTesterHBS,
    internalPubSubTesterConfig
){
    return {
        initialize: function() {
            var channelList = [],
                channelGroup = [],
                channels = [];

            this.sandbox.utils.addCSS(internalPubSubTesterCss, 'controls-internal-pubsub-tester-component-style');

            var internalPubSubTesterTemplate = Handlebars.compile(internalPubSubTesterHBS);

            // make local copy of grep function for use inside the each function (beacuse 'this' changes scope, relative to the each function)
            var _grep = this.sandbox.utils.grep;
            
            this.sandbox.utils.each(internalPubSubTesterConfig, function(key, value) {
                var prefix = key.split('.')[0];

                // if no channel group for the prefix is found, add one; else put channel in matching channel group
                var currentGroup = _grep(channelList, function(e){ return e. channelGroup === prefix; });
                if(currentGroup.length === 0) {
                    channelList.push({"channelGroup": prefix, "channels": [key]});
                } else {
                    currentGroup[0].channels.push(key);
                    currentGroup[0].channels.sort();
                }

            });

            var html = internalPubSubTesterTemplate({
                "channelList": channelList
            });
            this.html(html);

            internalPubSubTester.init(this);
        }
    };
});


