var DEFAULT_PROFILE = "local-dev";

var activeConfig = require('../../config/profiles/' + DEFAULT_PROFILE + '.json');

var exports = {
    setProfile: function(name){
        name = name.replace('/', '').replace('.', '');
        activeConfig = require('../../config/profiles/' + name + '.json');
        return this;
    },
    getConfig: function(){
        return activeConfig;
    }
};

module.exports = exports;