(function($){

     var def = {canvas: {width: 200, height: 100}, lines:[]};

     var _populate = function(el, lines)
     {
         var $this = $(el);
         if(!_isSignatureEqual($this.data('signature').lines, lines)){
             //signature blured
         }
         
         $this.data('signature').lines = lines;
     };

     var _isSignatureEqual = function(first, second)
     {
         if (first && first.length != second.length){return false;}
         return (JSON.stringify(first) == JSON.stringify(second));
     };

     var _isSigned = function(el)
     {
         return ($(el).data('signature').lines && !!$(el).data('signature').lines.length);
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
                           $this.append($('<canvas />',
                                          {width:  options.canvas.width,
                                           height: options.canvas.height}))
                               .css('width',  options.canvas.width  +'px')
                               .css('height', options.canvas.height/2 +'px')
                               .addClass('signature');
                           
                           _populate(this, options.lines);
                           
                           if(_isSigned(this)){
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
         isSigned:   function() {},
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
