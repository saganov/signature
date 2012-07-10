(function($){
    
    var def = {canvas: {width: 400, height: 200, scale: 2, lineWidth: 1, lineCap: 'round', fillStyle: '#fff', strokeStyle: '#444'},
               lines:[]};
   
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
                    var top = (size.height/2 - size.height) / 2;
                    var canvas = $('<canvas />', {style:  'width:'+size.width+'px;height:'+size.height+'px;'})
                        .attr('width',  options.canvas.width)
                        .attr('height', options.canvas.height);
                    $this.append(canvas)
                        .addClass('signature')
                        .click({signature: $this}, $signature.popup.show);
                    
                    options.context = $signature.context(canvas[0],
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
