define([

], function() {

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
                "componentName" : "Query",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Query Tool",
                "content" : "Query a series of data stores of your choice and have the data plotted on the map."
            },
            {
                "componentName" : "cluster-toggle-btn",
                "placement" : "bottom",
                "width" : "225px",
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
                "width" : "225px",
                "title": "Heat Map Toggle",
                "content" : "Change data being plotted on the map to appear as a heat map."
            },
            {
                "componentName" : "dataGridToggleButton",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Data Grid Toggle",
                "content" : "Opens a data grid with the data shown on the map."
            },
            {
                "componentName" : "downloadButton",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Download Data",
                "content" : "Download all data found in the map in CSV format."
            },
            {
                "componentName" : "clear-toggle",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Clear All Data",
                "content" : "Removes all data found in the map."
            },
            {
                "componentName" : "support",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Support/Help",
                "content" : "Get support for using the application."
            },
            {
                "componentName" : "internalPubsubTesterToggleButton",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Internal Pub/Sub Tester",
                "content" : "Test internal messages being sent."
            },
            {
                "componentName" : "playback",
                "placement" : "bottom",
                "width" : "225px",
                "title": "Data Layer Slideshow",
                "content" : "Slideshow of query snapshots currently in the timeline."
            },
            {
                "componentName" : "userSettings",
                "placement" : "bottom",
                "width" : "225px",
                "title": "User Setting Options",
                "content" : "Configurable settings available to the user. Settings are applied when the application loads. To make them take effect, re-load the webpage."
            },
            {
                "componentName" : "feature-count",
                "placement" : "bottom",
                "width" : "200px",
                "title": "Feature Counts",
                "content" : "Accurate counts will always be kept of both visible and total feature counts."
            },
            {
                "componentName" : "zoom",
                "placement" : "right",
                "width" : "225px",
                "title": "Map Controls",
                "content" : "Make the Map zoom in and out."
            },
             {
                "componentName" : "coordinates",
                "placement" : "bottom",
                "width" : "250px",
                "title": "Mouse Coordinates",
                "content" : "It shows the current Lat,Lon position of the mouse."
            },
            {
                "componentName" : "basemap-gallery",
                "placement" : "top",
                "width" : "225px",
                "title": "Context of your Map",
                "content" : "Select from a series of base maps that meet your analytic, reporting and display needs."
            }



        ]
    };

    return supportConfiguration;

});