(function( $signature, $, undefined ) {
     //Private Property     
     var def = {
         lineWidth:   1,
         lineCap:     "round",
         fillStyle:   "#fff",
         strokeStyle: "#444"
     },
     _isSignatureEqual = function(first, second){
         if (first && first.length != second.length){return false;}
         return (JSON.stringify(first) == JSON.stringify(second));
     };


     $signature.context = function (canvas, options, callback) {
         if(typeof options == 'function')
         {
             callback = options;
             options = {};
         }
         var lines  = [],
         blurred    = false,
         cleared    = false,
         _linesPush = function(p){
             if(p){
                 lines[lines.length - 1].push(p);
             } else {
                 lines.push([]);
             }
         },

         ctx             = canvas.getContext('2d');

         ctx.lineWidth   = options.lineWidth   || def.lineWidth;
         ctx.lineCap     = options.lineCap     || def.lineCap;
         ctx.fillStyle   = options.fillStyle   || def.fillStyle;
         ctx.strokeStyle = options.strokeStyle || def.strokeStyle;

         // API
         return{
             populate: function(_lines){
                 if(!_isSignatureEqual(lines, _lines)){
                     //signature blurred
                 }
                 
                 this.clear();
                 this.update(_lines);
             },
        
             update: function(_lines){
                 if(_lines && _lines.length){
                     for(var line = 0, lines_number = _lines.length; line < lines_number; line++){
                         var points_number = _lines[line].length;
                         if(points_number){
                             if(typeof _lines[line][0] == 'object'){
                                 this.start(_lines[line][0]);
                                 for(var point = 1; point < points_number; point++){
                                     this.addPoint(_lines[line][point]);
                                 }
                             } else {
                                 this.start({x: _lines[line][0], y: _lines[line][1]});
                                 for(var point = 2; point < points_number; point += 2){
                                     this.addPoint({x: _lines[line][point], y: _lines[line][point+1]});
                                 }                     
                             }
                             
                             this.close();
                         }
                     }
                 }
                 lines = _lines;
                 cleared = false;
                 blurred  = false;
                 if(typeof callback == 'function') callback(this);
             },
             
             clear: function(){
                 lines = [];
                 ctx.clearRect(0, 0, canvas.width, canvas.height);
                 blurred = true;
                 cleared = true;
                 return true;
             },
             
             start: function(p){
                 _linesPush();
                 ctx.beginPath();
                 if (p){
                     ctx.moveTo(p.x, p.y);
                     _linesPush(p);
                 }
             },
     
             addPoint: function(p){
                 _linesPush(p);
                 ctx.lineTo(p.x, p.y);
                 ctx.stroke();
                 blurred = true;
                 return true;
             },
             
             close: function(){
                 ctx.stroke();
                 ctx.closePath();
             },
             
             getLines: function(){
                 return lines;
             },
             
             isSigned: function(){
                 return (lines && !!lines.length);
             },
             
             isBlurred: function(){
                 return blurred;
             },
             
             isCleared: function(){
                 return cleared;
             },
     
             getStatus: function(){
                 if(blurred && cleared) return 'new';
                 else if(!blurred && cleared) return 'clean';
                 else if(blurred && !cleared) return 'updated';
                 else return '';
             },
             
             draw: function(img){
                 ctx.drawImage(img, 0, 0);
             }
             
         };
     };

     $signature.context.options = def;

}( window.$signature = window.$signature || {}, jQuery ));

