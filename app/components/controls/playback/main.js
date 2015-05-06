define([
    'text!./playback.hbs',
    './playback',
    './playback-mediator',
    'handlebars'
], function (
    playbackHBS,
    playback, 
    playbackMediator
) {
    return {
        initialize: function() {
            var playbackTemplate = Handlebars.compile(playbackHBS),
                html = playbackTemplate();
            this.html(html);

            playbackMediator.init(this);
            playback.init(this, playbackMediator);
        }
    };

});




