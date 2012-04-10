(function($){
    
    var def = {canvas: {width: 400, height: 200, scale: 2, lineWidth: 1, lineCap: 'round', fillStyle: '#fff', strokeStyle: '#444'},
               lines:[]};
    
    var context = function(canvas, options)
    {
        var lines               = [],
            blured              = false,
            context             = canvas.getContext('2d');
            context.lineWidth   = options.lineWidth   || 1;
            context.lineCap     = options.lineCap     || "round";
            context.fillStyle   = options.fillStyle   || "#fff";
            context.strokeStyle = options.strokeStyle || "#444";
        
        return {
            
            populate: function(_lines)
            {
                if(!this._isSignatureEqual(lines, _lines)){
                    //signature blured
                }
                
                this.clear();
                if(_lines && _lines.length){
                    var lines_number = _lines.length;
                    for(var line = 0; line < lines_number; line++){
                        var points_number = _lines[line].length;
                        if(points_number){
                            this.start({x: _lines[line][0], y: _lines[line][1]});
                            for(var point = 2; point < points_number; point += 2){
                                this.addPoint({x: _lines[line][point], y: _lines[line][point+1]});
                            }
                            this.close();
                        }
                    }
                }
                
                lines = _lines;                
            },
            
            clear: function()
            {
                lines = [];
                context.clearRect(0, 0, $(canvas).width(), $(canvas).height());
                blured = true;
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
                blured = true;
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

            isBlured: function()
            {
                return blured;
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
            
            var signature = e.target.parentNode;
            //grab the context from your destination canvas
            var ctx = context(canvas[0], def.canvas);
            //call its drawImage() function passing it the source canvas directly
            ctx.draw(e.target);
                       
            // TODO: There has to be the way to reload this methods
            var callback = {
                ok: function(e){
                    console.log('The signature is signed');
                    // TODO: Store the new lines into appropriatted signature
                    //       Must decide if there should be:
                    //         - adding additional lines to existed ones
                    //         - replacing existed lines by new ones
                    //         - removing all old lines (clean signature)
                    //       And refresh it
                    if(ctx.isBlured()){
                        $(signature).data('signature').context.populate(ctx.getLines());
                    }

                    // TODO: Think, how to replace it into event handler
                    if($(signature).data('signature').context.isSigned()){
                        $(signature).addClass('signed');
                    } else {
                        $(signature).removeClass('signed');
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
        },

        hide: function(e)
        {
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
                        .css('width',  size.width+'px')
                        .css('height', size.height/2 +'px')
                        .addClass('signature')
                        .click(popup.show);
                    
                    options.context = context(canvas[0], options.canvas);
                    options.context.populate(options.lines);
                    
                    if(options.context.isSigned()){
                        $this.addClass('signed');
                    } else {
                        $this.removeClass('signed');
                    }
                    
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
