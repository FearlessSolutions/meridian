define([

], function() {

    /**
     * [locatorConfiguration description]
     * @type {Object} Keep msg empty to not emit messages. Messages are meant to be about the query call.
     */
    var locatorConfiguration = {
        url : '/gaz',
        dataType: 'json',
        timeout: 7000,
        noResultsMsg: 'No results/suggestions found.',
        latIndex: 0, // array index of latitude as it returns from the geocoding service
        lonIndex: 1 // array index of longitude as it returns from the geocoding service
    };

    return locatorConfiguration;

});