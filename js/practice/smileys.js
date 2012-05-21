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
		ENTER_KEY = 13,
		
		FIELDS = {
			SIZE: "size",
			MOOD: "mood",
			SPECIFIC: "specific"
		};
	
	
	var $form, $smiley, $size;
	
	function pickSmiley(e) {
		var size = $size.val() || DEFAULT_SIZE;
		
		$smiley.css("fontSize", size + "px");

		$smiley.removeClass(ALL_SMILEYS);
		$smiley.addClass($form.find("input[name=" + FIELDS.MOOD + "]:checked").val());
		$smiley.addClass($form.find("input[name=" + FIELDS.SPECIFIC + "]:checked").val());
	}
	
	function killSubmit(e) {
		e.preventDefault();
	}
	
	function capSize(size) { // not functioning pun
		if (isNaN(size)) { return MIN_SIZE; }
		return Math.max(Math.min(size, MAX_SIZE), MIN_SIZE);
	}
	
	function upAndDown(e) {
    	var size = parseInt($size.val() || 0, 10);
    	
        switch (e.keyCode) {
	        case KEYUP:
	        	$size.val(capSize(size + 1));
	        	pickSmiley();
	            break;
	            
	        case KEYDOWN:
	        	$size.val(capSize(size - 1));
	        	pickSmiley();
	            break;
	            
	        default:
	        	break;
        }
	}
	
	var getQueryStringParam = (function() {
		
			var query_string = (window.location.search.length > 1) ? window.location.search.substring(1) : null;
			var pairs = (query_string != null) ? query_string.split("&") : [];
			var params = {};
			
			for (var i=0; i < pairs.length; i++) {
				var pair = pairs[i].split("=");
				
				params[pair[0]] = pair[1] != null ? pair[1] : null;
			}
			
			return function(name) { return params[name] != null ? decodeURIComponent(params[name]) : null; }
	})();
	
	function inititializeSmiley() {
		var size = getQueryStringParam(FIELDS.SIZE),
			mood = getQueryStringParam(FIELDS.MOOD),
			specific = getQueryStringParam(FIELDS.SPECIFIC);
		
		if (size) {
			$size.val(capSize(parseInt(size || 0, 10)));
		}
		
		if (mood) {
			$form.find("input[name=" + FIELDS.MOOD + "][value=" + mood + "]").prop("checked", true);
		}
		
		if (specific) {
			$form.find("input[name=" + FIELDS.SPECIFIC + "][value=" + specific + "]").prop("checked", true);
		}
		
		pickSmiley();
	}
	
	$(function() {
		$form = $("form.pick-a-smiley");
		$size = $form.find("input[name=" + FIELDS.SIZE + "]");
		$smiley = $form.find(".smiley");
		
		$form.submit(killSubmit);
		$form.keydown(upAndDown);
		
		$form.find("input[name=" + FIELDS.MOOD + "], input[name=" + FIELDS.SPECIFIC + "]").change(pickSmiley);
		$size.change(pickSmiley)
		
		inititializeSmiley();
	});
	
})(this, jQuery);