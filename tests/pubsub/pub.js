define([
    'jquery'
], function($) {
    var geoMeridian,
        config;

    var exposed = {
        init: function(configIn) {
            config= configIn;            
            geoMeridian = document.getElementById('webapp').contentWindow;

            var pubChannels = config.channels,
                $pubSelector = $("#pub-channel");

            for(var channel in pubChannels){
                var valid = pubChannels[channel].valid;

                var html = "<option value='" + channel + "'";
                if(!valid){
                    html += " class='has-error'";
                    html += " style='background-color: #f2dede;'";
                }
                html += ">" + channel + "</option>";
                $pubSelector.append(html);
            }
            $pubSelector.on("change", function(e){
                var channel = this.selectedOptions[0].value,
                    sample = JSON.stringify(pubChannels[channel].sample) || '';

                if($(this.selectedOptions[0]).hasClass("has-error")){
                    $(this).parent().addClass("has-error");
                }else{
                    $(this).parent().removeClass("has-error");
                }

                $("#pub-message").val(sample);
            });
            $pubSelector.change(); //check if starting on error

            $("#pub-button").on("click", function(){
                var channel = $("#pub-channel").val(),
                    message = $("#pub-message").val();

                sendMessage(channel, message);
            });
        }
    };

    return exposed;




    function sendMessage(channel, message){
        var toSend = {
            channel: channel,
            message: message
        }
        geoMeridian.postMessage(toSend, "http://localhost:9032");
    }
});