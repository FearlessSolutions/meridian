define([
    'bootstrap',
    'bootstrapDialog',
    'jqueryDrag'
], function () {
    var context,
        $queryButton,
        $queryDialog,
        log;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $historyLogIcon = context.$('#HistoryLogIcon');
            $historyLogDialog = context.$('#HistoryLogDialog');
            log = [];

            $historyLogIcon.on('click', function(event) {
                event.preventDefault();
                $historyLogDialog.dialog('toggle');
            });
        },
        logNotification: function(params) {
            var logItem = {
                "title": params.messageTitle,
                "text": params.messageText,
                "type": params.messageType,
                "datetime": Date.now()
            };
            log.push(logItem);
            context.$('#HistoryLogDialog .dialog-body').append("<p>" + logItem.text + "</p>");
        }
    };

    return exposed;
});