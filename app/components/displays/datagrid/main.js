define([
	'text!../../../libs/SlickGrid-master/slick.grid.css',
    'text!../../../libs/SlickGrid-master/slick-default-theme.css',
    'text!../../../libs/SlickGrid-master/controls/slick.pager.css',
    'text!./datagrid.css',
    'text!./datagrid.hbs',
    './datagrid',
    './datagrid-subscriber',
    './datagrid-publisher',
    'handlebars',
    'jqueryCssWatch'
], function (slickgrid_baseCSS, slickgrid_defaultCSS, slickgrid_pagerCSS, componentCSS, componentHBS, component, subscriber, publisher) {

    return {
        initialize: function() {
            var datagridTemplate = Handlebars.compile(componentHBS),
                html = datagridTemplate();

            this.sandbox.utils.addCSS(slickgrid_baseCSS, 'slickgrid_base');
            this.sandbox.utils.addCSS(slickgrid_defaultCSS, 'slickgrid_default');
            this.sandbox.utils.addCSS(slickgrid_pagerCSS, 'slickgrid_pager');
            this.sandbox.utils.addCSS(componentCSS, 'display-datagrid-component-style');

            this.html(html);

            // Add CSS Watching to the height of the data grid to trigger CSSWatch tool (picked up in app.js)
            this.$('#datagridContainer').csswatch({
                props: 'height'
            });

            publisher.init(this);
            component.init(this);
            subscriber.init(this);
        }
    };
                
});