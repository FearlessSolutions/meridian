define([    
    './search-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleSearch = context.$('.btn-primary');

            $toggleSearch.on('click', function(event) {
                event.preventDefault();
                publisher.publisherSearchAdmingridCreate();
            });
            
        }
       
    }; 

    return exposed;
});