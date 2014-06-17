define([
    'text!./download.hbs',
    './download',
    'handlebars'
], function(downloadHBS, download){

    return {
        initialize: function() {

            var downloadTemplate = Handlebars.compile(downloadHBS);
            var html = downloadTemplate();

            this.html(html);

            download.init(this);

        }
    };
});