define([
    'text!./basemap-gallery-toggle.css',
    'text!./basemap-gallery-toggle.hbs',
    './basemap-gallery-toggle',
    './basemap-gallery-toggle-mediator',
    'handlebars'
], function (
    basemapGalleryToggleCSS,
    basemapGalleryToggleHBS,
    basemapGalleryToggle,
    basemapGalleryToggleMediator
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(basemapGalleryToggleCSS, 'controls-basemap-gallery-toggle-component-style');

            var basemapGalleryToggleTemplate = Handlebars.compile(basemapGalleryToggleHBS);
            var html = basemapGalleryToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            basemapGalleryToggleMediator.init(this);
            basemapGalleryToggle.init(this,basemapGalleryToggleMediator);
            
        }
    };

});