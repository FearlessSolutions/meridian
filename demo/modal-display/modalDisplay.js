define([
    './inputArea-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext,
            $submitBtn = context.$('#inputArea .btn'),
            $textArea = context.$('#inputArea input');
           
            $submitBtn.on('click', function(event){
                var input = $textArea.val();
                event.preventDefault();

                console.log(input);
                publisher.publishInput({
                    "message":input
                });
            });

            // $locatorButton.on('click', function(event) {
            //     var input = $locatorInput.val();
            //     event.preventDefault();

            //     if(selectedLocation === null) {/*Extra precaution, button should be disabled anyways.*/
            //         publisher.publishMessage({
            //             "messageType": 'warning',
            //             "messageTitle": 'Search',
            //             "messageText": 'No valid location selected. Please try again.'
            //         });
            //     }else if(selectedLocation.lat) { //It is coordinates
            //         exposed.markLocation(selectedLocation);
            //     }else {
            //         exposed.goToLocation();
            //     }
            // });

            // $locatorInput.on('keydown', function(e) {
            //     if (e.keyCode === 13) {
            //         $locatorButton.click();
            //     }
            // });

        }
    };

    return exposed;
});