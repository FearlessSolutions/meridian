define([    
    './search-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleSearchType = context.$('#searchAdmin_toggleType');
            $inputSearch1 = context.$('#searchAdmin_userid');
            $inputSearch2 = context.$('#searchAdmin_datasource');
            $inputSearch3 = context.$('#searchAdmin_sdate');
            $inputSearch4 = context.$('#searchAdmin_edate');           
            $toggleSubmit = context.$('#searchAdmin_submit');
            $toggleClear = context.$('#searchAdmin_clear');
            $focusInput = context.$('.form-group .form-control');
            var currentInput, currentKey;
            //placeholder for now
            currentKey = 'userId';
                        
            $toggleSearchType.change(function() {
                $('input.form-control').hide();
                switch($toggleSearchType.val()) {
                    case "input1val":
                        $inputSearch1.show();
                        currentKey = 'userId';
                        break;
                    case "input2val":
                        $inputSearch2.show();
                        currentKey = 'dataSource';
                        break;
                    case "input3val":
                        $inputSearch3.show();
                        currentKey = 'sVal';
                        break;
                    case "input4val":
                       $inputSearch4.show();
                        currentKey = 'eVal';
                        break; 
                }

            });

            $toggleSubmit.on('click', function(event) {

                event.preventDefault();
                currentInput = $('input[type="text"]:visible').val();                
                var searchSet = {};
                var dynKey = currentKey;
                var dynVal = currentInput;
                searchSet[dynKey] === dynVal;   
                //console.log(searchSet);

                
                
                // for(var key in searchSet) {
                //     // value is empty string
                //     if(searchSet[key] === '') {
                //         delete searchSet[key];
                //     }
                // }

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
                    if(!currentInput) {                        
                        $('input[type="text"]:visible').addClass('warning');                    
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
            function emptyTest(thingy){                                
                
            }                
        }       
    };
    return exposed;
});