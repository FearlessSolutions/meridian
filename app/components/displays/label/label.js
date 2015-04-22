define([
    'bootstrap',
    'jqueryUI'
], function () {
    var context;

	var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            context.$("#labelContainer").draggable({ handle: ".dialog-header" });
        },
        createLabel: function(params) {
            var labelTitle = params.title;
            var labelDescription = params.description;

            if(labelTitle === undefined){
                labelTitle = "No Title";
            }
            
            if(labelDescription === undefined){
                labelDescription = "No Description";
            }

            context.$('.dialog-title').html(labelTitle);
            context.$('.dialog-body').html(labelDescription);    
            context.$('#labelContainer').removeClass('hide');
        },
        removeLabel: function(){
            context.$('#labelContainer').addClass('hide');
        }
    };

    return exposed;
});