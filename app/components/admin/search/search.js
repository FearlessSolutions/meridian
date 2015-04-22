define([    
    './search-publisher',
    'bootstrap',
    'daterangepicker'
], function (publisher) {
    var context,
        datePickerObj;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            var $toggleSearchType = context.$('#searchAdmin_toggleType'),
                $toggleSearchDateType = context.$('#searchAdmin_searchDateType'),
                $inputSearch1 = context.$('#searchAdmin_userid'),
                $inputSearch2 = context.$('#searchAdmin_datasource'),
                $inputGeneric = context.$('input.form-control'),
                $toggleSubmit = context.$('#searchAdmin_submit'),
                $toggleClear = context.$('#searchAdmin_clear'),
                $focusInput = context.$('.form-group .form-control'),
                $searchMsg = context.$('#container-searchmsg'),
                currentInput,
                currentKey = 'userId',
                msgOneCrit = 'You must enter a value for the search criteria',
                msgNoResults = 'No Results Found';

            $toggleSearchDateType.daterangepicker({
                ranges: {
                    'Last hour': [moment().subtract(1, 'hours'), moment()],
                    'Last 4 hours': [moment().subtract(4, 'hours'), moment()],
                    'Last 12 hours': [moment().subtract(12, 'hours'), moment()],
                    'Last 24 hours': [moment().subtract(24,'hours'), moment()]
                },
                timePicker: true,
                startDate: moment().subtract(1, 'days').startOf('day'),
                endDate: moment(),
                minDate: moment().subtract(14, 'days').startOf('day'),
                maxDate: moment()
            });
            datePickerObj = $toggleSearchDateType.data('daterangepicker');            
                        
            $toggleSearchType.change(function() {
                $toggleSearchDateType.hide();
                $inputGeneric.val('').hide();
                $searchMsg.hide();
                switch($toggleSearchType.val()) {
                    case 'input1val':
                        $inputSearch1.show().focus();
                        currentKey = 'userId';
                        break;
                    case 'input2val':
                        $inputSearch2.show().focus();
                        currentKey = 'dataSource';
                        break;
                    case 'input3val':
                        $toggleSearchDateType.show().focus();
                        currentKey = 'createdOn';                        
                        break;
                    case 'input4val':
                       $toggleSearchDateType.show().focus();
                        currentKey = 'expireOn';                        
                        break; 
                }
            });
            $focusInput.on('keydown', function(e) {
                if (e.keyCode === 13) {
                    $toggleSubmit.click();
                }
            });

            $focusInput.keyup(function(e) {
                if (e.keyCode === 13) {
                    $toggleSubmit.click();
                } else if($focusInput.filter(function() { return $.trim(this.value) !== ''; }).length > 0) {
                    //There is at least one populated input
                    $focusInput.removeClass('warning');
                    $searchMsg.hide();
                }
            });
            $focusInput.on('paste', function(e) {
                if($focusInput.filter(function() { return context.sandbox.utils.trim(this.value) !== ''; }).length > 0) {
                    //There is at least one populated input
                    $focusInput.removeClass('warning');
                    $searchMsg.hide();
                }
            });

            $toggleSubmit.on('click', function(event) {
                var searchSet = {},
                    dpSDVal = datePickerObj.startDate,
                    dpEDVal = datePickerObj.endDate,
                    dynKey;

                event.preventDefault();

                if (currentKey === 'userId' || currentKey === 'dataSource')  {
                    currentInput = context.sandbox.utils.trim(context.$('input[type="text"]:visible').val());
                    dynKey = currentKey;
                    searchSet[dynKey] = currentInput;
                } else if (currentKey === 'createdOn'){
                    searchSet = {
                            createdOn: {
                                dateStartValue: dpSDVal.unix(),
                                dateEndValue: dpEDVal.unix()
                            }
                    };
                } else if (currentKey === 'expireOn'){
                    searchSet = {
                            expireOn: {
                                dateStartValue: dpSDVal.unix(),
                                dateEndValue: dpEDVal.unix()
                            }
                    };
                }
                
                context.sandbox.utils.ajax({
                    type: 'GET',
                    data: searchSet,                    
                    url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/term',
                    xhrFields: {
                        withCredentials: true
                    }
                })
                .done(function(data) {
                    if (currentKey === 'userId' || currentKey === 'dataSource') {
                        if(!currentInput) {
                            context.$('input[type="text"]:visible').addClass('warning');
                            $searchMsg.text(msgOneCrit).show();
                            publisher.clearAdminGrid();
                        } else {
                            if(context.sandbox.utils.isEmptyObject(data)) {
                                $searchMsg.text(msgNoResults).show();
                                publisher.clearAdminGrid();
                            } else {
                                $searchMsg.hide();
                                publisher.publisherSearchAdmingridCreate(data);
                            }
                        }
                    } else {
                        if(context.sandbox.utils.isEmptyObject(data)) {
                            $searchMsg.text(msgNoResults).show();
                            publisher.clearAdminGrid();
                        } else {
                            $searchMsg.hide();
                            publisher.publisherSearchAdmingridCreate(data);
                        }
                    }
                });               
            });
            $toggleClear.on('click', function() { 
                $inputGeneric.removeClass('warning').val('');
                $searchMsg.hide();
                publisher.clearAdminGrid();
            });
        }       
    };
    return exposed;
});