/*
sWidth => 	'full' for 100% width || number value;
sNumber =>  number of slides on one carousel;

*/
function NewbieSlider(sContainer, sWidth, sSpeed, sDots, sNumber) {
	
	var width = sWidth || 960;
	var autoSpeed = sSpeed || 1500;
	var dots = sDots;
	var slidesNumber = sNumber || 1;

	var slider = document.getElementById(sContainer) || document.getElementById('slider');
	var carousel = document.getElementById(sContainer).getElementsByClassName('carousel')[0];
	var dotsBlock = document.getElementById(sContainer).getElementsByClassName('dots')[0];
	var numOfSlides = carousel.children.length;

	var autoplayInterval;
	var time = 0;

	this.setUp = function() { // will redo this method later and put most in here
		var self = this;

		this.setWidth(width);
		if(dots) this.setDots();

		addEventListener("keydown", function(e) { // slide with arrows
			switch(e.keyCode) {
    		case 39:
    			self.slideRotate('next');
    			break;
    		case 37:
    			self.slideRotate('prev');
    			break;
    		default:
    			return false;
    		}
		});
	}

	this.setWidth = function(sWidth) {
		if(sWidth == 'full') {
			width = window.innerWidth;
		} else if (isNaN(sWidth)) {
			return;
		} else width = sWidth;;
		
		slider.style.width = width+'px';

		for(var i = 0; i < numOfSlides; i++) {
			var slide = carousel.children[i];
			slide.style.width = width/slidesNumber+'px';

			this.checkErrors(carousel.children[i]); //check and handle 404 on img
		}
		
		carousel.style.left = 0+'px'; //return on 1st slide during resize in order to avoid misposition
	}

	this.setDots = function() {
		for(var i = 0; i < numOfSlides; i++) {
			var dot = document.createElement('span');
			dot.className = (i == 0) ? 'dot active' : 'dot';
			dot.setAttribute('data-slide', i);
			dotsBlock.appendChild(dot);
		}

		window.onload = function () {
        	dotsBlock.addEventListener ("click", function (event) {
        		if(event.target == dotsBlock) return false;
            	var targetPosition = event.target.getAttribute('data-slide');

            	for(var i = 0; i < numOfSlides; i++) {
					dotsBlock.children[i].className = 'dot';
				}
				event.target.className = 'dot active';
            	carousel.style.left = -(targetPosition*width)+'px';
       		}, false);
    	}
	}

	this.slideRotate = function(direction) {
		var clickTime = parseFloat(new Date().getTime()/1000); // to avoid slide rotation before previous slide finish rotation
		if ((clickTime - time) < 0.4) return;
		else time = clickTime;

		var lastSlidePos = width*numOfSlides-width;
		var leftPos = parseInt(getComputedStyle(carousel).left);
		var curSlide = Math.abs(leftPos/width)+1; // calculate number of current slide. leftPos/width - can be negative thus take abs value

		if(direction == 'next') {
			if(curSlide*slidesNumber < numOfSlides) {
				carousel.style.left = Math.floor(leftPos-width/slidesNumber)+'px'; // Math.floor is used to avoid miscalculaion if there are odd num of slide on slider
			} else carousel.style.left = 0+'px'; // if last slide and slide forward - return on 1st
		} else {
			if(curSlide > 1) {
				carousel.style.left = Math.floor(leftPos+width/slidesNumber)+'px';
			} else carousel.style.left = (-lastSlidePos)+'px'; // if first slide and slide backward - return on last
		}

		if(dots) { // change of dots - definitely will redo it later cause now it sucks but works
			var dot;
			
			for(var i = 0; i < numOfSlides; i++) {
				dotsBlock.children[i].className = 'dot';
			}

			if(direction == 'next') {
				dot = dotsBlock.children[curSlide];
			} else if(direction != 'next' && curSlide == 1) {
				dot = dotsBlock.children[numOfSlides-curSlide];
			} else dot = dotsBlock.children[curSlide-=2];

			if(curSlide == numOfSlides) dot = dotsBlock.children[0];

			dot.className += ' active';
		}
	}

	this.autoplay = function(direction) {
		var self = this;

		var playButton = slider.getElementsByClassName('autoplay')[0];
		var leftPos = parseInt(getComputedStyle(carousel).left);
		var curSlide = Math.abs(leftPos/width)+1; // calculate number of current slide. leftPos/width - can be negative thus take abs value

		if(playButton.getAttribute('data-auto') == 'play') { // data-* attr just for clearInterval and icon change
			playButton.setAttribute('data-auto', 'pause');
			clearInterval(autoplayInterval);
		} else {
			playButton.setAttribute('data-auto', 'play');
			this.slideRotate(direction); // to avoid delay on setInterval - rotate one time before interval starts

			autoplayInterval = setInterval(function() {
				self.slideRotate('next'); // rotate slides on interval unless stoped
			}, autoSpeed);
		}
	}

	this.checkErrors = function(elem) {

		elem.onerror = function() { //check and handle 404 on img
			elem.src = './img/img404.jpg'; 
		}

	}
}

var sliderOne = new NewbieSlider('slider', 'full', 200, false, 3);
sliderOne.setUp();

var sliderTwo = new NewbieSlider('slider-two', 720, 1500, false);
sliderTwo.setUp();

var sliderThree = new NewbieSlider('slider-three', 480, 1000, true);
sliderThree.setUp();