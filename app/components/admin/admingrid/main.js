define([
    'text!/../../libs/SlickGrid-master/slick.grid.css',
    'text!/../../libs/SlickGrid-master/slick-default-theme.css',
    'text!/../../libs/SlickGrid-master/controls/slick.pager.css',
    'text!./admingrid.css',
    'text!./admingrid.hbs',
    './admingrid',
    './admingrid-mediator',	
    'handlebars'
], function (slickgrid_baseCSS, slickgrid_defaultCSS, slickgrid_pagerCSS, admingridCSS, admingridHBS, admingrid, admingridMediator) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(slickgrid_baseCSS, 'slickgrid_base');
            this.sandbox.utils.addCSS(slickgrid_defaultCSS, 'slickgrid_default');
            this.sandbox.utils.addCSS(slickgrid_pagerCSS, 'slickgrid_pager');
            this.sandbox.utils.addCSS(admingridCSS, 'admin-admingrid-component-style');

            var admingridTemplate = Handlebars.compile(admingridHBS);
            var html = admingridTemplate();

            this.html(html);

            admingrid.init(this);
            admingridMediator.init(this);
        }
    };
                
});