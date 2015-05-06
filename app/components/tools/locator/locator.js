define([
    'typeahead',
    'bootstrap'
], function () {
    var context,
        mediator,
        timeout,
        selectedLocation = null,
        dataByName = {},
        $locator,
        $locatorButton,
        $locatorInput,
        regEx = /([0-9])/;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            $locator = context.$('#locator');
            $locatorButton = context.$('#locator .btn');
            $locatorInput = context.$('#locator input');

            //Activate bootstrap tooltip. 
            //No need to specify container to make the tooltip appear in one line. 
            //Still added to keep consistency.
            $locator.tooltip({
                container: 'body',
                delay: {
                    show: 500
                }
            });

            $locatorButton.on('click', function(event) {
                var coorindatesGeoJSON;
                event.preventDefault();

                if(selectedLocation === null) {
                    mediator.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Search',
                        messageText: 'No valid location selected. Please select an option from the dropdown.'
                    });
                }else if(selectedLocation === 'error') { //It is a coordinate error
                    mediator.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Search',
                        messageText: 'Incorrect or unsupported coordinate format.'
                    });
                    selectedLocation = null;
                }else if(selectedLocation.dd) {
                    coorindatesGeoJSON = context.sandbox.locator.createCoordinatesGeoJSON(selectedLocation);
                    markLocation(coorindatesGeoJSON);
                    goToLocation(coorindatesGeoJSON);
                    $locatorButton.attr('disabled', false);
                } else{
                    context.sandbox.locator.createLocationGeoJSON(selectedLocation, function(error, locationGeoJSON){
                        if(error){
                            mediator.publishMessage({
                                messageType: 'error',
                                messageTitle: 'Search',
                                messageText: 'Error creating location marker.'
                            });
                        } else {
                            markLocation(locationGeoJSON);
                            goToLocation(locationGeoJSON);
                        }
                        selectedLocation = null;
                    });
                }
            });

            $locatorInput.on('keydown', function(e) {
                if (e.keyCode === 13) {
                    if (!$('.typeahead').is(':visible')) {
                        $locatorButton.click();
                    }
                }
            });

            //Needed for typeahead functionality.
            $locatorInput.attr('data-provide', 'typeahead');
            $locatorInput.typeahead({
                items: 15,
                //Source occurs after a new character is added. Defaults to 1.
                //change selectedLocation to null after evey key event and disable search button.
                //To prevent the ajax call from happening after every new character, a
                //timeout delay has been added.
                //query is always a string.
                source: function(query,process) {
                    //null when it doesnt match.
                    //if input has a single number, it will be considered a coordinate.
                    var coordinates = query.match(regEx);
                    selectedLocation = null;
                    if(timeout){
                        clearTimeout(timeout);
                    }

                    if(coordinates){
                        //selectedLocation comes back as an object containing all
                        //possible conversions of the coordinate provided.
                        selectedLocation = context.sandbox.utils.convertCoordinate(coordinates.input);
                        $locatorInput.typeahead('hide');//Precautionary typeahead hide.
                    } else if(query !== ''){
                        //query has no numbers. A place look up is assumed.
                        timeout = setTimeout(function() {
                            /*No need to query empty input*/
                            if(query) {
                                mediator.publishMessage({
                                    messageType: 'info',
                                    messageTitle: 'Looking up suggestions',
                                    messageText: 'Validating ...'
                                });
                                //get the name data.
                                context.sandbox.locator.query(query, function(data){
                                    if(data.names === []) {
                                        mediator.publishMessage({
                                            messageType: 'warning',
                                            messageTitle: 'Search Results',
                                            messageText: 'No results/suggestions found.'
                                        });
                                    } else {
                                        dataByName = data.data;
                                    }
                                    process(data.names);
                                });
                            }
                        }, 800);
                    }
                },
                /**
                 * Overwrite matcher function to always show values returned by the service.If the service
                 * returned a value, show it to the user. Content array is built with values returned by the server,
                 * no need to filter results more than once.
                 * @param  {String} item Value the user writes in the text area.
                 * @return {Boolean}      Tells typeahead if there is a value in our array that matches.
                 */
                matcher: function(item){
                    return true;
                },

                /* Called by bootstrap once the user selects an item.
                 * Must return item.
                 * Item is added to the input box.*/
                updater:function(name) {
                    selectedLocation = dataByName[name];
                    mediator.publishMessage({
                        messageType: 'success',
                        messageTitle: 'Search',
                        messageText: 'Valid location selected.'
                    });

                    return name;
                }
            });

            $locatorInput.on('paste', function(event){
                //timeout allows time for val() to get populated. Once populated,
                //typeahead can work as expected. 
                setTimeout(function () {
                    $locatorInput.typeahead('lookup');//Manual typeahead look up.
                }, 10);
            });
        },
        clear: function() {
            clearTimeout(timeout);
            $locatorInput.val('');
        }
    };

    function goToLocation(locationGeoJSON){
        if(locationGeoJSON.bbox){
            mediator.zoomToLocation(locationGeoJSON.bbox);
        } else if(locationGeoJSON.geometry.type === 'Point') {
            mediator.setMapCenter({
                lat: locationGeoJSON.geometry.coordinates[1],
                lon: locationGeoJSON.geometry.coordinates[0]
            });
        } else {
            mediator.zoomToFeature({
                layerId: 'static_geolocator',
                featureIds: [locationGeoJSON.featureId]
            });
        }

        $locatorInput.val('');
    }

    function markLocation(locationGeoJSON){
        mediator.markLocation({
            layerId: 'static_geolocator',
            data: [locationGeoJSON]
        });
    }

    return exposed;
});