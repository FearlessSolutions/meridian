define([
    './export-picker-publisher',
    'text!./export-picker-option.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, optionHBS) {

    var context,
        MENU_DESIGNATION = 'export-picker-modal',
        $modal,
        $picker,
        $closeButton,
        $exportButton;

    var exposed = {
        init: function(thisContext) {
            var optionTemplate = Handlebars.compile(optionHBS);

            context = thisContext;
            $modal = context.$('#export-picker-modal');
            $picker = $modal.find('select#export-options');
            $exportButton = context.$('button[type="submit"]');
            $closeButton = context.$('button[type="cancel"]');

            //Fill out the options
            context.sandbox.export.options.forEach(function(option){
                var optionHTML = optionTemplate(option);
                $picker.append(optionHTML);
            });

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
            });

            $exportButton.on('click', function(event){
                var channel = $picker.val();

                //If there is nothing to export, print message and stop
                if(context.sandbox.utils.size(context.sandbox.dataStorage.datasets) === 0){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No data to export.'
                    });
                    return;
                }

                publisher.export({
                    channel: channel
                });

                publisher.close();
            });


             $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.close();
            });

           
        },
        open: function() {
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        clear: function() {
            $modal.modal('hide');
        }
    };

    return exposed;

});