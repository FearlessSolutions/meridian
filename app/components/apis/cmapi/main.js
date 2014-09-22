/**
 * Points the parent channels to the correct function.
 * Uses the CMAPI category
 */
define([
    './view/cmapi-view',
    './overlay/cmapi-overlay',
    './feature/cmapi-feature',
    './status/cmapi-status',
    './clear/cmapi-clear'
], function(view, overlay, feature, status, clear) {
    var context,
        processing = {};

    var exposed = {
        /**
         * Starts up all the sub-modules and adds the postMessage callback
         */
        initialize: function() {
            context = this;
            
            feature.init(context, sendError, emit);
            overlay.init(context, sendError, emit);
            status.init(context, sendError, emit);
            view.init(context, sendError);
            clear.init(context, sendError);

            context.sandbox.external.onPostMessage(receive);

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
            category = channel.split('.')[1]; //0 is always "map"
            message = e.data.message;

            //Check to see if we are the origin (we sent it, so it is already a JSON object)
            if(!message || message.widgetName === context.sandbox.systemConfiguration.appName){
                return;
            }

            try {
                if(message !== '') {
                    message = JSON.parse(message);
                    if(!message.origin) {
                        message.origin = context.sandbox.cmapi.defaultLayerId;
                    }
                    /* //TODO this is for handling kml also; not doing right now
                    var split = message.split('<');
                    if(split.length > 1){                    
                        message = split.shift();
                        var kml = '';

                        while(split.length > 1){
                            kml += '<' + split.shift();
                        }

                        var end = split[0].split('>');
                        kml += '<' + end[0] + '>';
                        message += end[1];

                        message = JSON.parse(message);

                        message.feature = kml;
                        message.format = 'kml';
                    }else{
                        message = JSON.parse(message);    
                    }  
                
                    if(!message.origin){
                        message.origin = 'cmapi';
                    }*/
                }            
            } catch(parseE) {
                console.debug(parseE);
            } //This might not be an actual error?

            if(processing[category]) {
                processing[category].receive(channel, message);
            } else {} //Error?
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