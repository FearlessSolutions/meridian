define([

], function() {

    /**
     * [locatorConfiguration description]
     * @type {Object} Keep msg empty to not emit messages. Messages are meant to be about the query call.
     */
    var locatorConfiguration = {
        "url" : "https://localhost:3000/gaz",
        "dataType": "json",
        "timeout": 7000,
        "noResultsMsg": "No results/suggestions found."
    };

    return locatorConfiguration;

});