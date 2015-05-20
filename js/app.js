cjs.methods.helloWorld = {
	remotedata: "http://localhost/test.json",
	localdata: {
		foo: "world"
	},
	render: function(element,data) {

		var template = Handlebars.compile( element.querySelector('[data-template=hb]').innerHTML );
		return template(data);
		
	}
};

cjs.methods.goodbyeWorld = {
	localdata: {
		foo: "bar"
	},
	render: function(element,data) {
		
		var template = Handlebars.compile( element.querySelector('[data-template=hb]').innerHTML );
		return template(data);
		
	}
};

cjs.methods.getInfo = {
	localdata: {
		ver: "0.0.1",
		name: "CJS"
	},
	render: function(element,data) {
		
		var template = Handlebars.compile( element.innerHTML );
		return template(data);
		
	}
};


cjs.init();