define([    
    './search-publisher',
    'bootstrap',
    'daterangepicker'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleSearchType = context.$('#searchAdmin_toggleType');
            $toggleSearchDateType = context.$('#searchAdmin_searchDateType');
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
            //placeholder 
            currentKey = 'userId';

            $('#testdiv').daterangepicker({
                // ranges: {
                //     'Last hour': [moment().subtract(1, 'hours'), moment()],
                //     'Last 4 hours': [moment().subtract(4, 'hours'), moment()],
                //     'Last 12 hours': [moment().subtract(12, 'hours'), moment()],
                //     'Last 24 hours': [moment().subtract(24,'hours'), moment()]
                // },
                timePicker: true,
                startDate: moment().subtract(1, 'days'),
                endDate: moment(),
                maxDate: moment()
                }, function(start, end, label) {
                    console.log(start.toISOString(), end.toISOString(), label);

                    var rangeStartDate = start.toISOString();
                    console.log(rangeStartDate);
                });

            
                        
            $toggleSearchType.change(function() {
                $toggleSearchDateType.hide();
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
                        $toggleSearchDateType.show().focus();
                        currentKey = 'createOn';
                        //currentInput = '1422390816';
                        break;
                    case "input4val":
                       $toggleSearchDateType.show().focus();
                        currentKey = 'expireOn';
                        //currentInput = '1423142805';
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
                if ($toggleSearchDateType.is(':visible')) {
                    // hardcoded, but for single date, not range
                    //$('#rangeHidden').val('1422383967');
                    currentInput = $('#rangeHidden').val();
                    console.log(currentInput);
                } else {
                    currentInput = $.trim($('input[type="text"]:visible').val());
                };
                
                var searchSet = {};
                var dynKey = currentKey;                
                searchSet[dynKey] = currentInput;
                console.log(searchSet);

                var newAJAX = context.sandbox.utils.ajax({                  
             
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
        }       
    };
    return exposed;
});