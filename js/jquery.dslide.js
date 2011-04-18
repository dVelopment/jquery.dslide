/**
* @author: Daniel Holzmann http://d.velopment.at
* @copyright: 2011
* @package jquery.dslide
* @license MIT
*/

/*
Copyright (c) 2011 Daniel Holzmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function ($) {
	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('dslide-data');
					
				if (!data) {
					var settings = {
						cssPrefix: 'dslide-',
						duration: 1,
						frequency: 5,
						autoStart: true,
						overlay: true
					};
					
					var slider = $('<div></div>');
					var leftSlider = $('<div></div>');
					var rightSlider = $('<div></div>');
					var leftImages = [];
					var rightImages = [];
					
					var timer = null;
					
					if (options) {
						$.extend(settings, options);
					}
					
					var images = $(this).find('li > img');
					
					if (images.length == 0)
						return;
					
					//setup slider
					$(this).append(slider);
					slider.addClass(settings.cssPrefix + 'slider');
					
					slider.append(leftSlider);
					slider.append(rightSlider);
					
					leftSlider.addClass(settings.cssPrefix + 'slider-left');
					rightSlider.addClass(settings.cssPrefix + 'slider-right');
					
					for (var i = 0; i < images.length; i++) {
						var sliderDiv = $('<div></div>').addClass(settings.cssPrefix + 'slider-left-div').appendTo(leftSlider);
						if (i > 0)
							sliderDiv.css('display', 'none');
						//move to main slider
						$(images[i]).appendTo(sliderDiv);
						var rightSliderDiv = $('<div></div>').addClass(settings.cssPrefix + 'slider-right-div').appendTo(rightSlider);
						var second = images.length - i - 1;
	/*
						if (second > images.length)
							second = 0;
	*/
						$(images[second]).clone().appendTo(rightSliderDiv);
						rightSliderDiv.data('dslide-data', {target: $this, index: second});
						
						rightSliderDiv.bind('click', click);
						leftImages.push(sliderDiv);
						rightImages.push(rightSliderDiv);
						
					}
					
					//remove ul
					$(this).find('ul').remove();
					
					if (settings.overlay) {
						var overlayTL = $('<div></div>').addClass(settings.cssPrefix + 'overlay').addClass('tl');
						overlayTL.appendTo(slider);
						var overlayTR = $('<div></div>').addClass(settings.cssPrefix + 'overlay').addClass('tr');
						overlayTR.appendTo(slider);
						var overlayBL = $('<div></div>').addClass(settings.cssPrefix + 'overlay').addClass('bl');
						overlayBL.appendTo(slider);
						var overlayBR = $('<div></div>').addClass(settings.cssPrefix + 'overlay').addClass('br');
						overlayBR.appendTo(slider);
					}
					
					$(this).data('dslide-data',{
						target: $this,
						settings: settings,
						slider: slider,
						leftSlider: leftSlider,
						rightSlider: rightSlider,
						leftImages: leftImages,
						rightImages: rightImages,
						timer: timer,
						current: 0,
						currentRight: 0
					});
					
					if (settings.autoStart)
						methods.start($(this));
					
				}
			});
		},
		
		start: function($this) {
			if (!$this)
				$this = $(this);
			var data = $this.data('dslide-data');
             
            if (!data)
				return;
			
			data.timer = window.setInterval(function(){methods.next($this);}, data.settings.frequency*1000);
		},
		
		stop: function($this) {
			var data = $this.data('dslide-data');
			
			if (data.timer) {
				window.clearInterval(data.timer);
				data.timer = null;
			}
		},
		
		reset: function() {
			var $this = $(this),
				data = $this.data('dslide-data');
			
			if (data.timer) {
				window.clearInterval(data.timer);
				data.timer = null;
			}
			methods.moveTo($this, 0);
		},

		next: function($this) {
	    	var data = $this.data('dslide-data');
	    	
			var nextIndex = data.current + 1;
			var rightIndex = data.currentRight + 1;
			
			if (nextIndex >= data.leftImages.length)
				nextIndex = 0;
				
			if (rightIndex > data.rightImages.length - 3)
				rightIndex = 0;
			
			methods.moveTo($this, nextIndex, rightIndex);
		},
		
		moveTo: function($this, index, indexRight) {
	    	var data = $this.data('dslide-data');
	    	
			if (indexRight == null)
				indexRight = index;
			
			var offsetCurrent = $(data.rightImages[data.currentRight]).offset();
			var offsetNext = $(data.rightImages[indexRight]).offset();
			
			var moveY = offsetCurrent.top - offsetNext.top;
			
			var string = '+=';
			
			if (moveY < 0) {
				string = '-=';
				moveY = moveY * -1;
			}
			
			string += parseInt(moveY);
			$(data.rightSlider).animate({
				top:string,
			}, {
				duration: data.settings.duration*1000
			}
			
			);
			
			$(data.leftImages[data.current]).fadeOut(data.settings.duration*1000);
			$(data.leftImages[index]).fadeIn(data.settings.duration*1000);
			
			data.current = index;
			data.currentRight = indexRight;
		}
		
	};
	
	var click = function (event) {
		var $this = $(this),
    		data = $this.data('dslide-data');
    		
    	var parentData = $(data.target).data('dslide-data');

	   var index = (data.index);
	   var rightIndex = index - 1;
	   
	   if (rightIndex < 0)
	       rightIndex = parentData.rightImages.length - 1 + rightIndex;
	   
	   if (rightIndex > parentData.rightImages.length - 3)
	       rightIndex = 0;
	       
	   methods.moveTo($(data.target), index, rightIndex);
	   methods.stop($(data.target));
	}
	
	$.fn.DSlide = function(method) {
		if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.DSlide' );
		}
	};
})(jQuery);