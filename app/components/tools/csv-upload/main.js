define([
    'text!./csv-upload.css',
    'text!./csv-upload.hbs',
    './csv-upload',
    './csv-upload-publisher',
    './csv-upload-subscriber',
    'handlebars'
], function (csvUploadToolCSS, csvUploadToolHBS, csvUploadTool, csvUploadToolPublisher, csvUploadToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(csvUploadToolCSS, 'tool-csvUpload-component-style');

            var csvUploadToolTemplate = Handlebars.compile(csvUploadToolHBS);
            var html = csvUploadToolTemplate();
            this.html(html);

            csvUploadToolPublisher.init(this);
            csvUploadToolSubscriber.init(this);
            csvUploadTool.init(this);
        }
    };                
});