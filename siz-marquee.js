var gParams;

var sizmarquee = function () {

	var activeSlide = -1,
		intervalTimer,
		l$;

	loadImage = function(position) {
		gParams.images[position].img = new Image();
		gParams.images[position].img.onload = function() { imageLoaded(position) };
		gParams.images[position].img.src = gParams.images[position].src;

	}
	
	imageLoaded = function (position) {// Called when an image is loaded
		gParams.images[position].loaded = true;
		if (position === 0 && typeof gParams.onFirstLoad !== 'undefined') {
			gParams.onLoad(0);
			gParams.onFirstLoad();
		} else {
			gParams.onLoad(position);
		}
		if (position === 1) intervalTimer = setInterval(function () { advance(); }, gParams.interval);
		++position < gParams.images.length ? loadImage(position) : allLoaded();
	}
	
	allLoaded = function() {
		if (typeof gParams.onLastLoad !== 'undefined') {
			gParams.onLastLoad();
		}
	}
	
	initialize = function (library, params) {
	
		l$ = library;
		gParams = params;

		for (i=0, j=gParams.images.length; i<j; i++) {
			gParams.images[i].loaded = false;
		}
		
		if (!window.addEventListener) {
			window.attachEvent('blur', function() {window.clearInterval(intervalTimer);});
			window.attachEvent('focus', function() {intervalTimer = setInterval(function () { advance(); }, gParams.interval);});
    		} else {
		    window.addEventListener('blur', function() {window.clearInterval(intervalTimer);});
		    window.addEventListener('focus', function() {intervalTimer = setInterval(function () { advance(); }, gParams.interval);});
    		}

		loadImage(0);
	}
	
	next = function () {
		
	}
	
	previous = function() {
		
	}
	
	advance = function() {
		hide(activeSlide);
		getNextSlide();
		show(activeSlide);
	}
	
	jumpTo = function (position) {
		hide(activeSlide);
		window.clearInterval(intervalTimer);
		show(position);
	}
	
	getNextSlide = function() {
		activeSlide++;
		if (gParams.images.length == activeSlide || gParams.images[activeSlide].loaded == false) {
			activeSlide = 0;
		}
	}
	
	show = function (position) {
		gParams.onShow(position);
		activeSlide = position;
	}

	hide = function (position) {
		gParams.onHide(position);
	}
		
	/******************************************************************************/
	/*********************************** EASING ***********************************/
	/******************************************************************************/

	easing = {
		linear: function (p) {
			return p;
		},
		swing: function (p) {
			return (-Math.cos(p * Math.PI) / 2) + 0.5;
		}
	};

	baseEasings = {
		Sine: function (p) {
			return 1 - Math.cos(p * Math.PI / 2);
		},
		Circ: function (p) {
			return 1 - Math.sqrt(1 - p * p);
		},
		Elastic: function (p) {
			return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
		},
		Back: function (p) {
			return p * p * (3 * p - 2);
		},
		Bounce: function (p) {
			var pow2,
				bounce = 4;

			while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
			return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
		}
	};

	jQuery.each([ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function (i, name) {
		baseEasings[name] = function (p) {
			return Math.pow(p, i + 2);
		};
	});

	jQuery.each(baseEasings, function (name, easeIn) {
		easing["easeIn" + name] = easeIn;
		easing["easeOut" + name] = function (p) {
			return 1 - easeIn(1 - p);
		};
		easing["easeInOut" + name] = function (p) {
			return p < 0.5 ? easeIn(p * 2) / 2 : easeIn(p * -2 + 2) / -2 + 1;
		};
	});
	
	return {
		init: initialize,
		easing: easing
	};

}();  
  