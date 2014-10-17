define([
    'text!./basemap-gallery-toggle.css',
    'text!./basemap-gallery-toggle.hbs',
    './basemap-gallery-toggle',
    './basemap-gallery-toggle-publisher',
    './basemap-gallery-toggle-subscriber',
    'handlebars'
], function (
    basemapGalleryToggleCSS,
    basemapGalleryToggleHBS,
    basemapGalleryToggle,
    basemapGalleryTogglePublisher,
    basemapGalleryToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(basemapGalleryToggleCSS, 'controls-basemap-gallery-toggle-component-style');

            var basemapGalleryToggleTemplate = Handlebars.compile(basemapGalleryToggleHBS);
            var html = basemapGalleryToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            basemapGalleryToggle.init(this);
            basemapGalleryTogglePublisher.init(this);
            basemapGalleryToggleSubscriber.init(this);
        }
    };

});