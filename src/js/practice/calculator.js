(function($) {

	var global = this,
		noop = identityOperatorFunction = function() {};
		
	if (!("console" in window)) {
	
		var console_functions = ["log", "debug", "info", "warn", "error",
									"assert", "dir", "dirxml", "group", "groupEnd",
									"time", "timeEnd", "count", "trace", "profile",
									"profileEnd"];
		global.console = {};
		
		for (var i = 0; i < console_functions.length; i++) {
			global.console[console_functions[i]] = noop;		
		}
	}
	
	
	// Calculator

	var Calculator = function() { };
	
	
	// Calculator.Input
	
	Calculator.Input = function() {};
	
	Calculator.Input.prototype = $.extend(Calculator.Input.prototype, {
		isValid: function() { return false; }
	});

	
	// Calculator.Operand
	
	Calculator.Operand = function(value) {
		this.value = parseFloat(value);
			
		if (this.value == NaN) { this.value = 0; }
	};

	Calculator.Operand.prototype = $.extend(new Calculator.Input(), Calculator.Operand.prototype, {

		// Properties

		value: undefined,


		// Methods		
		
		getValue: function() { return this.value; },

		isValid: function() { return this.value !== null && !isNaN(this.value); }

	});

	Calculator.Operand.EMPTY = new Calculator.Operand(0);
	
	
	// Calculator.Operator
	
	Calculator.Operator = function(function_) {
		this.function_ = !function_ || typeof function_ != "function" ? identityOperatorFunction : function_;
	};

	Calculator.Operator.prototype = $.extend(new Calculator.Input(), Calculator.Operator.prototype, {

		// Properties
		
		function_: undefined,


		// Methods

		isValid: function() {
			
			for(var operator in Calculator.Operators) {
				if (Calculator.Operators[operator] == this) {
					return this.getNumberOfExpectedOperands() >= Calculator.Operator.MIN_OPERANDS && this.getNumberOfExpectedOperands() <= Calculator.Operator.MAX_OPERANDS;
				}
			}
			
			return false;
		},
		
		getFunction: function() { return this.function_; },
		
		getNumberOfExpectedOperands: function() { return this.function_.length; }

	});
	
	Calculator.Operator.MIN_OPERANDS = 1;
	Calculator.Operator.MAX_OPERANDS = 2;
	
	
	// Calculator.Operators
	
	Calculator.Operators = {
	
		// Binary operators
	
		ADD: new Calculator.Operator(function(/*Calculator.Operand*/ x, /*Calculator.Operand*/ y) {
			return x.getValue() + y.getValue();
		}),
		
		SUBTRACT: new Calculator.Operator(function(/*Calculator.Operand*/ x, /*Calculator.Operand*/ y) {
			return x.getValue() - y.getValue();
		}),
		
		MULTIPLY: new Calculator.Operator(function(/*Calculator.Operand*/ x, /*Calculator.Operand*/ y) {
			return x.getValue() * y.getValue();
		}),
		
		DIVIDE: new Calculator.Operator(function(/*Calculator.Operand*/ x, /*Calculator.Operand*/ y) {
			return x.getValue() / y.getValue();
		}),
		
		
		// Unary operators
		
		IDENTITY: new Calculator.Operator(function(/*Calculator.Operand*/ x) {
			return x;
		}),
		
		RECIPROCAL: new Calculator.Operator(function(/*Calculator.Operand*/ x) {
			return 1 / x.getValue();
		}),
		
		SQUARE: new Calculator.Operator(function(/*Calculator.Operand*/ x) {
			return x.getValue() * x.getValue();
		}),
		
		SQUARE_ROOT: new Calculator.Operator(function(/*Calculator.Operand*/ x) {
			return Math.sqrt(x.getValue());
		}),

		FACTORIAL: new Calculator.Operator(function(/*Calculator.Operand*/ x) {
			
			function factorial(n) {
				if (n <= 0) { return 1; }
				
				return n * factorial(n - 1);
			}
			
			return factorial(x.getValue());
		}),
		
		
		// Empty operator
		
		EMPTY: new Calculator.Operator(function() {})
	};

	Calculator.prototype = $.extend(Calculator.prototype, {

		// Properties
		
		acceptingInput: false,
		operands: [],
		operator: Calculator.Operators.EMPTY,
		output: NaN,
		memory: Calculator.Operand.EMPTY,
		
		
		// Methods
		getOperands: function() { return this.operands; },
		
		getOperator: function() { return this.operator; },
		
		getOutput: function() { return this.output; },
		
		getMemory: function() { return this.memory; },
		
		setMemory: function(value) {
			this.memory = value;
			this.print("Memory set to: " + this.memory.getValue());
		},
		
		addToMemory: function(value) {
			this.memory = new Calculator.Operand(this.memory.getValue() + parseFloat(value));
			this.print("Memory set to: " + this.memory.getValue());
		},
		
		subtractFromMemory: function(value) {
			this.memory = new Calculator.Operand(this.memory.getValue() - parseFloat(value));
			this.print("Memory set to: " + this.memory.getValue());
		},
		
		
		isCanCalculate: function() { return this.isHasExecutableOperator() && this.operands.length == this.operator.getNumberOfExpectedOperands(); },
		
		isHasExecutableOperator: function() { return !!this.operator && this.operator != Calculator.Operators.EMPTY; },

		isAcceptingOperator: function() { return !this.isHasExecutableOperator(); },
		
		isAcceptingOperand: function() { return this.operands.length < Calculator.Operator.MAX_OPERANDS; },
		
		isAcceptingInput: function() { return this.isAcceptingOperand() || !this.isHasExecutableOperator(); },
		
		isMemorySet: function() { return this.memory != Calculator.Operand.EMPTY; },
		
		
		clearOperands: function() {
			this.operands = [];
			this.print("Operands cleared");
		},
		
		clearOperator: function() {
			this.operator = Calculator.Operators.EMPTY;
			this.print("Operator cleared");
		},
		
		clearMemory: function() {
			this.memory = Calculator.Operand.EMPTY;
			this.print("Memory cleared");
		},
		
		clearInputs: function() {
			this.clearOperands();
			this.clearOperator();
		},
		
		clearOutput: function() {
			this.output = NaN;
			this.print("Output cleared");
		},
		
		reset: function() {
			this.clearInputs();
			this.clearOutput();
		},
		
		
		addInput: function(/*Calculator.Input*/ input) {
		
			if (!this.isAcceptingInput()) { this.printError("Not accepting input"); return; }
		
			if (input.isValid()) {
				if (input instanceof Calculator.Operand) {
					if (!this.isAcceptingOperand()) { this.printError("Not accepting more operands"); return; }
					
					this.operands.push(input);
					
					this.print("Accepted operand value " + input.getValue());
					
				} else if (input instanceof Calculator.Operator) {
					this.operator = input;
					
					this.print("Accepted operator value " + input.getFunction());
				}
			}
		
		},
		
		calculate: function() {
			
			if (!this.isCanCalculate()) { this.printError("Cannot calculate"); return; }
			
			try {
			
				var operatorFunction = this.operator.getFunction();
			
				this.output = operatorFunction.apply(operatorFunction, this.operands);
				
				this.print("Calculated - output ready");
			
			} catch (e) {
				this.printError("Error calculating - " + e.message);
			}
		
		},
		
		print: function(message) {
			console.log("Calculator: " + message);
		},
		
		printError: function(errorMessage) {
			console.warn("Calculator Error: " + errorMessage);
		}

	});

	
	
	
	global.Calculator = Calculator;

})(jQuery);