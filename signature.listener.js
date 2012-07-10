(function( $signature, $, undefined ) {
     //Private Property
     var canvas, ctx,

     getXY = function(e)
     {
         var x, y,
         offsety = canvas.offsetTop || 0,
         offsetx = canvas.offsetLeft || 0;
         
         if (e.changedTouches && e.changedTouches[0])
         {
             x = e.changedTouches[0].pageX;
             y = e.changedTouches[0].pageY;
         }
         else if (e.layerX || 0 == e.layerX)
         {
             x = e.layerX;
             y = e.layerY;
         }
         else if (e.offsetX || 0 == e.offsetX)
         {
             x = e.offsetX;
             y = e.offsetY;
         }
         
         return {
             x: x - offsetx,
             y: y - offsety
         };
     },
     
     startCapture = function(e)
     {
         e.preventDefault();
         e.stopPropagation();
         
         document.body.theSig = this;
         
         //IJS.addEvent('move', signature.getCanvas(), moveEvent);
         //IJS.addEvent('out',   signature.getCanvas(), handleOut);
         //IJS.addEvent('stop',  signature.getCanvas(), stopCapture);
         canvas.addEventListener('mousemove', moveEvent, false);
         canvas.addEventListener('touchmove', moveEvent, false);
         canvas.addEventListener('mouseup',   stopCapture,   false);
         canvas.addEventListener('touchend',  stopCapture,   false);
         
         document.body.addEventListener('mouseup',  stopCapture, false);
         document.body.addEventListener('touchend', stopCapture, false);
         
         var p = getXY(e);
         ctx.start(p);
         
         return true;
     },
     
     stopCapture = function(e)
     {
         ctx.close();
         //IJS.removeEvent('move', signature.getCanvas(), moveEvent);
         //IJS.removeEvent('out',  signature.getCanvas(), handleOut);
         //IJS.removeEvent('stop', signature.getCanvas(), stopCapture);
         canvas.removeEventListener('mousemove', moveEvent, false);
         canvas.removeEventListener('touchmove', moveEvent, false);
         canvas.removeEventListener('mouseup',   stopCapture,   false);
         canvas.removeEventListener('touchend',  stopCapture,   false);
         
         document.body.removeEventListener('mouseup',  stopCapture, false);
         document.body.removeEventListener('touchend', stopCapture, false);
     },
     
     moveEvent = function(e)
     {
         e.preventDefault();
         e.stopPropagation();
         e.cancelBubble = true;
         
         if (typeof(document.body.theSig) == 'boolean')
         {
             stopCapture(e);
             return true;
         }

         var p = getXY(e);                 
         ctx.addPoint(p);
         return true;
     },
     
     handleOut = function(e)
     {
         e.preventDefault();
         
         //save current line and empty stack
         if (document.body.theSig)
         {
             //var p = getXY(e);
             //ctx.addPoint(p);
             ctx.start();
         };
         
         //IJS.addEvent('stop', document.body, function(e){this.theSig = false;});
         document.body.addEventListener('mouseup',  function(e){this.theSig = false;});
         document.body.addEventListener('touchend', function(e){this.theSig = false;});
     };

     $signature.listener = {};

     $signature.listener.add = function(_canvas, _ctx){
         canvas = _canvas;
         ctx    = _ctx;
         //IJS.addEvent('start', signature.getCanvas(), startCapture);
         canvas.addEventListener('mousedown',  startCapture, false);
         canvas.addEventListener('touchstart', startCapture, false);
     };

     $signature.listener.remove = function(/*canvas*/){
         document.body.removeEventListener('mouseup',  stopCapture, false);
         document.body.removeEventListener('touchend', stopCapture, false);
         //canvas.removeEventListener('mousedown',  startCapture, false);
         //canvas.removeEventListener('touchstart', startCapture, false);
         document.body.theSig = undefined;
         //canvas = undefined;
         //ctx = undefined;
     };

}( window.$signature = window.$signature || {}, jQuery ));
