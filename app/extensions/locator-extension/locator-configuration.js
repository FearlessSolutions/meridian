define([

], function() {

    /**
     * General information about the ajax call to the locator service.
     * @namspace SandBox.locator
     * @property {String} url Address of the service.
     * @property {String} dataType If this is JSON|String|etc.
     * @property {Integer} timeout Time in miliseconds needed before stopping the call.
     * @property {String} noResultsMsg Message to be sent when no results are found.
     *      
     */
    var locatorConfiguration = {
        "url" : "https://localhost:3000/gaz",
        "dataType": "json",
        "timeout": 7000,
        "noResultsMsg": "No results/suggestions found."
    };

    return locatorConfiguration;

});