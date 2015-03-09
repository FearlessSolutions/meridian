define([
    './locator-publisher',
    'coordinateConverter',
    'typeahead',
    'bootstrap'
], function (publisher,cc) {
    var context,
        timeout,
        selectedLocation = null,
        dataByName = {},
        $locator,
        $locatorButton,
        $locatorInput,
        regEx = /([0-9])/;//if it contains a number it is a coordinate.

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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
                event.preventDefault();

                if(selectedLocation === null) {
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Search',
                        messageText: 'No valid location selected. Please please click an option from the dropdown.'
                    });
                    
                    


                }else if(selectedLocation === 'error') { //It is coordinates error
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Search',
                        messageText: 'Incorrect or unsupported coordinate format.'
                    });
                }else if(selectedLocation.dd) {
                    console.debug('zooming to: ', selectedLocation.dd);
                    exposed.markLocation(selectedLocation.dd);
                }
                else{
                    exposed.goToLocation();
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

                /* Source occurs after a new character is added. Defaults to 1.
                 * change selectedLocation to null after evey key event and disable search button.
                 * To prevent the ajax call from happening after every new character, a
                 * timeout delay has been added.*/
                 //query is always a string.
                source: function(query,process) {
                    console.debug('query: ', query);
                    //null when it doesnt match.
                    //grab coordinate.input
                    var coordinate = query.match(regEx);
                    console.debug(coordinate);
                    if(coordinate !== null){
                        selectedLocation = context.sandbox.utils.convertCoordinate(coordinate.input);
                        $locatorInput.typeahead('hide');//Manual typeahead hide.
                    }else{
                        if(timeout) {
                            clearTimeout(timeout);
                        }
                        timeout = setTimeout(function() {
                            /*No need to query empty input*/
                            if(query !== null) {
                                publisher.publishMessage({
                                    messageType: 'info',
                                    messageTitle: 'Looking up suggestions',
                                    messageText: 'Validating ...'
                                });
                                //get the name data.
                                context.sandbox.locator.query(query, function(data){
                                   var formattedData = context.sandbox.locator.formatData(data);
                                    if(formattedData.names === []) {
                                        publisher.publishMessage({
                                            messageType: 'warning',
                                            messageTitle: 'Search Results',
                                            messageText: 'No results/suggestions found.'
                                        });
                                    } else {
                                        dataByName = formattedData.data;
                                    }
                                    process(formattedData.names); 
                                });
                            }else{
                                //as a precaution.
                                //query is null, meaning there is nothing in the textArea.
                                $locatorInput.typeahead('hide');//Manual typeahead hide.
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
                updater:function(item) {
                    selectedLocation = dataByName[item];
                    publisher.publishMessage({
                        messageType: 'success',
                        messageTitle: 'Search',
                        messageText: 'Valid location selected.'
                    });

                    return item;
                }
            });

            $locatorInput.on('paste', function(event){
                //timeout allows time for val() to get populated. Once populated,
                //typeahead can work as expected. 
                setTimeout(function () {
                     var input = $locatorInput.val(),
                    coordinate = input.match(regEx);
                    if(coordinate === null){
                        $locatorInput.typeahead('lookup');//Manual typeahead look up.
                    }
                }, 10);
            });
        },
        // Zooms to an area saved in selectedLocation based on the name provided in the locator tool.
        goToLocation: function() {
            publisher.zoomToLocation({
                minLon: selectedLocation.minLon,
                minLat: selectedLocation.minLat,
                maxLon: selectedLocation.maxLon,
                maxLat: selectedLocation.maxLat
            });
            $locatorInput.val('');
        },//end of goToLocation
        /*
         * Zooms and marks a location based on the coordintate provided.
         */
        markLocation: function(coordinates) {
            publisher.markLocation({
                layerId: 'static_geolocator',
                data: [context.sandbox.utils.createGeoJson(coordinates)]
            });
            publisher.setMapCenter(coordinates);
        },
        clear: function() {
            clearTimeout(timeout);
            $locatorInput.val('');
        }
    };

    return exposed;
});