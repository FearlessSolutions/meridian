define([

], function() {
    /**
     * @namespace Sandbox.supportConfiguration
     * @memberof Sandbox
     *
     * @property {Array}  components               - Each object contains the information needed for the support component (bootstro) to work.
     * @property {String} components.componentName - Id of the HTML element used to find the component in the HTML.
     * @property {String} components.placement     - Location relative to the component that bootstro will use to show its display.
     * @property {String} components.width         - Width of the bootstro display.
     * @property {String} components.title         - Title of the bootstro display.
     * @property {String} components.content       - Information/content that the user will see in the bootstro display.
     */
    var supportConfiguration = {

        //For each component, please specify:
        //  componentName: Id of html tag that will hold the bootstro information.
        //  step: Order that the bootstro will use to show the steps. Please make sure to start at 0 and not repeat any numbers.
        //  placement: Location relative to the component that bootstro will use to show its display.
        //  width: Width of the bootstro display.
        //  title: Title of the bootstro display.
        //  content: Information that the user will see in the bootstro display.

        "components" : [
            {
                "componentName" : "locator input",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Location Tool",
                "content" : "Find any geographic location by entering its name or set of coordinates. Users are instantly panned and zoomed to that location."
            },
            {
                "componentName" : "cluster-toggle-btn",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Cluster Toggle",
                "content" : "Change data being plotted on the map to appear as clustered features."
            },
            {
                "componentName" : "feature-toggle-btn",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Individual Feature Toggle",
                "content" : "Change data being plotted on the map to appear as a individual features."
            },
            {
                "componentName" : "heatmap-toggle-btn",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Heat Map Toggle",
                "content" : "Change data being plotted on the map to appear as a heat map."
            },
            {
                "componentName" : "zoom",
                "placement" : "right",
                "width" : "250px",
                "title": "Map Controls",
                "content" : "Make the Map zoom in and out."
            },
            {
                "componentName" : "queryToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Query Tool",
                "content" : "Query a series of data stores of your choice and have the data plotted on the map."
            },
            {
                "componentName" : "dataGridToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Data Grid Toggle",
                "content" : "Opens a data grid with the data shown on the map."
            },
            {
                "componentName" : "legendToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Map Legend Toggle",
                "content" : "Opens a legend for the layers shown on the map."
            },
            {
                "componentName" : "clear-toggle",
                "placement" : "right",
                "width" : "250px",
                "title": "Clear All Data",
                "content" : "Removes all data found in the map."
            },
            {
                "componentName" : "playback",
                "placement" : "right",
                "width" : "250px",
                "title": "Data Layer Slideshow",
                "content" : "Slideshow of query snapshots currently in the timeline."
            },
            {
                "componentName" : "dataHistoryToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Data History",
                "content" : "List of cached datasets that can be restored."
            },
            {
                componentName : 'dataUploadToggleButton',
                placement : 'right',
                width : '250px',
                title: 'Upload Data',
                content : 'Upload CSV, KML, or geoJSON files to the map.'
            },
            {
                "componentName" : "downloadButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Download Data",
                "content" : "Download all data found in the map in CSV format."
            },
            {
                "componentName" : "basemapGalleryToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Basemap Gallery Toggle",
                "content" : "Toggle the visibility of the Basemap Gallery tool."
            },
            {
                "componentName" : "timelineToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Timeline Toggle",
                "content" : "Toggle the visibility of the Timeline tool."
            },
            {
                "componentName" : "internalPubsubTesterToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Internal Pub/Sub Tester",
                "content" : "Test internal messages being sent."
            },
            {
                "componentName" : "userSettingsToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "User Setting Options",
                "content" : "Configurable settings available to the user. Settings are applied when the application loads. To make them take effect, re-load the webpage."
            },
            {
                "componentName" : "supportToggleButton",
                "placement" : "right",
                "width" : "250px",
                "title": "Support/Help",
                "content" : "Get support for using the application."
            },
            // {
            //     "componentName" : "basemap-gallery",
            //     "placement" : "top",
            //     "width" : "250px",
            //     "title": "Context of your Map",
            //     "content" : "Select from a series of base maps that meet your analytic, reporting and display needs."
            // },
            // {
            //     "componentName" : "timeline",
            //     "placement" : "top",
            //     "width" : "250px",
            //     "title": "Timeline Tool",
            //     "content" : "Display information and and provide control over individual data layers."
            // },
            {
                "componentName" : "coordinates",
                "placement" : "top",
                "width" : "250px",
                "title": "Mouse Coordinates",
                "content" : "It shows the current Lat,Lon position of the mouse."
            },
            {
                "componentName" : "feature-count",
                "placement" : "top",
                "width" : "250px",
                "title": "Feature Counts",
                "content" : "Accurate counts will always be kept of both visible and total feature counts."
            }



        ]
    };

    return supportConfiguration;

});