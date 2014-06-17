define([
    './heatmap-toggle-publisher',
    'bootstrap',
    'boostrapMultiselect'
], function (publisher) {

    var context,
        heatmapOn = false,
        $heatConfig,
        $heatConfigDialog,
        $snapshotList,
        MENU_DESIGNATION = 'heatmap-toggle';

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $heatConfig = context.$('#heatConfig');
            $heatConfigDialog = context.$('#heatConfigDialog');
            $snapshotList = context.$('#snapshotList');

            context.sandbox.utils.forever( 'click', '#heatmap', function(event) {
                event.preventDefault();
                context.$('#heatToggle').toggleClass('active');

                if(heatmapOn) {
                    exposed.heatmapOff();
                } else {
                    exposed.heatmapOn();
                }
            });

            $snapshotList.multiselect({
                numberDisplayed: 0,
                buttonWidth: '220px',
                includeSelectAllOption: false
            });

            $heatConfig.on('click', function(event) {
                event.preventDefault();
                
                $snapshotList.find('option').remove().end();

                if(!$heatConfig.hasClass('active')) {
                    openMenu();                
                }else{
                    closeMenu();
                }                
            });

            context.$('.heatmap-form button[type="submit"]').on('click', function(event) {
                event.preventDefault();
                var layers = context.$('.multiselect').val();
                exposed.configHeatmapLayers({'layers': layers});
                $heatConfig.removeClass('active');
                $heatConfigDialog.dialog('hide');
            });

            context.$('.heatmap-form button[type="cancel"]').on('click', function(event) {
                event.preventDefault();
                $heatConfig.removeClass('active');
                $heatConfigDialog.dialog('hide');
            });
        },
        heatmapOn: function() {            
            publisher.heatmapOn();
            heatmapOn = true;
        },
        heatmapOff: function() {
            publisher.heatmapOff();
            heatmapOn = false;
        },
        configHeatmapLayers: function(args) {
            publisher.configHeatmapLayers(args);
        },
        handleMenuOpening: function(args){
            if(args.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                closeMenu();
            }
        }
    };

    function closeMenu(){
        $heatConfig.removeClass('active');
        $heatConfigDialog.dialog('hide'); 
    }

    function openMenu(){
        publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
        if(context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)){
            $snapshotList.multiselect('disable');
        }else{
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                $snapshotList.append('<option value="' + queryId + '">'+ queryId + '</option>'); 
                $snapshotList.multiselect('rebuild');
                    
                if(collections.isHeated){
                    $snapshotList.multiselect('select', queryId);
                }
            });
            
            $snapshotList.multiselect('enable');
        }
        $heatConfig.addClass('active');
        $heatConfigDialog.dialog('show'); 
    }

    return exposed;
});