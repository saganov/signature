var example = {
    signatureA: [[1,2,3,4,5,6,7,8,9,10], [30,29,28,27,26,25,24,23,22,21]],
    signatureC: [[11,12,13,14,15,16,17,18,19,10], [80,79,78,77,76,75,74,73,72,71], [30,29,28,27,26,25,24,23,22,21]]
};

$(document)
    .ready(function() {
               $("[data-signature]")
                   .each(function(i, el){
                             var id = $(el).data('signature').id;
                             $(el).data('signature').lines = example[id] || [];
                         });

               $("[data-signature]").signature();
           });
