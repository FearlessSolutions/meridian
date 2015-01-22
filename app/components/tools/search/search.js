define([    
    'bootstrap'
], function () {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleSearch = context.$('.btn-primary');

            $toggleSearch.('click', function() {
                    publisher.publisherSearchAdmingridCreate();

            });
            
        }
       
    }; 

    return exposed;
});