var webInvoke = function(url,method,headers,payload){
	var getHttpObject = function(){ 
		var objXMLHttp=null;
		if (window.XMLHttpRequest){
			objXMLHttp=new XMLHttpRequest();
		}else if (window.ActiveXObject){
			objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		return objXMLHttp;
	};

	return new Promise(function(resolve, reject){
		var xmlHttp = getHttpObject();
		xmlHttp.open(method,url,true);

		if(headers && headers.length && headers.length > 0){
			headers.forEach(function(header){
				xmlHttp.setRequestHeader(header.name, header.value);
			});
		}

		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState==4 || xmlHttp.readyState=="complete"){
				if(xmlHttp.status > 399){
					reject(xmlHttp.statusText);
				}else{
					resolve(xmlHttp.responseText);
				}
			}
		}

		xmlHttp.onerror = function(){
			reject(Error("Network error"));
		};

		xmlHttp.send(payload);
	});
};

var get = function(url,headers){
	return webInvoke(url,"GET",headers);
};
var webdelete = function(url,headers){
	return webInvoke(url,"DELETE",headers);
};
var post = function(url, headers, payload){
	return webInvoke(url, "POST", headers, payload);
};
var put = function(url, headers, payload){
	return webInvoke(url, "PUT", headers, payload);
};
var patch = function(url, headers, payload){
	return webInvoke(url, "PATCH", headers, payload);
};

(function(){
var app = new Vue({
	el: '#app',
	data: {
		weather:"I don't know yet",
		longitude:0,
		latitude:0
	},
	"methods":{
		"getWeather":function(){
			get("https://api.weather.gov/points/"+this.latitude+","+this.longitude).then(
				function(response){
					var rsp = JSON.parse(response);
					get(rsp.properties.forecast).then(
						function(response){
							var weathData = JSON.parse(response);
							app.weather = weathData.properties.periods[0].detailedForecast;
						},
						function(error){
							app.weather = "Could not get weather data at "+rsp.properties.forecast;
						}
					);
				},
				function(error){
					app.weather = "Could not get data: "+error;
				}
			);
		}
	}
});
})();
