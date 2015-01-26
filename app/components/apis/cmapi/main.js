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
    'togeojson',
], function(basemap, view, overlay, feature, status, clear) {
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
            
            sendError(channel, message, 'Channel not supported');
            try {
                if(message !== '') {
                    message = JSON.parse(message);
                    if(!message.origin) {
                        message.origin = context.sandbox.cmapi.defaultLayerId;
                    }
                }            
            }catch(parseJSONError) {
                console.debug(parseJSONError);
                sendError(channel, message, 'Failure parsing geoJSON message');
                try{
                    //parsing KML message
                    var domParser=new DOMParser(); //putting KML in DOM for proper parsing by togeojson
                    kmlDoc=parser.parseFromString(message,"text/xml");
                    message = toGeoJSON.kml(kmlDoc);

                    if(message !== '') {
                        if(!message.origin) {
                            message.origin = context.sandbox.cmapi.defaultLayerId;
                        }
                    }
                }catch(parseKMLError){
                    console.debug(parseKMLError);
                    sendError(channel, message, 'Failure parsing KML message');
                }
            }

            if(processing[category]) {
                processing[category].receive(channel, message);

                //need to think about how to distinguish between core API and extensions
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

    /* //TODO this is for KML; not using right now; might use in the future?
    function parseXMLString(text){//TODO move to Utils?
        if (window.DOMParser){
            var parser = new DOMParser();
            return parser.parseFromString(text, 'text/xml');
        }
        else{ // Internet Explorer
            var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            return xmlDoc.loadXML(text); 
        }
    }*/
});