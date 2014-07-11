define([
    'bootstrap'
], function () {
    var context,
        countPerQuery = {},
        displayedCount,
        totalCount,
        $displayedBadge,
        $totalBadge;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            totalCount = 0;
            displayedCount = 0;
            $displayedBadge = context.$('#stats-displayed-features.badge');
            $totalBadge = context.$('#stats-total-features.badge');
        },
        update: function() {
            totalCount = 0;
            displayedCount = 0;
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
                totalCount += value.length;
                if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible) {
                    displayedCount += value.length;
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