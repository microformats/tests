var helper = {};
helper.parseHTML = function(htmlFragment,baseUrl){
   	
   	// allow v1 parsing
	HParse.settings({ 
		parseV1Microformats: true, 
	});

	// create an element without attach it to the dom
   	var div  = document.createElement('div')
   	div.innerHTML = htmlFragment;
	var result =  HParse.parse(div)
	return {"items": result}

}