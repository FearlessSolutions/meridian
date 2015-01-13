define([
	'./datagrid',
    './datagrid-subscriber',
    './datagrid-publisher',
	'text!./datagrid.hbs',
	'text!./datagrid.css',
    'handlebars',
    'jqueryCssWatch'
], function (component, subscriber, publisher, componentHBS, componentCSS) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(componentCSS, 'display-datagrid-component-style');

            var datagridTemplate = Handlebars.compile(componentHBS);
            var html = datagridTemplate();

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