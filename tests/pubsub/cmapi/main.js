require.config({
    //baseUrl: "../../app",
    paths: {
        handlebars: '../bower_components/handlebars/handlebars',
        underscore: '../bower_components/underscore/underscore',
        jquery: '../bower_components/jquery/dist/jquery',
        bootstrap: '../libs/bootstrap-3.2.0/bootstrap',
        pubConfig: './pub-config',
        subConfig: './sub-config'
    },
    shim:{
    }
});

require(['jquery',
    './pub',
    './sub', 
    'pub-config', 
    'sub-config'],
    function($, Pub, Sub, pubConfig, subConfig) {
        Pub.init(pubConfig);
        Sub.init(subConfig);
    }
);