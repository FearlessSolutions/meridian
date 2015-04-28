define([
    'bootstrap'
], function () {

    var context,
        $playbackButton,
        running = false;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $playbackButton = context.$('#playback');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $playbackButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $playbackButton.on('click', function(event) {
                // if there is more than one layer, handle event
                if(checkLayerCount() > 1) {
                    if(running) {
                        mediator.stopPlayback({"status": "Stopped"});
                    } else {
                        mediator.startPlayback();
                    }
                } else {
                    warnPlaybackDisabled();
                }
            });
        },
        startPlayback: function() {
            // if there is more than one layer, handle event
            if(checkLayerCount() > 1) {
                if(!running) {
                    $playbackButton.find('span').removeClass('glyphicon-play').addClass('glyphicon-stop');
                    mediator.publishMessage({
                        "messageType": "info",
                        "messageTitle": "Timeline",
                        "messageText": "Playback Started"
                    });
                    running = true;
                }
            } else {
                warnPlaybackDisabled();
            }
        },
        stopPlayback: function(params) {
            // if there is more than one layer, handle event
            if(checkLayerCount() > 1) {
                if(running) {
                    $playbackButton.find('span').removeClass('glyphicon-stop').addClass('glyphicon-play');
                    mediator.publishMessage({
                        "messageType": "info",
                        "messageTitle": "Timeline",
                        "messageText": "Playback " + params.status
                    });
                    running = false;
                }
            } else {
                warnPlaybackDisabled();
            }
        }
    };

    function checkLayerCount() {
        if(context.sandbox.stateManager.layers) {
            return _.size(context.sandbox.dataStorage.datasets);
        } else {
            return 0;
        }
    }

    function warnPlaybackDisabled() { 
        mediator.publishMessage({
            "messageType": "warning",
            "messageTitle": "Timeline",
            "messageText": "Playback can't be controlled until you have more than one layer of data"
        });
    }

    return exposed;

});