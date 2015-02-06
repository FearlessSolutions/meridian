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
            $inputGeneric = context.$('input.form-control')
            $toggleSubmit = context.$('#searchAdmin_submit');
            $toggleClear = context.$('#searchAdmin_clear');
            $focusInput = context.$('.form-group .form-control');
            $searchMsg = context.$('#container-searchmsg');
            var currentInput, currentKey;
            //placeholder for now
            currentKey = 'userId';
                        
            $toggleSearchType.change(function() {
                $inputGeneric.val('').hide();
                $searchMsg.hide();
                switch($toggleSearchType.val()) {
                    case "input1val":
                        $inputSearch1.show().focus();
                        currentKey = 'userId';
                        break;
                    case "input2val":
                        $inputSearch2.show().focus();
                        currentKey = 'dataSource';
                        break;
                    case "input3val":
                        $inputSearch3.show().focus();
                        currentKey = 'createOn';
                        break;
                    case "input4val":
                       $inputSearch4.show().focus();
                        currentKey = 'eVal';
                        break; 
                }
            });

            $focusInput.keyup(function(event) {
                if($focusInput.filter(function() { return $.trim(this.value) != ''; }).length > 0) {
                    //There is at least one populated input
                    $focusInput.removeClass('warning');
                    $searchMsg.hide();
                }
            });    

            $toggleSubmit.on('click', function(event) {

                event.preventDefault();
                currentInput = $.trim($('input[type="text"]:visible').val());
                var searchSet = {};
                var dynKey = currentKey;                
                searchSet[dynKey] = currentInput;   
                console.log(searchSet);
                
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
                        $searchMsg.show();                    
                    } else {
                        publisher.publisherSearchAdmingridCreate(data);                    
                    };
                });               
            });
            $toggleClear.on('click', function() { 
                $inputGeneric.val('');                
            });
            function emptyTest(thingy){                                
                
            }                
        }       
    };
    return exposed;
});