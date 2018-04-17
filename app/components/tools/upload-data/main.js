define([
    'text!./upload-data.css',
    'text!./upload-data.hbs',
    './upload-data',
    './upload-data-mediator',
    'handlebars'
], function (
    uploadDataToolCSS, 
    uploadDataToolHBS, 
    uploadDataTool,  
    uploadDataToolMediator,
    Handlebars
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(uploadDataToolCSS, 'tool-uploadData-component-style');

            var configOptions = this.sandbox.dataServices.upload.configuration,
                uploadDataToolTemplate = Handlebars.compile(uploadDataToolHBS),
                html;

            html = uploadDataToolTemplate({
                classifications: configOptions.classifications,
                filetypes: configOptions.filetypes
            });
            this.html(html);

            uploadDataToolMediator.init(this);
            uploadDataTool.init(this, uploadDataToolMediator);
        }
    };                
});