require.config({
    //baseUrl: "../../app",
    paths: {
        handlebars: '../../app/bower_components/handlebars/handlebars',
        underscore: '../../app/bower_components/underscore/underscore',
        jquery: '../../app/bower_components/jquery/dist/jquery',
        bootstrap: '../../app/libs/bootstrap-3.0.3/bootstrap',
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