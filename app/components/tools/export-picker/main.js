define([
    'text!./export-picker.css',
    'text!./export-picker.hbs',
    './export-picker',
    './export-picker-mediator',
    'handlebars'
], function (
    exportPickerCSS,
    exportPickerHBS,
    exportPicker,
    exportPickeMediator,
    Handlebars
) {
    var COMPONENT_NAME = 'tools-export-picker';

    return {
        initialize: function() {
            var template = Handlebars.compile(exportPickerHBS);

            this.sandbox.utils.addCSS(exportPickerCSS, COMPONENT_NAME + '-style');

            this.html(template({exports: this.sandbox.export.options}));

            exportPickeMediator.init(this);
            exportPicker.init(this, exportPickeMediator);
        }
    };

});
