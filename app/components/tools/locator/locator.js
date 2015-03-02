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
        $locatorInput;

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
                var input = $locatorInput.val();
                event.preventDefault();

                if(selectedLocation === null || input === '') {/*Extra precaution, button should be disabled anyways.*/
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Search',
                        messageText: 'No valid location selected. Please try again.'
                    });
                    console.debug("Actual Numbers: ");
                    console.debug('ddToMgrs(12.5,14.7): ' + cc.ddToMgrs(12.5,14.7,'string'));
                    console.debug('ddToUtm(12.5,14.7): ' + cc.ddToUtm(12.5,14.7,'string'));
                    console.debug('ddToDms(12.5,14.7): ' + cc.ddToDms(12.5,14.7,'string'));
                    console.debug('utmToDd(1383198,220901,33): ' + cc.utmToDd(1383198, 220901, 33,'string', 3));


                }else if('lat' in selectedLocation) { //It is coordinates
                    exposed.markLocation(selectedLocation);
                }else {
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
                source: function(query,process) {
                    selectedLocation = null;

                    if(timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function() {
                        var content = $locatorInput.val().length || null;

                        /*No need to query empty input*/
                        if(content !== null) {

                            //Handle both coordinates and places
                            if(query.match(/^-?\d/)) {

                            }else { 
                                publisher.publishMessage({
                                    messageType: 'info',
                                    messageTitle: 'Looking up suggestions',
                                    messageText: 'Validating ...'
                                });
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
                                
                            }                            
                        }
                    }, 800);
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
                    $locatorInput.typeahead('lookup');//Manual typeahead look up.
                }, 10);
            });
        },
        goToLocation: function() {
            publisher.zoomToLocation({
                minLon: selectedLocation.minLon,
                minLat: selectedLocation.minLat,
                maxLon: selectedLocation.maxLon,
                maxLat: selectedLocation.maxLat
            });
            $locatorInput.val('');
        },//end of goToLocation
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