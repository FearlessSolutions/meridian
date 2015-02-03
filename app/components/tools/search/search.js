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

            $focusInput.on('keyup', function() {
                if ($(focusInput.val() != "" ) {
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

                    emptyTest();
                    console.log(val1);

                var newAJAX = context.sandbox.utils.ajax({
                    // i want
                    // var query =  "SELECT * FROM Queries  WHERE userId LIKE @searchAdmin_userid AND dataSource LIKE @searchAdmin_datasource"

                    type: "GET",
                    data: { userId: val1, dataSource: val2 },
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
            function emptyTest(){
                // if(value === null || value === undefined){
                //     return '';
                // }else{
                //     return value.toString();
                // }
                console.log('dd');
            }
        }       
    };
    return exposed;
});