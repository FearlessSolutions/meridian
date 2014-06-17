define([
	'./datagrid',
    './datagrid-subscriber',
    './datagrid-publisher',
	'text!./datagrid.hbs',
	'text!./datagrid.css',
    'handlebars',
    'jqueryCssWatch'
], function (datagridTool, datagridSubscriber, datagridPublisher, datagridHBS, datagridCSS) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(datagridCSS, 'display-datagrid-component-style');

            var datagridTemplate = Handlebars.compile(datagridHBS);
            var html = datagridTemplate();

            this.html(html);

            // Add CSS Watching to the height of the data grid to trigger CSSWatch tool (picked up in app.js)
            this.$('#datagridContainer').csswatch({
                props: 'height'
            });

            datagridPublisher.init(this);
            datagridTool.init(this);
            datagridSubscriber.init(this);
        }
    };
                
});