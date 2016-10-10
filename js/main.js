jQuery(document).ready(function($){
	//set animation timing
	var animationDelay = 5000,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 5000;

		var backgrounds = ['url(img/header1.jpg)','url(img/header2.jpg)','url(img/header3.jpg)','url(img/header4.jpg)','url(img/header5.jpg)'];
		var current = 0;
	
	initHeadline();
	testPage();
	

	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;

		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (headline.hasClass('clip2')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
		
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			setTimeout(function(){nextBackground();}, 1);
				$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
					switchWord($word, nextWord);
					showWord(nextWord);			
				});
		} else if($word.parents('.cd-headline').hasClass('clip2')) {
				$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
					switchWord($word, nextWord);
					showWord(nextWord);			
				});
		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);

		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
			});
		} else if($word.parents('.cd-headline').hasClass('clip2')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
			});
		}

	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}

	// Background switcher custom


	function nextBackground() {
		var header = $('.cd-image-swap');
		if(current < backgrounds.length - 1){
			current = current + 1;
			backgroundSwap();
		}
		else {
			current = 0;
			//header.css('background',backgrounds[0]);
			backgroundSwap();
		}
	}

	function backgroundSwap() {
		var header = $('.cd-image-swap');
		header.fadeOut(revealDuration, function(){
			header.attr("style");
			header.css('background',backgrounds[current]);
		});
		header.fadeIn(revealDuration, function(){
			header.attr("style");
		});
	}


	// menu opener

	var $lateral_menu_trigger = $('#cd-menu-trigger'),
		$content_wrapper = $('.contain'),
		$navigation = $('header');

	//open-close lateral menu clicking on the menu icon
	$lateral_menu_trigger.on('click', function(event){
		event.preventDefault();
		
		$lateral_menu_trigger.toggleClass('is-clicked');
		$navigation.toggleClass('lateral-menu-is-open');
		$content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
			$('body').toggleClass('overflow-hidden');
		});
		$('#cd-lateral-nav').toggleClass('lateral-menu-is-open');
		
		//check if transitions are not supported - i.e. in IE9
		if($('html').hasClass('no-csstransitions')) {
			$('body').toggleClass('overflow-hidden');
		}
	});

	//close lateral menu clicking outside the menu itself
	$content_wrapper.on('click', function(event){
			if( !$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span') ) {
			$lateral_menu_trigger.removeClass('is-clicked');
			$navigation.removeClass('lateral-menu-is-open');
			$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$('#cd-lateral-nav').removeClass('lateral-menu-is-open');
			//check if transitions are not supported
			if($('html').hasClass('no-csstransitions')) {
				$('body').removeClass('overflow-hidden');
			}
		}
	});

	//open (or close) submenu items in the lateral menu. Close all the other open submenu items.
	$('.item-has-children').children('a').on('click', function(event){
		event.preventDefault();
		$(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
	});

	//safety for menu
	$(window).on('resize', function(event){
    	windowLarge();
	});
	function windowLarge() {
		var windowWidth = $(window).width();
			if(windowWidth > 767){
			    if($('#cd-menu-trigger').hasClass('is-clicked')) {
					if( !$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span') ) {
						$lateral_menu_trigger.removeClass('is-clicked');
						$navigation.removeClass('lateral-menu-is-open');
						$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
							$('body').removeClass('overflow-hidden');
						});
						$('#cd-lateral-nav').removeClass('lateral-menu-is-open');
						//check if transitions are not supported
						if($('html').hasClass('no-csstransitions')) {
							$('body').removeClass('overflow-hidden');
						}
					}
			    }
			}
	}
	
	//menu highlight at scroll
	var $navMenu = $('.navbar');

	function testPage(){
		//var p = window.location.pathname;
		//if (window.location.pathname === '/abbo2/'){
     	//	var $height = $(window).height();
     	//} else {
     	//	startSetting();
     	//	var $height = 79;
     	//};
     	var $height = $(window).height();
     	var scrolling = $height - 80;
	    $(window).scroll(function(){
	        var pTop = $('body').scrollTop();
	        if( pTop >= scrolling ){
	            startSetting();
	            
	        }
	        else {
	        	endSetting();
	        }
	    });
 	};
	function startSetting() {
		var $navMenu = $('.navbar');
		$navMenu.addClass('nav-scrolled');
	}
	function endSetting() {
		var $navMenu = $('.navbar');
		$navMenu.removeClass('nav-scrolled');
	}
});

//Portfolio opener

$(document).on('click','.exit',function() {
	removeCurrent();
});


$('.project').on('click',function () {
	var project = $(this);
	var projectc = $('.project-content');
	if (project.hasClass('current')) {
		var contain = $('.project');
		
	} else {
		removeCurrent();
		$(this).addClass('current');
		scrollMe();
		// Resize text to fit width
		p = $(this).children("#p-inner");
		w = $(window).width();
		p.width(w);
		$(window).resize(function() {
			p.width($(window).width());
		});
		// Determine height of div
		var pheight = $(this).children('#p-inner').height();
		$(this).css('margin-bottom',pheight);
		$(this).children('#p-inner').css('display','block');
		// Offset fix
		pOffset();
		// Blue select
		$(this).children('.nohover').children('.project-content').children('img').addClass('hovered');
	};
});

function scrollMe() {
	var container = $('html,body');
	var scrollTo = $('.current');
	var dheight = $('.current').height();
	container.animate({
		scrollTop: scrollTo.offset().top + dheight - 80
	},1000);
}

function removeCurrent() {
	var current = $('.current');
	current.children('#p-inner').css('display','none');
	current.children('.nohover').children('.project-content').children('img').removeClass('hovered');
	current.css('margin-bottom','0');
	current.removeClass('current');
};

function pOffset() {
	var poffset = $('.current').children('#p-inner');
	var offset = $('.current').offset().left;
	poffset.css('margin-left',-offset);

	$(window).resize(function() {
		var offset = $('.project').width();
		poffset.css('margin-left',-offset);
	})
};