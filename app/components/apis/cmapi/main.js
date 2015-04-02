/**
 * Points the parent channels to the correct function.
 * Uses the CMAPI category
 */
define([
    './basemap/cmapi-basemap',
    './view/cmapi-view',
    './overlay/cmapi-overlay',
    './feature/cmapi-feature',
    './status/cmapi-status',
    './clear/cmapi-clear',
    './cmapi-subscriber',
    'togeojson'
], function(basemap, view, overlay, feature, status, clear, subscriber) {
    var context,
        processing = {};

    var exposed = {
        /**
         * Starts up all the sub-modules and adds the postMessage callback
         */
        initialize: function() {
            context = this;
            
            basemap.init(context, sendError, emit);
            feature.init(context, sendError, emit);
            overlay.init(context, sendError, emit);
            status.init(context, sendError, emit);
            view.init(context, sendError);
            clear.init(context, sendError);

            subscriber.init(context);

            context.sandbox.external.onPostMessage(receive);

            processing.basemap = basemap;
            processing.feature = feature;
            processing.overlay = overlay;
            processing.status = status;
            processing.view = view;
            processing.clear = clear;
        }
    };

    /**
     * Takes in the message and tries to parse it.
     * Passes that message to the correct module
     * @param e
     */
    function receive(e) {
        var channel = e.data.channel,
            category,
            message;

        if(channel && typeof channel === 'string') {
            category = channel.split('.')[1]; //0 is always "messageap"
            message = e.data.message;

            //Check to see if we are the origin (we sent it, so it is already a JSON object)
            if(!message || message.widgetName === context.sandbox.systemConfiguration.appName){
                return;
            }

            try {
                if(message !== '') {
                    if(typeof message === 'string'){
                        message = JSON.parse(message);
                    }
                    if(!message.origin) {
                        message.origin = context.sandbox.cmapi.defaultLayerId;
                    }

                    if(!message.format || message.format === 'kml'){ 
                        try{
                            //need to convert kml features of payload to geojson
                            var domParser=new DOMParser(); //putting KML in DOM for proper parsing by togeojson
                            var kmlDoc=domParser.parseFromString(message.feature,"text/xml");
                            message.feature = toGeoJSON.kml(kmlDoc);
                        }catch(){
                            console.debug(parseKMLerror);
                            sendError(channel, message, 'Failure parsing geoJSON message');
                        }
                    }
                }            
            }catch(parseJSONError) {
                console.debug(parseJSONError);
                sendError(channel, message, 'Failure parsing geoJSON message');
            }            
            if(processing[category]) {
                processing[category].receive(channel, message);
            } else {
                sendError(channel, message, 'Failure processing message - channel does not exsist');
            }
        }
    }

    /**
     * Sends messages back to the parent
     * @param channel - Channel to send the message on
     * @param message
     */
    function emit(channel, message) {
        context.sandbox.external.postMessageToParent({
            "channel": channel,
            "message": message
        });
    }

    /**
     * Help function to send errors to the parent
     * @param message
     */
    function sendError(failedChannel, msg, err) {
        var payload = {
            "sender": context.sandbox.systemConfiguration.appName,
            "type": failedChannel,
            "msg": msg,
            "error": err
        };
        emit('map.error', payload);
    }

    return exposed;
});