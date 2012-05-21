(function(global, $) {

	"use strict";
	
	var AVAILABLE_MOODS = ["happy", "frowny"].join(" "),
		
		AVAILABLE_SPECIFICS = ["inquisitive", "lying", "honest", "angry"].join(" "),
		
		ALL_SMILEYS = [AVAILABLE_MOODS, AVAILABLE_SPECIFICS].join(" "),
	
		DEFAULT_SIZE = "2",
		
		SIZE_UNITS = "px",
		
		MAX_SIZE = 20,
		MIN_SIZE = 1,
			
    	// keys i care about
		KEYUP = 38,
		KEYDOWN = 40,
		ENTER_KEY = 13;
	
	
	var $form, $smiley, $size;
	
	function pickSmiley(e) {
		var size = $size.val() || DEFAULT_SIZE;
		
		$smiley.css("fontSize", size + "px");

		$smiley.removeClass(ALL_SMILEYS);
		$smiley.addClass($form.find("input[name=mood]:checked").val());
		$smiley.addClass($form.find("input[name=specific]:checked").val());
	}
	
	function killSubmit(e) {
		e.preventDefault();
	}
	
	function upAndDown(e) {
    	var size = parseInt($size.val() || 0, 10);
    	
        switch (e.keyCode) {
	        case KEYUP:
	        	$size.val(Math.min(size + 1, MAX_SIZE));
	        	pickSmiley();
	            break;
	            
	        case KEYDOWN:
	        	$size.val(Math.max(size - 1, MIN_SIZE));
	        	pickSmiley();
	            break;
	            
	        default:
	        	break;
        }
	}
	
	$(function() {
		$form = $("form.pick-a-smiley");
		$size = $form.find("input[name=size]");
		$smiley = $form.find(".smiley");
		
		$form.submit(killSubmit);
		$form.keydown(upAndDown);
		
		$form.find("input[name=mood], input[name=specific]").change(pickSmiley);
		$size.change(pickSmiley)
		
		pickSmiley();
	});
	
})(this, jQuery);