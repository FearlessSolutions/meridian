define([
    'text!./datagrid-toggle.hbs',
    './datagrid-toggle',
    './datagrid-toggle-publisher',
    './datagrid-toggle-subscriber',
    'handlebars'
], function (
    datagridToggleHBS,
    datagridToggle,
    datagridTogglePublisher,
    datagridToggleSubscriber
){
    /**
     * Component that contains the necessary channels and functionality to toggle a datagrid component.
     * @module datagrid-toggle
     */
    return {
        /**
         * Funciton utilized by Meridian to init all components. It loads the template, initializes all 
         * messaging channels in the subscriber and the publisher. It also initializes other files with
         * the functionality of the component.
         * @instance
         * @memberof module:datagrid-toggle
         */
        initialize: function() {
            var datagridToggleTemplate = Handlebars.compile(datagridToggleHBS);
            var html = datagridToggleTemplate();
            this.html(html);

            datagridToggle.init(this);
            datagridTogglePublisher.init(this);
            datagridToggleSubscriber.init(this);
        }
    };

});