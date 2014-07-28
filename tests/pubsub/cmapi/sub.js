define([
    'jquery'
], function($) {
    var config,
        subChannels = {},
        $selector,
        $subButton,
        $console;

    var exposed = {
        init: function(configIn) {
            config = configIn;
            $selector = $("#sub-channel");
            $subButton = $("#sub-button");
            $console = $("#sub-console");

            for(var channel in config.channels){
                var valid = config.channels[channel].valid,
                    html = "<option value='" + channel +"'";

                if(!valid){
                    html += " class='has-error'";
                    html += " style='background-color: #f2dede;'";
                }
                html += ">" + channel + "</option>";
                $selector.append(html);
            }

            $selector.on("change", function(e){
                updateButtonText($selector.val());
            });
            $selector.change(); //check if starting on error

            $subButton.on("click", function(){
                toggleChannel($selector.val());
            });

            window.addEventListener("message", receiveMessage, false); //TODO: third param?
        },
        receiveMessage: receiveMessage
    };

    return exposed;

    function receiveMessage(event) {
        console.debug("Got message", event);
        if(subChannels[event.data.channel]){
            var html = "<p><b>" + event.data.channel + "</b>: ";
            html += JSON.stringify(event.data.message) + "</p>";
            $console.append(html); 
        }
    }

    function toggleChannel(channel){
        $thisOption = $selector.find("option[value='" + channel +"']");
        if(subChannels[channel]){
            subChannels[channel] = false;
            $thisOption.removeClass("subscribed");
        }else{
            subChannels[channel] = true;
            $thisOption.addClass("subscribed");
        }
        updateButtonText(channel);
    }
    function updateButtonText(channel){
        if(subChannels[channel]){
            $subButton.text("Unsubscribe");
        }else{
            $subButton.text("Subscribe");
        }
    }
});