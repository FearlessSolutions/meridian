define([
    'text!./download.hbs',
    'text!./download.css',
    './download',
    './download-publisher',
    './download-subscriber',
    'handlebars'
], function(downloadHBS, downloadCSS, download, publisher, subscriber){

    return {
        initialize: function() {

            this.sandbox.utils.addCSS(downloadCSS, 'controls-download-component-style');

            var downloadTemplate = Handlebars.compile(downloadHBS);
            var html = downloadTemplate();

            this.html(html);

            download.init(this);
            publisher.init(this);
            subscriber.init(this);

        }
    };
});