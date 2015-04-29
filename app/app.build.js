({
    //To run: node node_modules/grunt-contrib-requirejs/node_modules/requirejs/bin/r.js -o ./app/app.build.js

    mainConfigFile: "app.js",
    baseUrl: "../app",
    dir: "../app-built",
    inlineText: true, //TODO try this on with a modules with text

    onBuildWrite: function(moduleName, path, contents){
        if(moduleName.match(/main$/)){
            return contents.replace("'" + moduleName + "',", '');

        }else{
            return contents
        }
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
        {
            name: "components/data-services/fake/main",
            excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery']
        },
        {
            name: "components/controls/basemap-gallery/main",
            excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery']
        },
        {
            name: "components/controls/bookmark-toggle/main",
            excludeShallow: ['text', 'handlebars', 'bootstrap', 'jquery']
        }

    ],

    // Turn off UglifyJS so that we can view the compiled source
    // files (in order to make sure that we know that the compile
    // is working properly - for debugging only.)
    optimize: "none"

})