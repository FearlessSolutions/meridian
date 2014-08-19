define([
    'bootstrap'
], function () {
    var context,
    textCount = 0,
    modalCount = 0;

    var exposed = {
        init: function(thisContext) {
            context = thisContext
            context.$('#showText .btn').on('click',function(event){
                 event.preventDefault();
                 exposed.updateTextCount();
            });

            context.$('#modalChannel .btn').on('click',function(event){
                 event.preventDefault();
                 exposed.updateModalCount();
            });

        },
        updateTextCount: function(param){
            context.$('#showText span').html(++textCount);
        },
        updateModalCount: function(param){
            context.$('#modalChannel span').html(++modalCount);
        }
    };

    return exposed;
});