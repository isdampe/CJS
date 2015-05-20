(function(window){
	
	var domRoot;
	
	this.status = 0;
	this.controllers = {};
	this.methods = {};
	
	this.init = function() {
		
		var traverseObj, i, max, controller;
		
		//Loop through DOM and find all controllers.
		domRoot = document.querySelector("[data-cjs=root]");
		if ( domRoot === false ) {
			this.status = -1;
			return;
		}
		
		traverseObj = document.querySelectorAll("[data-controller]");
		if ( traverseObj ) {
			max = traverseObj.length;
			i = 0;
			for ( i; i<max; i++ ) {
				controller = traverseObj[i].getAttribute("data-controller");
				cjs.controllers[controller] = {
					controller: controller,
					element: traverseObj[i]
				};
				if (! cjs.methods.hasOwnProperty(controller) ) {
					console.log("ERR: Controller with no method called: " + controller);
				} else {
					
					cjs.executeController( cjs.methods[controller], cjs.controllers[controller] );
					
				}
			}
		}
		
	};
	
	this.executeController = function( method, controller ) {
		
		var data = {}, remoteData, url, templateWrapper = controller.element.querySelector('[data-template]');
		
		controller.element.classList.add("cjs-loading");
		
		//Local data.
		if ( method.hasOwnProperty("localdata") ) {
			data = cjs.concatObject( method.localdata, data );
		}
		
		//Fetch data if required.
		if ( method.hasOwnProperty("remotedata") ) {
			url = method.remotedata;
		}
		
		if ( url ) {
			cjs.remoteData(url, data, method, controller, function(data,method,controller){
				
				var templateWrapper = controller.element.querySelector('[data-template]');
				
				data = cjs.concatObject( method.remotedata, data );
				
				//Callback to render with data.
				if ( templateWrapper ) {
					templateWrapper.innerHTML = method.render( controller.element, data );
				} else {
					controller.element.innerHTML = method.render( controller.element, data );
				}
				controller.element.classList.remove("cjs-loading");
				
			});
			
			return;
		}
		
		//Callback to render with data.
		if ( templateWrapper ) {
			templateWrapper.innerHTML = method.render( controller.element, data );
		} else {
			controller.element.innerHTML = method.render( controller.element, data );
		}
		controller.element.classList.remove("cjs-loading");
		
	};
	
	this.remoteData = function(url, data, method, controller, callback) {
		
		//Fetch remote content.
		cjs.fetchJson(url, function( remoteData ){
			
			if ( remoteData ) {
				data = cjs.concatObject( remoteData, data );
			}
			
			//Send it back to client.
			callback(data,method,controller);
			
		});
		
	};
	
	this.fetchJson = function(url,callback) {
		
		var remoteData = false;
		
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				try {
					remoteData = JSON.parse( request.responseText );
				} catch(e) {
					remoteData = {};
				}
				callback( remoteData );
			} else {
				callback( remoteData );
			}
		};

		request.onerror = function() {
			callback( remoteData );
		};

		request.send();
		
	};
	
	this.concatObject = function( objOne, objTwo ) {
		
		var key;
		
		for ( key in objOne ) {
			objTwo[key] = objOne[key];
		}
		
		return objTwo;
		
	};
	
	window.cjs = this;
	
})(window);