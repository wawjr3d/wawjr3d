var noop = $.noop !== undefined ? $.noop : function() {};
var identity_mapping = function(x) { return x; };

// Operator

var Operator = function(mapping) {
	if (mapping.length > 2) { 
		throw "at most 2 operands should be expected";
	}

	this.mapping = mapping || identity_mapping;
};

Operator.prototype = $.extend(Operator.prototype, {

	mapping : identity_mapping,

	getExpectedOperandCount : function() {
		return this.mapping.length;
	},
	
	getMapping : function() { return this.mapping; }

});


// Operation

var Operation = function() {};

Operation.prototype = $.extend(Operation.prototype, {

	operands : [],
	operator : undefined,
	
	result : undefined,
	
	execute : function() {
		if (this.isExecutable()) {
			this.result = this.operator.getMapping().apply(this.operator.getMapping(), this.operands);

			this.setupForNextExecution();
			
			return this.result;
		}
		
		throw "operation is not ready to be executed";
	},
	
	setupForNextExecution : function() { this.operands[0] = this.result; },
	
	// cannot add a second operand without adding operator
	addOperand : function(operand) {
		if (typeof operand != "number") { throw "operands can only be numbers"; }
		if (this.operands.length > 0 && !this.hasOperator()) { throw "add operator before next operand"; }
		if (this.isExecutable()) { throw "no more operands needed"; }
	
		this.operands.push(operand);
	},
	
	addOperator : function(operator) {
		if (!operator) { return; }
		if (operator.constructor !== Operator) { throw "only operators are accepted"; }
		if (this.operands.length == 0) { throw "add operand before operator"; }
		if (this.hasOperator()) { throw "operator already set"; }		
		
		this.operator = operator;
	},
	
	hasOperator : function() { return this.operator !== undefined; },
	
	isExecutable : function() { return this.operator && this.operands.length >= this.operator.getExpectedOperandCount(); },
	
	getOperator : function() { return this.operator; },
	getResult : function() { return this.result; }
});


var add = new Operator(function(x, y) { return x + y; });

var operation = new Operation();

// Calculator

var Calculator = function() {};

Calculator.ADD = "add";
Calculator.SUBTRACT = "subtract";
Calculator.MULTIPLY = "multiply";
Calculator.DIVIDE = "divide";
Calculator.SQUARE_ROOT = "square_root";
Calculator.RECIPROCAL = "reciprocal";

Calculator.ADD_OPERATOR = new Operator(function(x, y) { return x + y; });

Calculator.IS_ONE_OPERAND_OPERATOR = true;

Calculator.prototype = $.extend(Calculator.prototype, {
		
	operands: [],
	operator: undefined,
	
	memory: 0,
	
	clearOperator: function() { this.operator = undefined; },
	clearOperation: function() {
		this.operands = [];
		this.operator = undefined;
	},
	
	addOperand: function(value) { 
		if (this.operands.length > 0 && this.operator === undefined) { return; }
		
		if (this.operands.length == 2) { this.clearOperation(); }
	
		this.operands.unshift(value);
	},
	removeOperand: function() { this.operands.shift(); },
	
	clearMemory: function() { this.setMemory(0); },
	addToMemory: function(value) { this.memory += value; },
	subtractFromMemory: function(value) { this.memory -= value; },
	
	calculateOperation: function() {
		if (this.getOperator() === undefined) { return; }
	
		var operand2 = this.operands.shift();
		var operand1 = this.operands.length == 1 ? this.operands.shift() : operand2;
		
		var result = operand1;
		
		switch(this.operator) {
			case Calculator.ADD:
				result += operand2;
				break;
			case Calculator.SUBTRACT:
				result -= operand2;
				break;		
			case Calculator.MULTIPLY:
				result *= operand2;
				break;
			case Calculator.DIVIDE:
				result /= operand2;
				break;
			case Calculator.SQUARE_ROOT:
				result = Math.sqrt(result);
				break;
			case Calculator.RECIPROCAL:
				result = 1 / result;
				break;
			default:
				break;
		}
		
		this.operands.unshift(result);
		
		return result;
	},
	
	getCurrentValue: function() { return this.operands.length > 0 ? this.operands[this.operands.length - 1] : 0; },
	
	getOperands: function() { return this.operands; },
	
	getOperator: function() { return this.operator; },
	setOperator: function(operator, is_one_operand_operator) {
		if (this.getOperator() != undefined && this.operands.length == 2) { this.calculateOperation(); }
	
		this.operator = operator;
		
		if (is_one_operand_operator === Calculator.IS_ONE_OPERAND_OPERATOR) {
			this.calculateOperation();
			this.clearOperator();
		}
	},
	
	getMemory: function() { return this.memory; },
	setMemory: function(value) { this.memory = value; },
	
	toString: function() { 
		return "Operands: " + (this.operands.join(", ") || "none") + " and Operator: " + (this.getOperator() || "none") + " and Current Value: " + this.getCurrentValue();
	}
	
});

(function($) {

	$.fn.calculator = function(options) {
	
		var settings = {
		
		};
		
		if (options) { $.extend(settings, options); }
	
		return this.each(function() {
		
			var $this = $(this);
			
			var $display = $("input[type=text]", $this);
			var $state_display = $("#calculator_state");
			
			var calculator = new Calculator();
			
			var startNewNumber = true;

			function updateStateDisplay() { $state_display.prepend(calculator.toString() + "<br />"); }
			function updateDisplay(value) { $display.val(value); }			
			function getDisplay() { return $display.val(); }			
			function getDisplayValue() { return parseFloat(getDisplay()) || new Number(0); }

			updateDisplay(0);

			
			/* BUTTON EVENTS */
			
			$("input[name=clear]", $this).click(function() { calculator.clearOperation(); updateDisplay(0); });
			

			// memory buttons
			
			$("input[name=memory_clear]", $this).click(function() { calculator.clearMemory(); });
			$("input[name=memory_recall]", $this).click(function() { $display.val(calculator.getMemory()); });
			$("input[name=memory_set]", $this).click(function() { calculator.setMemory(getDisplayValue()); });
			$("input[name=memory_add]", $this).click(function() { calculator.addToMemory(getDisplayValue()); });
			$("input[name=memory_subtract]", $this).click(function() { calculator.subtractFromMemory(getDisplayValue()); });
			
			
			// display buttons
			
			$("input[name^=number]", $this).click(function() {
			
				$button = $(this);
				
				var old_display = getDisplay();
				
				if (startNewNumber) { old_display = ""; startNewNumber = false; }
				
				var new_display = "" + old_display + $button.val();
				
				if (new_display.length == 2 && new_display.substring(0, 1) == "0") {
					new_display = new_display.substr(1);
				}
			
			
				updateDisplay(new_display);
			
			});
			
			$("input[name=decimal]", $this).click(function() {
			
				$button = $(this);
				
				var old_display = "" + getDisplay();
			
				updateDisplay(old_display.indexOf(".") > -1 ? old_display : old_display + ".");
			
			});
			
			$("input[name=toggle_sign]", $this).click(function() {
				var current_display = getDisplay();
				
				if (current_display == "0") { return; }
				
				if (current_display.substring(0, 1) == "-") {
					updateDisplay(current_display.substr(1));
				} else {
					updateDisplay("-" + current_display);
				}
			});
			
			
			// functional operators
			
			$("input.function").click(function() { startNewNumber = true; calculator.addOperand(getDisplayValue()); updateStateDisplay(); });
			
			$("input[name=add]", $this).click(function() { calculator.setOperator(Calculator.ADD); });
			$("input[name=subtract]", $this).click(function() { calculator.setOperator(Calculator.SUBTRACT); });
			$("input[name=multiply]", $this).click(function() { calculator.setOperator(Calculator.MULTIPLY); });
			$("input[name=divide]", $this).click(function() { calculator.setOperator(Calculator.DIVIDE); });
			$("input[name=square_root]", $this).click(function() { calculator.setOperator(Calculator.SQUARE_ROOT, Calculator.IS_ONE_OPERAND_OPERATOR); });
			$("input[name=reciprocal]", $this).click(function() { calculator.setOperator(Calculator.RECIPROCAL, Calculator.IS_ONE_OPERAND_OPERATOR); });
			
			$("input.function").click(function() { updateDisplay(calculator.getCurrentValue()); updateStateDisplay(); });
			
			
			// equals button
			
			$("input[name=equals]", $this).click(function() {
				startNewNumber = true; 
				updateStateDisplay();
				calculator.addOperand(getDisplayValue());
				updateDisplay(calculator.calculateOperation());
			});

		});
	};

})(jQuery);