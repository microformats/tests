var helper = {};
helper.parseHTML = function(htmlFragment,baseUrl){
   var request = new XMLHttpRequest();
   var ran = Math.floor(Math.random()*9999999)
   request.open('GET', 'http://waterpigs.co.uk/php-mf2/api/?html=' + encodeURIComponent(htmlFragment) + '&baseurl=' + encodeURIComponent(baseUrl) + '&ran=' + ran, false);
   request.send(); 
   if (request.status === 200) {
     return JSON.parse(request.responseText);
   }else{
      return {};
   }
}