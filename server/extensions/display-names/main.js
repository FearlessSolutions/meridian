var TO_DISPLAY = {
    mock: 'Mock',
    fake: 'Fake',
    upload: 'Upload'
};

var TO_DATASOURCE = {
    Mock: 'mock',
    Fake: 'fake',
    Upload: 'upload'
};

exports.init = function(context){
    context.sandbox.displayText = {
        toDisplay: toDisplay,
        fromDisplay: fromDisplay
    };
};

function toDisplay(datasourceName){
    return TO_DISPLAY[datasourceName] || datasourceName;
}

function fromDisplay(displayName){
    return TO_DATASOURCE[displayName] || displayName;
}