define([
    'text!./playback.hbs',
    './playback',
    './playback-publisher',
    './playback-subscriber',
    'handlebars'
], function (playbackHBS,
             playback, 
             playbackPublisher,
             playbackSubscriber
             ) {
    return {
        initialize: function() {
            var playbackTemplate = Handlebars.compile(playbackHBS),
                html = playbackTemplate();
            this.html(html);

            playbackPublisher.init(this);
            playbackSubscriber.init(this);
            playback.init(this);
        }
    };

});




