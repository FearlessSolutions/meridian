define([
    'bootstrap'
], function () {
    var context,
        mediator,
        countPerQuery = {},
        displayedCount,
        totalCount,
        $displayedBadge,
        $totalBadge;

	var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            totalCount = 0;
            displayedCount = 0;
            $displayedBadge = context.$('#stats-displayed-features');
            $totalBadge = context.$('#stats-total-features');
        },
        update: function() {
            totalCount = 0;
            displayedCount = 0;
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
                var currentLayerHiddenFeaturesCount = 0;
                totalCount += value.length;
                if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible) {
                    currentLayerHiddenFeaturesCount = context.sandbox.stateManager.layers[key].hiddenFeatures.length || 0;
                    displayedCount += value.length - currentLayerHiddenFeaturesCount;
                }
            });
            $displayedBadge.html(displayedCount);
            $totalBadge.html(totalCount);
        },
        clear: function(){
            totalCount = 0;
            displayedCount = 0;
            $totalBadge.html(totalCount);
            $displayedBadge.html(displayedCount);
        }
    };

    return exposed;
});