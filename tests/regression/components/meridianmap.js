casper.test.begin("Exist Tests", 68, function suite(test) {
    casper.start("http://localhost:9032", function() {
    	// Test Page Tile
        test.assertTitle("Meridian Map", "Meridian homepage title is the one expected");   
          
    

        // Test Component Exists
        test.assertExists('div[data-aura-component="displays/splash-screen"]', "Splash screen component div is expected");
        test.assertExists('div[data-aura-component="data-services/mock"]', "Data services mock component div is expected");
        test.assertExists('div[data-aura-component="displays/notifications"]', "Display notification component div is expected");
        test.assertExists('div[data-aura-component="rendering-engines/map-openlayers"]', "Map openlayers component div is expected");
        test.assertExists('div[data-aura-component="controls/basemap-gallery"]', "Basemap gallery component div is expected");
        test.assertExists('div[data-aura-component="controls/timeline"]', "Timeline component div is expected");
        test.assertExists('div[data-aura-component="displays/datagrid"]', "Datagrid component div is expected");
        test.assertExists('div[data-aura-component="controls/user-settings"]', "User Settings component div is expected");

        // Test Nav Exists
        // # is id  
        // . is class
        test.assertExists('#header-nav', "header nav div is expected");
        test.assertExists('#header-nav .row #header-nave-tools div[data-aura-component="tools/query"]', "Query tool component div is inside header nav, as expected");
        test.assertExists('#header-nav .row #header-nave-tools div[data-aura-component="tools/support"]', "Support tool component div is inside header nav, as expected");
        test.assertExists('#header-nav .row #header-nave-tools div[data-aura-component="controls/heatmap-toggle"]', "Heatmap toggle component div is inside header nav, as expected");
        test.assertExists('#header-nav .row #header-nave-tools div[data-aura-component="tools/query"]', "Query tool component div is inside header nav, as expected");
        test.assertExists('#header-nav .row #header-nave-tools div[data-aura-component="controls/user-settings"]', "User Setting component div is inside header nav, as expected");
        test.assertExists('#header-nav .row div[data-aura-component="tools/locator"]', "Locator tool component div is inside header nav, as expected");
        test.assertExists('#header-nav .row div[data-aura-component="displays/event-counter"]', "Event counter tool component div is inside header nav, as expected");
        test.assertExists('#header-nav div[data-aura-component="controls/zoom"]', "Zoom control component div is inside header nav, as expected");
        test.assertExists('#header-nav div[data-aura-component="controls/heatmap-toggle"]', "Heatmap toggle is inside header nav, as expected");
        test.assertExists('#header-nav div[data-aura-component="controls/datagrid-toggle"]', "Data grid toggle is inside header nav, as expected");
        test.assertExists('#header-nav div[data-aura-component="controls/clear"]', "Clear button is inside header nav, as expected");


        //Test Components inside Aura div event counter
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="displays/event-counter"] #feature-count .panel-body #stats-displayed-features', "Stats are displayed in the feature count inside of event counter component div is expected");
            test.assertExists('div[data-aura-component="displays/event-counter"] #feature-count .panel-body #stats-displayed-features.badge', "Stats are displayed in feature count with a badge in event counter component div is expected");
            test.assertExists('div[data-aura-component="displays/event-counter"] #feature-count .panel-body #stats-total-features', "Total stats displayed in the feature count displays inside of event counter component div is expected");
            test.assertExists('div[data-aura-component="displays/event-counter"] #feature-count .panel-body #stats-total-features.badge', "Total feature stats displayed in feature count with badge inside of event counter component div is expected");
        });

        //Test Components inside aura div locator tool
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="tools/locator"] #locator', "Input group button is displayed in the locator tool is expected");
            test.assertExists('div[data-aura-component="tools/locator"] #locator .form-control', "Form is displayed in the locator tool is expected");
            test.assertExists('div[data-aura-component="tools/locator"] #locator .input-group-btn', "Form is displayed in the locator tool is expected");
            test.assertExists('div[data-aura-component="tools/locator"] #locator .input-group-btn .btn.btn-default-text', "Form is displayed in the locator tool is expected");
            test.assertExists('div[data-aura-component="tools/locator"] #locator .input-group-btn .btn.btn-default-text .glyphicon.glyphicon-chevron-right', "Form is displayed in the locator tool is expected");
        });  

        //Test Components inside aura div controls user settings
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettings', "User Settings button displays is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] .glyphicon.glyphicon-user', "glyphicon displays in User Settings is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettingsDialog', "User Settings Dialog displays in User Settings is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettingsDialog .dialog-dialog', "User Settings Dialog displays in User Settings is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettingsDialog .dialog-dialog .dialog-content', "User Settings Dialog content displays in User Settings is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettingsDialog .dialog-dialog .dialog-content .dialog-header', "User Settings Dialog content header displays in User Settings is expected");
            test.assertExists('div[data-aura-component="controls/user-settings"] #userSettingsDialog .dialog-dialog .dialog-content .dialog-body', "User Settings Dialog content body displays in User Settings is expected");
        });  

        //Test Components inside aura div query tool
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="tools/query"] #Query', "Query tool button displays is expected");
            test.assertExists('div[data-aura-component="tools/query"] #QueryDialog.dialog', "Query form displays in Query Tool is expected");
        }); 

        //Test Components inside aura div support tool
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="tools/support"] #support', "Support tool button displays is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog.dialog', "Support Dialog box displays under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-content', "Dialog Content displays in support dialog box under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-body', "Dialog body displays in support dialog box under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-body .btn.btn-default-text', "Dialog body displays Wiki Button in support dialog box under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-body #tour.btn.btn-default-text', "Dialog body displays in support dialog box under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-header', "Dialog Header displays in support dialog box under Support Tool is expected");
            test.assertExists('div[data-aura-component="tools/support"] #SupportDialog .dialog-header .close', "Dialog Header close button displays in support dialog header box under Support Tool is expected");
        });

        //Test Components inside aura div heatmap tool
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap', "Heatmap display is expected");
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap .glyphicon.glyphicon-fire', "Heatmap displays fire on button is expected");
        });

        //Test Components inside aura div heat map toggle
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap', "Heatmap toggle button is displayed in data grid is expected");
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap #heatToggle.btn.btn-default-icon', "Heatmap toggle button displays is expected AGAIN");
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap #heatToggle.btn.btn-default-icon .glyphicon.glyphicon-fire', "Heatmap toggle button displays fire icon is expected");
            test.assertExists('div[data-aura-component="controls/heatmap-toggle"] #heatmap #heatConfig.btn.btn-default-icon.dropdown-toggle', "Heatmap configuration button displays dropdown caret is expected");
        }); 

        //Test Components inside aura div - data grid toggle
        // # is id  
        // . is class
        this.wait(3000, function() {
           test.assertExists('div[data-aura-component="controls/datagrid-toggle"] #dataGridToggleButton', "Datagrid toggle button is displayed in data grid is expected");
           test.assertExists('div[data-aura-component="controls/datagrid-toggle"] #dataGridToggleButton.btn.btn-default-icon.bootstro', "Datagrid toggle button displays a tooltip is expected");
           test.assertExists('div[data-aura-component="controls/datagrid-toggle"] #dataGridToggleButton.btn.btn-default-icon.bootstro .glyphicon.glyphicon-th-list', "Datagrid toggle button displays list icon is expected");
            
        }); 

        //Test Components inside aura div - clear control 
        //# is id
        //. is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/clear"] #clear.btn.btn-default-icon.bootstro', "Clear button is displayed as a button, is expected");
            test.assertExists('div[data-aura-component="controls/clear"] #clear.btn.btn-default-icon.bootstro .glyphicon.glyphicon-eye-close', "Clear button displays a closed eye icon on button, is expected");
        });

        //Test Components inside aura div basemap gallery
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/basemap-gallery"] #basemap.btn-group.dropup.bootstro', "Basemap drop up displays in basemap tool is expected");
            test.assertExists('div[data-aura-component="controls/basemap-gallery"] #basemap .btn.btn-default.btn-lg.dropdown-toggle', "Basemap drop down/collapse displays in basemap tool is expected");
            test.assertExists('div[data-aura-component="controls/basemap-gallery"] #basemap .dropdown-menu#basemap-selection', "Basemap drop down/selection displays in basemap tool is expected");
            test.assertExists('div[data-aura-component="controls/basemap-gallery"] #basemap .dropdown-menu#basemap-selection .basemap', "Basemap drop down/selection displays in landscape, grey, basic and imagery in basemap tool is expected");
        });

        //Test Components inside aura div zoom control
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/zoom"] .btn-group-vertical.bootstro#zoom', "Zoom controls display vertical is expected");
            test.assertExists('div[data-aura-component="controls/zoom"] .btn-group-vertical.bootstro#zoom .btn.btn-default-text.btn-xs.zoom-in', "Zoom In tooltip displays during hover over in zoom controls is expected");
            test.assertExists('div[data-aura-component="controls/zoom"] .btn-group-vertical.bootstro#zoom .btn.btn-default-text.btn-xs.zoom-in .glyphicon.glyphicon-plus', "Zoom In displays as a plus icon under zoom controls is expected");
            test.assertExists('div[data-aura-component="controls/zoom"] .btn-group-vertical.bootstro#zoom .btn.btn-default-text.btn-xs.zoom-out .glyphicon.glyphicon-minus', "Zoom Out displays as a minus icon under zoom controls is expected");
        });

        

        //Test Components inside aura div timeline
        // # is id  
        // . is class
        this.wait(3000, function() {
            test.assertExists('div[data-aura-component="controls/timeline"] #timeline', "Timeline control displays is expected");
            test.assertExists('div[data-aura-component="controls/timeline"] #timeline #timeline-container', "Timeline displays container of map as expected");        
        });

    });


    // casper.then(function() {
    //     test.assertTitle("casperjs - Test Meridian", "meridian title is ok");
        // test.assertUrlMatch(/q=casperjs/, "search term has been submitted");
        // test.assertEval(function() {
        //     return __utils__.findAll("h3.r").length >= 10;
        // }, "google search for \"casperjs\" retrieves 10 or more results");
    // });
    
    casper.run(function() {
        test.done();
    });
});
