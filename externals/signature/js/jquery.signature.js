(function($){
    
    var def = {canvas: {width: 400, height: 200, scale: 2, lineWidth: 1, lineCap: 'round', fillStyle: '#fff', strokeStyle: '#444'},
               lines:[]};
    
    var signature_context = function(canvas, options, callback)
    {
        var lines               = [],
            blurred             = false,
            cleared             = false,
            context             = canvas.getContext('2d');
            context.lineWidth   = options.lineWidth   || 1;
            context.lineCap     = options.lineCap     || "round";
            context.fillStyle   = options.fillStyle   || "#fff";
            context.strokeStyle = options.strokeStyle || "#444";
        
        return {
            
            populate: function(_lines)
            {
                if(!this._isSignatureEqual(lines, _lines)){
                    //signature blurred
                }
                
                this.clear();
                this.update(_lines);
            },

            update: function(_lines)
            {
                if(_lines && _lines.length){
                    var lines_number = _lines.length;
                    for(var line = 0; line < lines_number; line++){
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
            
            clear: function()
            {
                lines = [];
                context.clearRect(0, 0, canvas.width, canvas.height);
                blurred = true;
                cleared = true;
                return true;
            },
            
            start: function(p)
            {
                this._linesPush();
                context.beginPath();
                if (p){
                    context.moveTo(p.x, p.y);
                    this._linesPush(p);
                }
            },
            
            addPoint: function(p)
            {
                this._linesPush(p);
                context.lineTo(p.x, p.y);
                context.stroke();
                blurred = true;
                return true;
            },

            close: function()
            {
                context.stroke();
                context.closePath();
            },

            getLines: function()
            {
                return lines;
            },

            isSigned: function()
            {
                return (lines && !!lines.length);
            },

            isBlurred: function()
            {
                return blurred;
            },

            isCleared: function()
            {
                return cleared;
            },

            getStatus: function()
            {
                if(blurred && cleared) return 'new';
                else if(!blurred && cleared) return 'clean';
                else if(blurred && !cleared) return 'updated';
                else return '';
            },

            draw: function(img)
            {
                context.drawImage(img, 0, 0);
            },

            _isSignatureEqual: function(first, second)
            {
                if (first && first.length != second.length){return false;}
                return (JSON.stringify(first) == JSON.stringify(second));
            },

            _linesPush: function(p)
            {
                if(p){
                    lines[lines.length - 1].push(p);
                } else {
                    lines.push([]);
                }
            }
        };
    };
   
    var popup = {
        
        show: function(e)
        {
            var container = $('<div />', {'class': 'popup_signature'})
                .css('width',  def.canvas.width+'px')
                .css('height', def.canvas.height+'px');
            var canvas = $('<canvas />')
                .attr('width',  def.canvas.width)
                .attr('height', def.canvas.height);

           
            var signature = $(e.target.parentNode).data('signature').context;
            //grab the context from your destination canvas
            var ctx = signature_context(canvas[0], def.canvas);
            //call its drawImage() function passing it the source canvas directly
            ctx.draw(e.target);
            //ctx.populate(signature.getLines());

            // TODO: There has to be the way to reload this methods
            var callback = {
                ok: function(e){
                    console.log('The signature is signed');
                    // TODO: Store the new lines into appropriated signature
                    //       Must decide if there should be:
                    //         - adding additional lines to existed ones
                    //         - replacing existed lines by new ones
                    //         - removing all old lines (clean signature)
                    //       And refresh it
                    switch(ctx.getStatus()){
                        case 'new':
                            signature.populate(ctx.getLines());
                            break;
                        case 'updated':
                            signature.update(ctx.getLines());
                            break;
                        case 'clean':
                            signature.clear();
                            break;
                        default:
                            break;
                    }

                    popup.hide(e);
                },
                cancel: function(e){
                    console.log('The signature was closed');
                    popup.hide(e);
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

            canvas = canvas[0];
            var listener = {
                getXY: function(e)
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
            
                startCapture: function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    document.body.theSig = this;
                
                    //IJS.addEvent('move', signature.getCanvas(), moveEvent);
                    //IJS.addEvent('out',   signature.getCanvas(), handleOut);
                    //IJS.addEvent('stop',  signature.getCanvas(), stopCapture);
                    canvas.addEventListener('mousemove', listener.moveEvent, false);
                    canvas.addEventListener('touchmove', listener.moveEvent, false);
                    canvas.addEventListener('mouseup',   listener.stopCapture,   false);
                    canvas.addEventListener('touchend',  listener.stopCapture,   false);

                    document.body.addEventListener('mouseup',  listener.stopCapture, false);
                    document.body.addEventListener('touchend', listener.stopCapture, false);

                    var p = listener.getXY(e);
                    ctx.start(p);
                    
                    return true;
                },
                
                stopCapture: function(e)
                {
                    ctx.close();
                    //IJS.removeEvent('move', signature.getCanvas(), moveEvent);
                    //IJS.removeEvent('out',  signature.getCanvas(), handleOut);
                    //IJS.removeEvent('stop', signature.getCanvas(), stopCapture);
                    canvas.removeEventListener('mousemove', listener.moveEvent, false);
                    canvas.removeEventListener('touchmove', listener.moveEvent, false);
                    canvas.removeEventListener('mouseup',   listener.stopCapture,   false);
                    canvas.removeEventListener('touchend',  listener.stopCapture,   false);
                    
                    document.body.removeEventListener('mouseup',  listener.stopCapture, false);
                    document.body.removeEventListener('touchend', listener.stopCapture, false);
                },
                
                moveEvent: function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    
                    var p = listener.getXY(e);
                
                    if (typeof(document.body.theSig) == 'boolean')
                    {
                        listener.stopCapture(e);
                        return true;
                    }
                
                    ctx.addPoint(p);
                    return true;
                },
        
                handleOut: function(e)
                {
                    e.preventDefault();
                    
                    //save current line and empty stack
                    if (document.body.theSig)
                    {
                        var p = listener.getXY(e);
                        //signature.addPoint(p);
                        ctx.start();
                    };
                
                    //IJS.addEvent('stop', document.body, function(e){this.theSig = false;});
                    document.body.addEventListener('mouseup',  function(e){this.theSig = false;});
                    document.body.addEventListener('touchend', function(e){this.theSig = false;});
                }
            };

            //IJS.addEvent('start', signature.getCanvas(), startCapture);
            canvas.addEventListener('mousedown',  listener.startCapture, false);
            canvas.addEventListener('touchstart', listener.startCapture, false);
        },

        hide: function(e)
        {
            //document.body.removeEventListener('mouseup',  listener.stopCapture, false);
            //document.body.removeEventListener('touchend', listener.stopCapture, false);
            $('div.popup_signature').remove();
        }
    };
    
    
    var methods = {
        init: function(options)
        {
            options = $.extend({}, def, options);
            return this
                .each(function(){
                    var $this = $(this),
                    //data = $this.data('signature');
                    options = $.extend({}, def, $this.data('signature'), options);
                    var size = {width: options.canvas.width  / options.canvas.scale,
                                height: options.canvas.height / options.canvas.scale};
                    var canvas = $('<canvas />', {style:  'width:'+size.width+'px;height:'+size.height+'px;'})
                        .attr('width',  options.canvas.width)
                        .attr('height', options.canvas.height);
                    $this.append(canvas)
                        .addClass('signature')
                        .click(popup.show);
                    
                    options.context = signature_context(canvas[0],
                                                        options.canvas,
                                                        function(context){
                                                            if(context.isSigned()){
                                                                $this.addClass('signed');
                                                            } else {
                                                                $this.removeClass('signed');
                                                            }
                                                        });
                    options.context.populate(options.lines);
                          
                    $this.data('signature', options);
                    
                });
        },

        destroy: function()
        {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('signature');
                
                // Namespacing FTW
                $(window).unbind('.signature');
                data.signature.remove();
                $this.removeData('signature');
                
            });
            
        },
        
        populate:   function(lines) {},
        show: function() {},
        hide: function() {},
        update: function(content) {}
    };
    
    $.fn.signature = function(method)
    {
        if (methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.signature');
        }
    };
    
    /*
     * Class and Function
     */
    /*
      var MyClass = function(el){
      var $el = $(el);
      
      // Put all class stuff here
      
      
      // Attach the instance of this object
      // to the jQuery wrapped DOM node
      $el.data('MyClass', this);
      };
      
      $.fn.signature = function(method)
      {
      return this.each(function(){
      (new ClassSignature(this));
      });
      };
    */
    
})( jQuery );
