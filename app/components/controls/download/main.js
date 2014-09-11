define([
    'text!./download.hbs',
    './download',
    './download-publisher',
    './download-subscriber',
    'handlebars'
], function(downloadHBS, download, publisher, subscriber){

    return {
        initialize: function() {

            var downloadTemplate = Handlebars.compile(downloadHBS);
            var html = downloadTemplate();

            this.html(html);

            download.init(this);
            publisher.init(this);
            subscriber.init(this);

        }
    };
});