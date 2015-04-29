$( "p" ).on( "buttonClickSuccess", function(event) {
  $( this ).text("Button Active" );
  $( "span" )
    .stop()
    .css( "opacity", 1 )
    .text( "Boom" )
    .fadeIn( 30 )
    .fadeOut( 1000 );
});
$(".successButton").click(function () {
  $( "p" ).trigger( "buttonClickSuccess" );
});
