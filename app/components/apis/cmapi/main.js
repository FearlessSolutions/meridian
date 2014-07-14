define([
    './view/cmapi-view',
    './overlay/cmapi-overlay',
    './feature/cmapi-feature',
    './status/cmapi-status'
], function(view, overlay, feature, status) {
    var context,
        defaultLayerId = 'cmapi',
        processing = {};

    var exposed = { 
        initialize: function() {
            context = this;
            
            feature.init(context, defaultLayerId, emit);
            overlay.init(context, defaultLayerId, emit);
            status.init(context, defaultLayerId, emit);
            view.init(context);

            context.sandbox.external.onPostMessage(receive);

            processing.feature = feature;
            processing.overlay = overlay;
            processing.status = status;
            processing.view = view;
        }
    };

    return exposed;
    
    function receive(e){
        var channel = e.data.channel,
            category = channel.split('.')[1], //0 is always "map"
            message = e.data.message;
        try{
            if(message !== ''){
                message = JSON.parse(message);
                if(!message.origin){
                    message.origin = 'cmapi';
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
            
                if(!message.origin)
                    message.origin = 'cmapi';*/
            }            
        }catch(parseE){
            console.debug(parseE);
        } //This might not be an actual error?

        if(processing[category]){
            processing[category].receive(channel, message);
        }else{} //Error?
    }

    function emit(channel, message){
        context.sandbox.external.postMessageToParent({
            "channel": channel,
            "message": message
        });
    }

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