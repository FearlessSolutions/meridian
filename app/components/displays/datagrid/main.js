define([
	'text!slickLib/slick.grid.css',
    'text!slickLib/slick-default-theme.css',
    'text!slickLib/controls/slick.pager.css',
    'text!./datagrid.css',
    'text!./datagrid.hbs',
    './datagrid',
    './datagrid-mediator',
    'handlebars',
    'jqueryCssWatch'
], function (
    slickgrid_baseCSS, 
    slickgrid_defaultCSS, 
    slickgrid_pagerCSS, 
    datagridCSS, 
    datagridHBS, 
    datagrid, 
    datagridMediator
){

    return {
        initialize: function() {
            var datagridTemplate = Handlebars.compile(datagridHBS),
                html = datagridTemplate();

            this.sandbox.utils.addCSS(slickgrid_baseCSS, 'slickgrid_base');
            this.sandbox.utils.addCSS(slickgrid_defaultCSS, 'slickgrid_default');
            this.sandbox.utils.addCSS(slickgrid_pagerCSS, 'slickgrid_pager');
            this.sandbox.utils.addCSS(datagridCSS, 'display-datagrid-component-style');

            this.html(html);

            // Add CSS Watching to the height of the data grid to trigger CSSWatch tool (picked up in app.js)
            this.$('#datagridContainer').csswatch({
                props: 'height'
            });

            datagridMediator.init(this);
            datagrid.init(this, datagridMediator);
        }
    };
                
});