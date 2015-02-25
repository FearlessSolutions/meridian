var TO_DISPLAY = {
    mock: 'Mock',
    fake: 'Fake'
};

var TO_DATASOURCE = {
    Mock: 'mock',
    Fake: 'fake'
};

exports.init = function(context){
    context.sandbox.displayText = {
        toDisplay: toDisplay,
        fromDisplay: fromDisplay
    };
};

function toDisplay(datasourceName){
    return TO_DISPLAY[datasourceName];
}

function fromDisplay(displayName){
    return TO_DATASOURCE[displayName];
}