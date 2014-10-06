define([

], function() {
    /**
     * @namespace Sandbox.locator
     * @memberof Sandbox
     */
    /**
     * General information about the ajax call to the locator service.
     * @var
     * @instance
     * @namspace Sandbox.locator
     * @property {String} url          - Address of the service. Value set to: localhost:3000/gaz
     * @property {String} dataType     - If this is JSON|String|etc. Value set to: JSON.
     * @property {Integer} timeout     - Time in miliseconds needed before stopping the call. Value set to: 7000.
     * @property {String} noResultsMsg - Message to be sent when no results are found. Value set to: No results/suggestions found.
     * @property {String} latIndex     - Array index of latitude as it returns from the geocoding service.
     * @property {String} lonIndex     - Array index of longitude as it returns from the geocoding service.
     * @memberof Sandbox.locator
     */
    var locatorConfiguration = {
        "url" : "https://localhost:3000/gaz",
        "dataType": "json",
        "timeout": 7000,
        "noResultsMsg": "No results/suggestions found.",
        "latIndex": 0, // array index of latitude as it returns from the geocoding service
        "lonIndex": 1 // array index of longitude as it returns from the geocoding service
    };

    return locatorConfiguration;

});