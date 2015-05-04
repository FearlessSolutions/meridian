/**
 * This file can be run to combine and minify our js code.
 * It takes everything in ../app (the usual app folder) and copies it to a new directory, ../app-built.
 * For each module defined in modules:[...], it will also combine all of the files into the main.js file for the folder.
 * Any new component will need to be added here to minify it. Not adding one will not break anything, but will not
 * help with loading speed.
 * NOTE that all extensions are skipped because they are not as uniformly named, and it would be a lot of work for little
 * benefit to add them.
 * NOTE that the rendering engine component has been skipped because it was too complicated, and was not minifying correctly.
 */

({
    //To run: node node_modules/grunt-contrib-requirejs/node_modules/requirejs/bin/r.js -o ./app/app.build.js

    mainConfigFile: "app.js",
    baseUrl: "../app",
    dir: "../app-built",
    inlineText: true, //TODO try this on with a modules with text

    onBuildWrite: function(moduleName, path, contents){
        if(moduleName.match(/^components\//)
            && !moduleName.match(/openlayers/)){

            //Fix module name; Default one has no name.
            if(moduleName.match(/main$/)){
                 contents = contents.replace("'" + moduleName + "',", '');
            } else {
                contents = contents.replace(moduleName, function(){
                    return moduleName.split('/').pop(); //Return last element of the module
                });
            }

            // Convert dependencies
            contents = contents.replace(/define[\s\S]*\],\s?function\s?\(/m, function(matched){
                var header = matched.match(/^define\(.*\[/m),
                    footer = matched.match(/\],\s*?function\s?\(/m),
                    dependencies;

                if(header && footer){
                    header = header[0];
                    footer = footer[0];

                    matched = matched.replace(header, '').replace(footer, ''); //Clean up
                    dependencies = matched.match(/'.*'/g); //Get dependencies
                    if(dependencies === null || dependencies.length === 0){
                        return header + matched + footer;
                    }else{
                        dependencies.forEach(function(dependency, dependencyIndex){
                            if(dependency.match(/^'\.\//g)){
                                dependencies[dependencyIndex] = '\'' + dependency.split('/').pop(); //It will already have the '
                            }else if(dependency.match(/^'text!\.\//g)){ //Text modules cannot be modified, so use the full module path
                                var baseModule = moduleName.split('/');
                                baseModule.pop(); //Modify in place; Returns popped element, so don't save it.

                                dependencies[dependencyIndex] = '\'text!'
                                    + baseModule.join('/')
                                    + '/'
                                    + dependency.split('/').pop(); //It will already have the '

                            }//else, it's fine
                        });
                        return header + dependencies.join(',') + footer;
                    }
                }else{
                    return matched; //It wasn't a normal module, so ignore it
                }
            });
        }

        return contents;
    },
    // Define the modules to compile.
    modules: [
        {
            name: "app",

            // Explicitly include modules that are NOT required
            // directly by the MAIN module. This allows us to include
            // commonly used modules that we want to front-load.
            include: [
                "text",
                "handlebars",
                "bootstrap",
                "jquery"
            ],
            excludeShallow: []
        },
        //Admin
        { name: "components/admin/admingrid/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/admin/search/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        //apis
        { name: "components/apis/cmapi/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        //controls
        { name: "components/controls/basemap-gallery/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/basemap-gallery-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/bookmark-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/clear-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/cluster-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/data-history-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/datagrid-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/draw-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/export-picker-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/internal-pubsub-tester/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/internal-pubsub-tester-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/legend-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/playback/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/query-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/support-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/timeline/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/timeline-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/upload-data-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/user-settings/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/user-settings-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/visual-mode-toggle/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/controls/zoom/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        //data-services
        { name: "components/data-services/fake/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/data-services/mock/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        //displays
        { name: "components/displays/clear/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/datagrid/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/event-counter/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/label/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/legend/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/mouse-position/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/notification-modal/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/notifications/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/progress-notification/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/splash-screen/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/displays/user-info/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        //rendering-engines
//        { name: "components/rendering-engines/map-openlayers/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] }, //This causes problems.
        //tools
        { name: "components/tools/bookmark/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/data-history/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/draw/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/export-picker/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/locator/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/query/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/support/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] },
        { name: "components/tools/upload-data/main", excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery'] }

    ],

    // Turn off UglifyJS so that we can view the compiled source
    // files (in order to make sure that we know that the compile
    // is working properly - for debugging only.)
    optimize: "uglify2", //uglify2 seems to be better than uglify
    skipDirOptimize: true //Only minify modules defined, not everything. Leaves out libs and rendering engine

})