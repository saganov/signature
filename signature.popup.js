(function( $signature, $, undefined ) {
     //Private Property
     var def = {width: 400,
                height: 200,
                scale: 2,
                lineWidth: 1,
                lineCap: 'round',
                fillStyle: '#fff',
                strokeStyle: '#444'};
     
     var show = function(e)
     {
         var container = $('<div />', {'class': 'popup_signature'})
             .css('width',  def.width+'px')
             .css('height', def.height+'px');
         var canvas = $('<canvas />')
             .attr('width',  def.width)
             .attr('height', def.height);
         
         var signature = e.data.signature.data('signature').context;
         //grab the context from your destination canvas
         var ctx = $signature.context(canvas[0], def);
         //call its drawImage() function passing it the source canvas directly
         ctx.draw(e.target);
         //ctx.populate(signature.getLines());
         $signature.listener.add(canvas[0], ctx);

         // TODO: There has to be the way to reload this methods
         var callback = {
             ok: function(e){
                 // TODO: Store the new lines into appropriated signature
                 //       Must decide if there should be:
                 //         - adding additional lines to existed ones
                 //         - replacing existed lines by new ones
                 //         - removing all old lines (clean signature)
                 //       And refresh it
                 switch(ctx.getStatus()){
                 case 'new':
                     console.log('The signature is signed');
                     signature.populate(ctx.getLines());
                     break;
                 case 'updated':
                     console.log('The signature is signed');
                     signature.update(ctx.getLines());
                     break;
                 case 'clean':
                     console.log('The signature is clear');
                     signature.clear();
                     break;
                 default:
                     break;
                 }
                 hide(e);
             },
             cancel: function(e){
                 console.log('The signature was closed');
                 hide(e);
             },
             clear: function(e){
                 console.log('The signature was cleared');
                 ctx.clear();
             }
         };
         
         var button = {
             ok:     $('<input type="button" value="OK" />').click(callback.ok),
             cancel: $('<input type="button" value="Cancel" />').click(callback.cancel),
             clear:  $('<input type="button" value="Clear " />').click(callback.clear)
         };
         
         $(container).append(canvas).append(button.ok).append(button.cancel).append(button.clear);
         $('body').append(container);
     };
     
     var hide = function(e)
     {
         $signature.listener.remove();
         $('div.popup_signature').remove();
     };
     
     // API
     $signature.popup = {
         show: show,
         hide: hide             
     };
     
}( window.$signature = window.$signature || {}, jQuery ));

