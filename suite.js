new Suite({

'Sizes': function(next) {
	next({
		screen: [window.screen.width, window.screen.height],
		inner: [window.innerWidth, window.innerHeight],
		scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight]
	});
},

'CORS Xhr': function(next) {
	var req = new XMLHttpRequest();
	req.open('GET', 'http://updates.html5rocks.com/', true);
	req.onload = function() {
		if (req.responseText) {
			next('OK ' + req.status);
		} else {
			next('FAIL (no content)');
		}
	};
	req.onerror = req.onabort = function() {
		next('FAIL (onerror)');
	};
	try {
		req.send();
		next('Running');
	} catch(e) {
		next('FAIL (send)');
	}
},

'SystemXhr': function(next) {
	var req = new XMLHttpRequest({
		mozSystem: true,
		mozAnon: true
	});
	req.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?address=Castro+Str,+Mountain+View,+CA&sensor=false', true);
	req.onload = function() {
		try {
			var resp = JSON.parse(req.responseText);
		} catch(e) {}
		if (resp) {
			next('OK ' + resp.results.length);
		} else {
			next('FAIL (no content)');
		}
	};
	req.onerror = req.onabort = function() {
		next('FAIL (onerror)');
	};
	try {
		req.send();
		next('Running');
	} catch(e) {
		next('FAIL (send)');
	}
},

'Resize Event': function(next, suite) {
	window.onresize = function() {
		suite.tests['Sizes'](next);
	};
},

'Orientation': function(next) {
	next({
		'orientation': window.orientation
	});
},

'OrientationChange Event': function(next, suite) {
	window.onorientationchange = function() {
		suite.tests['Orientation'](next);
	};
},

'DeviceOrientation Event': function(next, suite) {
	window.ondeviceorientation = function(evt) {
		next({
			absolute: evt.absolute | 0,
			alpha: evt.alpha | 0,
			beta: evt.beta | 0,
			gamme: evt.gamma | 0
		});
	};
},

'TouchStart Event': function(next, suite) {
	document.ontouchstart = function(evt) {
		next({
			length: evt.touches.length,
			touch0: evt.touches[0]
		});
	};
},

'MouseDown Event': function(next, suite) {
	document.onmousedown = function(evt) {
		next([evt.screenX, evt.screenY]);
	};
},

'DeviceMotion Event': function(next, suite) {
	window.ondevicemotion = function(evt) {
		var result = {
			interval: evt.interval
		};
		if (evt.accelerationIncludingGravity) {
			result.includingGravityX = evt.accelerationIncludingGravity.x | 0;
			result.includingGravityY = evt.accelerationIncludingGravity.y | 0;
			result.includingGravityZ = evt.accelerationIncludingGravity.z | 0;
		}
		if (evt.acceleration) {
			result.x = evt.acceleration.x | 0;
			result.y = evt.acceleration.y | 0;
			result.z = evt.acceleration.z | 0;
		}
		if (evt.acceleration) {
			result.alpha = evt.rotationRate.alpha | 0;
			result.beta = evt.rotationRate.beta | 0;
			result.gamma = evt.rotationRate.gamma | 0;
		}
		next(result);
	};
},

'Apps getSelf': function(next) {
	var request = navigator.mozApps.getSelf();
	request.onsuccess = request.onerror = function() {
		if (request.result) {
			next(request.result);
		} else {
			next(request.error || new Error('No .result'));
		}
	}
},

'Apps install': function(next) {
	return function() {
		var manifestUrl = location.href.replace(/[^\/]*$/, 'manifest.webapp');
		next(manifestUrl);
		var request = navigator.mozApps.install(manifestUrl);
		request.onsuccess = request.onerror = function() {
			if (request.result) {
				next(request.result);
			} else {
				next(request.error || new Error('No .result'));
			}
		};
	};
},

'Apps installPackage': function(next) {
	return function() {
		var manifestUrl = location.href.replace(/[^\/]*$/, 'package.webapp');
		next(manifestUrl);
		var request = navigator.mozApps.installPackage(manifestUrl);
		request.onsuccess = request.onerror = function() {
			if (request.result) {
				next(request.result);
			} else {
				next(request.error || new Error('No .result'));
			}
		};
	};
},

'UserAgent': function(next) {
	next(navigator.userAgent);
},

'Locationbar Visible': function(next, suite) {
	next(window.locationbar.visible);
}

});