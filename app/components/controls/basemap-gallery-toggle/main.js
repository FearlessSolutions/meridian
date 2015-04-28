define([
    'text!./basemap-gallery-toggle.hbs',
    './basemap-gallery-toggle',
    './basemap-gallery-toggle-mediator',
    'handlebars'
], function (
    basemapGalleryToggleHBS,
    basemapGalleryToggle,
    basemapGalleryToggleMediator
){
    return {
        initialize: function() {
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