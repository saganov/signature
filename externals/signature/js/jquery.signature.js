(function($){

     var def = {canvas: {width: 200, height: 100, lineWidth: 1, lineCap: 'round', fillStyle: '#fff', strokeStyle: '#444'},
                lines:[]};

     var _populate = function(el, lines)
     {
         var $this = $(el);
         if(!_isSignatureEqual($this.data('signature').lines, lines)){
             //signature blured
         }
  
         _clear(el);
         if(lines && lines.length){
             var lines_number = lines.length;
             for(var line = 0; line < lines_number; line++){
                 var points_number = lines[line].length;
                 if(points_number){
                     _start(el, {x: lines[line][0], y: lines[line][1]});
                     for(var point = 2; point < points_number; point += 2){
                         _addPoint(el, {x: lines[line][point], y: lines[line][point+1]});
                     }
                     _close(el);
                 }
             }
         }

         $this.data('signature').lines = lines;
     };

     var _clear = function(el)
     {
         var $this = $(el);

         $this.data('signature').lines = [];
         $this.data('signature').context.clearRect(0, 0, $this.data('signature').width, $this.data('signature').height);
         return true;
     };
     
     var _start = function(el, p)
     {
         var $this = $(el);

         _linesPush(el);
         $this.data('signature').context.beginPath();
         if (p){
             $this.data('signature').context.moveTo(p.x, p.y);
             _linesPush(el, p);
         }
     };

     var _addPoint = function(el, p)
     {
         var $this = $(el);

         _linesPush(el, p);
         $this.data('signature').context.lineTo(p.x, p.y);
         $this.data('signature').context.stroke();
         return true;
     };

     var _linesPush = function(el, p)
     {
         var $this = $(el);
         
         if(p){
             $this.data('signature').lines[$this.data('signature').lines.length - 1].push(p);
            } else {
                $this.data('signature').lines.push([]);
            }
     };

     var _close = function(el)
     {
         var $this = $(el);
         $this.data('signature').context.stroke();
         $this.data('signature').context.closePath();
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
                           var canvas = $('<canvas />',
                                          {width:  options.canvas.width,
                                           height: options.canvas.height});
                           $this.append(canvas)
                               .css('width',  options.canvas.width  +'px')
                               .css('height', options.canvas.height/2 +'px')
                               .addClass('signature');

                           var context         = canvas[0].getContext('2d');
                           context.lineWidth   = options.canvas.lineWidth;//1
                           context.lineCap     = options.canvas.lineCap;// "round";
                           context.fillStyle   = options.canvas.fillStyle;//"#fff";
                           context.strokeStyle = options.canvas.strokeStyle;//"#444";
                           options.context = context;

                           $this.data('signature', options);
                           
                           _populate(this, options.lines);
                           
                           if(_isSigned(this)){
                               $this.addClass('signed');
                           } else {
                               $this.removeClass('signed');
                           }
                           
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
