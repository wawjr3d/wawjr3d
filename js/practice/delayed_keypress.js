(function($) {
	
	var event_name = "delayed_keypress",
		delay = 500;
	
	$.fn.delayed_keypress = function(handler) {

		return this.each(function() {
			
			var $this = $(this),
				element = this;
			
			function delayed_event() {
				
				current_value_length = $this.val().length;
				
				setTimeout(function() {
					
					if (current_value_length == $this.val().length - 1) {
						handler.apply(element);
					}

				
				}, delay);	
			};
			
			//TODO, only apply to elements with keypress
			
			if (typeof handler == "function") {
				$this.keypress(delayed_event).bind(event_name, handler);
			} else {
				$this.trigger(event_name);
			}
			
		});
	};
	
})(jQuery);