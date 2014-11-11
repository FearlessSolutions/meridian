var transform = require('./transformation');

exports.init = function(context){
    context.sandbox.transform = transform;
};