define([
    'text!./export-picker-toggle.hbs',
    './export-picker-toggle',
    './export-picker-toggle-mediator',
    'handlebars'
], function(
    exportpickerHBS, 
    exportPicker, 
    exportPickerMediator,
    Handlebars
){

    return {
        initialize: function() {

            var exportpickerTemplate = Handlebars.compile(exportpickerHBS);
            var html = exportpickerTemplate();
            this.html(html);

            exportPickerMediator.init(this);
            exportPicker.init(this, exportPickerMediator);
        }
    };
});