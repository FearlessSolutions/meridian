define([    
    './search-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleSearch = context.$('#searchAdmin_submit');
            $toggleClear = context.$('#searchAdmin_clear');
            $focusInput = context.$('.form-group .form-control');
            
            $focusInput.keyup(function(event) {
                if($focusInput.filter(function() { return $.trim(this.value) != ''; }).length > 0) {
                    //There is at least one populated input
                    $focusInput.removeClass('warning');
                    $('#container-searchmsg').hide();
                }
            });            

            $toggleSearch.on('click', function(event) {
                event.preventDefault();
                // function for null on input x 4
                var val1 = $('#searchAdmin_userid').val(),
                    val2 = $('#searchAdmin_datasource').val(),
                    val3 = $('#searchAdmin_sdate').val(),
                    val4 = $('#searchAdmin_edate').val();
                                       
                var searchSet = { userId: val1, dataSource: val2, createdOn: val3, expireOn: val4 };

                for(var key in searchSet) {
                    // value is empty string
                    if(searchSet[key] === '') {
                        delete searchSet[key];
                    }
                }

                var newAJAX = context.sandbox.utils.ajax({
                    // i want
                    // var query =  "SELECT * FROM Queries  WHERE userId LIKE @searchAdmin_userid AND dataSource LIKE @searchAdmin_datasource"
             
                    type: "GET",
                    data: searchSet,                    
                    url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/term',
                    xhrFields: {
                        "withCredentials": true
                    }
                })
                .done(function(data) {
                    if(!val1 && !val2 && !val3 && !val4){  
                        $('#searchAdmin_userid').addClass('warning');
                        $('#searchAdmin_datasource').addClass('warning');
                        $('#searchAdmin_sdate').addClass('warning');
                        $('#searchAdmin_edate').addClass('warning');
                        $('#container-searchmsg').show();
                    } else {
                        // if(val1 || val2 || val3 || val4 == null || undefined){}
                        if(data == '') {
                            alert('NO RESULTS!');}
                        //console.log(val1,val2,val3,val4);
                        publisher.publisherSearchAdmingridCreate(data);
                    };
                });               
            });
            $toggleClear.on('click', function() { 
                $('#searchAdmin_userid').val('');
                $('#searchAdmin_datasource').val('');
                $('#searchAdmin_sdate').val('');
                $('#searchAdmin_edate').val('');
            });
            function emptyTest(thingy){                                
                
            }                
        }       
    };
    return exposed;
});