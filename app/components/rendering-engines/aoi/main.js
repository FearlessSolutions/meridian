define([

    'text!./aoi.hbs',
    './aoi',
    './aoi-mediator',
    'handlebars'

], function (aoiHBS, aoi,
             aoiMediator
) {
    return {
        initialize: function() {

            var aoiTemplate = Handlebars.compile(aoiHBS);
            var html = aoiTemplate();
            this.html(html);

            aoiMediator.init(this);
            aoi.init(this, aoiMediator);
        }
    };                
});