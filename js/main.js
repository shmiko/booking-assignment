// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
		|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); },
		timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());

// Classing.js
// fallback for browser that don't support classList
// by Jeremias Menichelli - https://github.com/jeremenichelli/classing
(function(){
	'use strict';
	// Object to prototype
	var els = (typeof HTMLElement !== "undefined") ? HTMLElement : Element;

	// Given an element, converts classes into an array
	var _classToArray = function(el){
		return el.getAttribute('class').split(/\s/);
	}
	// Given an array, returns a string
	var _arrayToClass = function(cs){
		var nc = "";
		for (var i = 0; i < cs.length; i++) {
			nc += cs[i];
			if (i != cs.length-1) nc += " ";
		};
		return nc
	}
	// Checks if an element has a class
	var _hasClass = function(el, c){
		var cs = _classToArray(el);
		var flag = false;
		for (var i = 0; i < cs.length; i++) {
			if(cs[i] == c) flag = true;
		};
		return flag
	}
	// Adds a class (if there's not already there)
	var _addClass = function(el, c){
		if(!_hasClass(el, c)){
			var nc = el.getAttribute('class')+" "+c;
			el.setAttribute('class', nc);
		}
	}
	// Removes a class (if it's there)
	var _removeClass = function(el, c){
		if(_hasClass(el, c)){
			var cs = _classToArray(el);
			for (var i = 0; i < cs.length; i++) {
				if(cs[i] == c){
					cs.splice(i,1);
				}
			};
			el.setAttribute('class', _arrayToClass(cs));
		}
	}
	// Toggles a class in an element
	var _toggleClass = function(el, c){
		_hasClass(el, c) ? _removeClass(el, c) : _addClass(el, c);
	}
	
	if(document.documentElement.classList){
		els.prototype.hasClass = function(c){
			return this.classList.contains(c);
		}

		els.prototype.addClass = function(c){
			this.classList.add(c);
		}

		els.prototype.removeClass = function(c){
			this.classList.remove(c);
		}

		els.prototype.toggleClass = function(c){
			this.classList.toggle(c)
		}
	} else {
		els.prototype.hasClass = function(c){
			return _hasClass(this, c);
		}

		els.prototype.addClass = function(c){
			_addClass(this, c);
		}

		els.prototype.removeClass = function(c){
			_removeClass(this, c);
		}

		els.prototype.toggleClass = function(c){
			_toggleClass(this, c);
		}
	}
})();

// EVENTUALLY
// by Jeremias Menichelli (http://github.com/jeremenichelli/eventually)
(function(){
	'use strict';
	// Object to prototype
	var els = (typeof HTMLElement !== "undefined") ? HTMLElement : Element;

	if(document.documentElement.addEventListener){
		els.prototype.addEvent = function(ev, fn){
			this.addEventListener(ev, fn, false);
		}

		els.prototype.removeEvent = function(ev, fn){
			this.removeEventListener(ev, fn, false);
		}
	} else {
		if(!Event.prototype.preventDefault) {
			Event.prototype.preventDefault = function() {
				this.returnValue = false;
			}
		}

		if (!Event.prototype.stopPropagation) {
		    Event.prototype.stopPropagation=function() {
		      this.cancelBubble=true;
		    };
		  }

		els.prototype.addEvent = function(ev, fn){
			this.attachEvent("on"+ev, fn);
		}
		
		els.prototype.removeEvent = function(ev, fn){
			this.detachEvent("on"+ev, fn);
		}
	}
})();

// Main scripts
var HotelApp = HotelApp || {};

(function(document, undefined){
	// new app
	HotelApp.sorting = (function(){
		var _asc = function(arr, key){
			arr.sort(function(a, b){
				var a = a[key];
				var b = b[key];
				if (a < b)
					return 1;
				if (a > b)
					return -1;
				// a must be equal to b
				return 0;
			});
			return arr;
		};

		var _desc = function(arr, key){
			arr.sort(function(a, b){
				var a = a[key];
				var b = b[key];
				if (a > b)
					return 1;
				if (a < b)
					return -1;
				// a must be equal to b
				return 0;
			});
			return arr;
		};

		return {
			asc : _asc,
			desc : _desc
		}
	})();
})(document, undefined);

(function(document, undefined){
	// Carousel logic
	HotelApp.carousel = (function(){
		// Carousel properties
		var count = 0, currentPosition = 0, loopInterval = 500, carousel, carouselElements, carouselElementsLength
			, carouselThumbs, carouselThumbsLength;

		// Carousel methods
		var _init = function(obj){
			if (obj) {
				//setting elements
				carousel = obj;
				carouselElements = _getElements(carousel);
				carouselElementsLength = carouselElements.length;
				carouselThumbs = _getThumbs(carousel);
				carouselThumbsLength = carouselThumbs.length;

				// setting events
				carousel.querySelector('#next').addEvent('click', function(e){
					e.preventDefault();
					count = 0;
					_goToNextElement();
				});

				carousel.querySelector('#prev').addEvent('click', function(e){
					e.preventDefault();
					count = 0;
					_goToPrevElement();
				});

				for (var i = 0; i < carouselThumbsLength; i++) {
					carouselThumbs[i].addEvent('click', function(e){
						e.preventDefault();
						var index = parseInt(e.currentTarget.getAttribute('data-carousel-thumb'));
						_goToElement(index);
					});
				};

				// start loop
				_loop();
			} // executes only if carousel object isn't null
		}

		var _getElements = function(obj){
			return obj.querySelectorAll('.carousel-images li');
		} 

		var _getThumbs = function(obj){
			return obj.querySelectorAll('.carousel-thumbs li a')
		}

		var _goToNextElement = function(){
			carouselElements[currentPosition].removeClass('active');
			carouselThumbs[currentPosition].removeClass('active');
			currentPosition++;
			if (currentPosition == carouselElementsLength) {
				currentPosition = 0;
			}
			carouselElements[currentPosition].addClass('active');
			carouselThumbs[currentPosition].addClass('active');
		}

		var _goToPrevElement = function(){
			carouselElements[currentPosition].removeClass('active');
			carouselThumbs[currentPosition].removeClass('active');
			currentPosition--;
			if (currentPosition < 0) {
				currentPosition = carouselElementsLength-1;
			}
			carouselElements[currentPosition].addClass('active');
			carouselThumbs[currentPosition].addClass('active');
		}

		var _goToElement = function(index){
			carouselElements[currentPosition].removeClass('active');
			carouselThumbs[currentPosition].removeClass('active');
			currentPosition = index;
			count = 0;
			carouselElements[currentPosition].addClass('active');
			carouselThumbs[currentPosition].addClass('active');
		}

		var _loop = function(){
			// recursive function
			var repeatOften = function(){
				if (count == loopInterval) {
					count = 0;
					_goToNextElement();
				} else {
					count++;
				}
				requestAnimationFrame(repeatOften)
			}
			// rAF call
			repeatOften();
		}

		return {
			init : _init
		}
	})();

	// Reviews pagination
	HotelApp.pages = (function(){
		var reviews, reviewsLength, maxPage, currentPage = 0, elementsByPage = 5;

		var _init = function(arr){
			// Paginator elements
			reviews = arr;
			reviewsLength = reviews.length;
			maxPage = Math.ceil(reviewsLength/elementsByPage)-1;

			for (var i = 0; i < elementsByPage; i++) {
				reviews[i].style.display = 'block';
			};
			
			// Paginator events
			document.getElementById('next-page').addEvent('click', function(e){
				e.preventDefault();
				_goToNextPage();
			});

			document.getElementById('prev-page').addEvent('click', function(e){
				e.preventDefault();
				_goToPrevPage();
			});

		}

		var _goToNextPage = function(){
			if (maxPage != currentPage) {
				currentPage++;
				var min = currentPage*elementsByPage;
				var max = (currentPage+1)*elementsByPage;
				for (var i = 0; i < reviewsLength; i++) {
					if (i >= min && i < max) {
						reviews[i].style.display = "block"
					} else {
						reviews[i].style.display = "none"
					}
				}	
			}
			_disableButtons();
		}

		var _goToPrevPage = function(){
			if (currentPage > 0) {
				currentPage--;
				var min = currentPage*elementsByPage;
				var max = (currentPage+1)*elementsByPage;
				for (var i = 0; i < reviewsLength; i++) {
					if (i >= min && i < max) {
						reviews[i].style.display = "block"
					} else {
						reviews[i].style.display = "none"
					}
				}				
			}
			_disableButtons();
		}

		var _reset = function(arr){
			_updateArray(arr);
			currentPage = 0;
			for (var i = 0; i < reviewsLength; i++) {
				if (i < 5) {
					reviews[i].style.display = 'block';
				} else {
					reviews[i].style.display = 'none';
				}
			};
			_disableButtons();
		}

		var _updateArray = function(elem){
			reviews = elem;
		}

		var _disableButtons = function(){
			if (currentPage == 0) {
				document.getElementById('prev-page').addClass('disabled');
				document.getElementById('next-page').removeClass('disabled');
			} else if (currentPage == maxPage) {
				document.getElementById('next-page').addClass('disabled');
			} else {
				document.getElementById('prev-page').removeClass('disabled');
				document.getElementById('next-page').removeClass('disabled');
			}
		}

		return {
			init : _init,
			reset : _reset
		}
	})();

	// Data request
	HotelApp.ajax = function(type, url, onsuccess){
		var httpRequest, response;
		if (window.XMLHttpRequest) {
		    httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
		    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		httpRequest.onreadystatechange = function(){
			if (httpRequest.readyState == 4){
			    response = httpRequest.responseText;
			    if (typeof onsuccess == 'function'){
			    	onsuccess(response);
			    }
			}
		};
		httpRequest.open('GET', url, true);
		httpRequest.send(null);
	}
})(document, undefined);


// GET Json data
var getDomain = function(){
	var arr = window.location.href.split('/');
	arr.splice(arr.length-1);
	return arr.join('/');
}

baseURL = getDomain();

// knockout ViewModel
function HotelViewModel(){
	self = this;

	//rooms table
	self.rooms = ko.observableArray([
		{	"name" : "Basic 2 Bed",
			"occupancy" : 2,
			"price" : 88.99,
		},
		{	"name" : "Basic Family Room",
			"occupancy" : 4,
			"price" : 98.99,
		},
		{	"name" : "Deluxe 2 Bed",
			"occupancy" : 2,
			"price" : 109.99,
		},
		{	"name" : "Deluxe Family Room",
			"occupancy" : 7,
			"price" : 112.99,
		},
		{	"name" : "Deluxe 2 Bed",
			"occupancy" : 2,
			"price" : 109.99,
		},
		{	"name" : "Bridal Suite",
			"occupancy" : 2,
			"price" : 167.99,
		},
		{	"name" : "President Suite",
			"occupancy" : 2,
			"price" : 301.99,
		},
		{	"name" : "One+One",
			"occupancy" : 2,
			"price" : 78.99,
		},
		{	"name" : "Single Room",
			"occupancy" : 1,
			"price" : 28.99,
		},
		{	"name" : "Queen Room",
			"occupancy" : 2,
			"price" : 99.99,
		},
		{	"name" : "Basement 1 Bed",
			"occupancy" : 1,
			"price" : 9.99,
		},
		{	"name" : "Mega XL Suite",
			"occupancy" : 9,
			"price" : 412.99,
		}
	]);

	// sorting events
	document.getElementById('asc-occupancy').addEvent('click', function(e){
		e.preventDefault();
		self.rooms(HotelApp.sorting.asc(self.rooms(), 'occupancy'));
	});

	document.getElementById('desc-occupancy').addEvent('click', function(e){
		e.preventDefault();
		self.rooms(HotelApp.sorting.desc(self.rooms(), 'occupancy'));
	});

	document.getElementById('asc-price').addEvent('click', function(e){
		e.preventDefault();
		self.rooms(HotelApp.sorting.asc(self.rooms(), 'price'));
	});

	document.getElementById('desc-price').addEvent('click', function(e){
		e.preventDefault();
		self.rooms(HotelApp.sorting.desc(self.rooms(), 'price'));
	});

	// hotels
	self.hotels = ko.observableArray([]);
	HotelApp.ajax('GET', baseURL+'/data/hotels.json', function(data){
		data = JSON.parse(data);
		var len = data.Hotels.length;
		for (var i = 0; i < len; i++) {
			var stars = data.Hotels[i].stars;
			data.Hotels[i].starsString = "";
			for (var j = 0; j < stars; j++) {
				data.Hotels[i].starsString += "★"
			};
			self.hotels.push(data.Hotels[i]);
		};
	});
	
	//reviews
	self.reviews = ko.observableArray([]);
	HotelApp.ajax('GET', baseURL+'/data/reviews.json', function(data){
		data = JSON.parse(data);
		var len = data.Reviews.length;
		for (var i = 0; i < len; i++) {
			self.reviews.push(data.Reviews[i]);
		};
		// init pagination
		HotelApp.pages.init(document.querySelectorAll('.one_review'));
		
		// sorting events
		document.getElementById('asc-reviews').addEvent('click', function(e){
			e.preventDefault();
			self.reviews(HotelApp.sorting.asc(self.reviews(), 'points'));
			HotelApp.pages.reset(document.querySelectorAll('.one_review'));
		});

		document.getElementById('desc-reviews').addEvent('click', function(e){
			e.preventDefault();
			self.reviews(HotelApp.sorting.desc(self.reviews(), 'points'));
			HotelApp.pages.reset(document.querySelectorAll('.one_review'));
		});
	});

	//landmarks
	self.landmarks = ko.observableArray([]);
	HotelApp.ajax('GET', baseURL+'/data/landmarks.json', function(data){
		data = JSON.parse(data);
		var len = data.Landmarks.length;
		for (var i = 0; i < len; i++) {
			self.landmarks.push(data.Landmarks[i]);
		};
	});
}
ko.applyBindings(new HotelViewModel());


window.onload = function(){
	// init carousel
	var carouselObj = document.getElementById('carousel');
	HotelApp.carousel.init(carouselObj);

	// events for table selects
	var selects = document.querySelectorAll('.room-select');
	var selectsLength = selects.length;
	var prices = document.querySelectorAll('.room_price span');
	var subtotals = document.querySelectorAll('.room_subtotal span');

	for (var i = 0; i < selectsLength; i++) {
		selects[i].index = i;
		selects[i].addEvent('change', function(e){
			var subtotal = parseFloat(prices[e.currentTarget.index].innerHTML)*parseFloat(e.currentTarget.value);
			subtotals[e.currentTarget.index].innerHTML = subtotal.toFixed(2);
		})
	};
}