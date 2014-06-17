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
        addPoints: function(args){
            var dataset = context.sandbox.dataStorage.datasets[args.queryId];
            totalCount += args.data.length;
            $totalBadge.html(totalCount);

            if(dataset && dataset.visible){
                displayedCount += args.data.length;
                $displayedBadge.html(displayedCount);
            }
        },
        showLayer: function(args){
            var layer = context.sandbox.dataStorage.datasets[args.layerId];

            if(layer){
                displayedCount += layer.models.length;
                $displayedBadge.html(displayedCount);
            }
        },
        hideLayer: function(args){
            var layer = context.sandbox.dataStorage.datasets[args.layerId];
            if(layer){
                displayedCount -= layer.models.length;
                $displayedBadge.html(displayedCount);                
            }
        },
        hideAll: function(){
            displayedCount = 0;
            $displayedBadge.html(displayedCount);
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