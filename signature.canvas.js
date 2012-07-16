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


    $signature.getContext = function (canvas, options, callback)
    {
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
        context  = canvas.getContext('2d');
        
        options = $.extend({}, $signature.context.options, options);
        for(var i in options){
            if(context[i] && 'function' !== typeof context[i]){
                context[i] = options[i];
            }
        }
        

        // API
        context.populate = function(_lines){
            if(!_isSignatureEqual(lines, _lines)){
                //signature blurred
            }
            
            context.clear();
            context.update(_lines);
        };
        
        
        context.update = function(_lines){
            if(_lines && _lines.length){
                for(var line = 0, lines_number = _lines.length; line < lines_number; line++){
                    var points_number = _lines[line].length;
                    if(points_number){
                        if(typeof _lines[line][0] == 'object'){
                            context.start(_lines[line][0]);
                            for(var point = 1; point < points_number; point++){
                                context.addPoint(_lines[line][point]);
                            }
                        } else {
                            context.start({x: _lines[line][0], y: _lines[line][1]});
                            for(var point = 2; point < points_number; point += 2){
                                context.addPoint({x: _lines[line][point], y: _lines[line][point+1]});
                            }      
                        }
                        
                        context.close();
                    }
                }
            }
            lines = _lines;
            cleared = false;
            blurred  = false;
            if(typeof callback == 'function') callback(this);
        };

        context.clear = function(){
            lines = [];
            context.clearRect(0, 0, canvas.width, canvas.height);
            blurred = true;
            cleared = true;
            return true;
        };
             
        context.start = function(p){
            _linesPush();
            context.beginPath();
            if (p){
                context.moveTo(p.x, p.y);
                _linesPush(p);
            }
        };
     
        context.addPoint = function(p){
            _linesPush(p);
            context.lineTo(p.x, p.y);
            context.stroke();
            blurred = true;
            return true;
        };
             
        context.close = function(){
            context.stroke();
            context.closePath();
        };
             
        context.getLines = function(){
            return lines;
        };
        
        context.isSigned = function(){
            return (lines && !!lines.length);
        };
             
        context.isBlurred = function(){
            return blurred;
        };
             
        context.isCleared = function(){
            return cleared;
        };
     
        context.getStatus = function(){
            if(blurred && cleared) return 'new';
            else if(!blurred && cleared) return 'clean';
            else if(blurred && !cleared) return 'updated';
            else return '';
        };
             
        context.draw = function(img){
            context.drawImage(img, 0, 0);
        };

        return context;
     }
         
     $signature.context = {options: def};

}( window.$signature = window.$signature || {}, jQuery ));

