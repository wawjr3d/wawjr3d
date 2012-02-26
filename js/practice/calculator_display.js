$(function() {

	var global = window,
	
		calculator = new Calculator(),
		isLastButtonFunction = false,
		isLastButtonEquals = false,
		isLastButtonMemoryRecall = false,
		
		NEGATIVE_SYMBOL = "-",
		DECIMAL_SYMBOL = ".",
		ZERO_SYMBOL = "0",
		
		$output = $("#calculator input[type=text]");

	function cleanSpecialSymbols(value) {
		var newValue = "" + value,
			isNegative = newValue.substr(0, 1) == NEGATIVE_SYMBOL,
			numberValue = isNegative ? newValue.substr(1) : newValue;
			
		numberValue = numberValue.replace(NEGATIVE_SYMBOL, "");
			
		var splitOnDecimal = numberValue.split(DECIMAL_SYMBOL),
			beforeDecimal = splitOnDecimal.shift(),
			afterDecimal = splitOnDecimal;
			
		beforeDecimal = beforeDecimal.replace(/^[0]+(.*)/, "$1");
		
		newValue = [(beforeDecimal || ZERO_SYMBOL), afterDecimal.join("")].join(afterDecimal.length == 0 ? "" : ".");
		
		if (isNegative && newValue != ZERO_SYMBOL) { newValue = NEGATIVE_SYMBOL + newValue; }
		
		return newValue;
	}
	
	global.cleanSpecialSymbols = cleanSpecialSymbols;
	
	function getDisplay() { return $output.val(); }
	
	function setDisplay(value) { return $output.val(cleanSpecialSymbols(value)); }
	
	function updateDisplay(value) {
		
		var oldValue = getDisplay(),
			newValue = "" + oldValue + value;
		
		$output.val(cleanSpecialSymbols(newValue));
	}
	
	function clearDisplay() { $output.val(ZERO_SYMBOL); }
	
	function calculate() {
		if (calculator.isCanCalculate()) {
			calculator.calculate();

			setDisplay(calculator.getOutput());
			
			calculator.clearOperands();
			
			if (!isLastButtonEquals) {
				calculator.clearOperator();
			}
			
			calculator.addInput(new Calculator.Operand(getDisplay()));
		}
	}
	
	function displayMemoryStatus() {
		if (calculator.isMemorySet()) { 
			$("#status p").html("M");
		} else {
			$("#status p").html("");
		}
	}
	
	
	// Non number or function buttons
	
	$("#calculator input").not(".function").not("[name^=number_]").click(function() {
		isLastButtonFunction = false;
		isLastButtonEquals = false;
		isLastButtonMemoryRecall = false;
	});			
	
	$("#calculator input[name=clear]").click(function() {
		calculator.reset();
		
		clearDisplay();
	});

	$("#calculator input[name=clear_entry]").click(function() {
		clearDisplay();
	});

	$("#calculator input[name=memory_clear]").click(function() {
		calculator.clearMemory();
		
		displayMemoryStatus();
	});
	
	$("#calculator input[name=memory_recall]").click(function() {
		setDisplay(calculator.getMemory().getValue());
		
		isLastButtonMemoryRecall = true;
	});
	
	$("#calculator input[name=memory_set]").click(function() {
		var currentValue = getDisplay();
		
		if (currentValue != ZERO_SYMBOL) {
			calculator.setMemory(new Calculator.Operand(getDisplay()));
		}
		
		displayMemoryStatus();
	});
	
	$("#calculator input[name=memory_add]").click(function() {
		calculator.addToMemory(getDisplay());
		
		displayMemoryStatus();
	});
	
	$("#calculator input[name=memory_subtract]").click(function() {
		calculator.subtractFromMemory(getDisplay());
		
		displayMemoryStatus();
	});

	
	// Number buttons
	
	$("#calculator input.number").click(function() {
		if (isLastButtonFunction || isLastButtonMemoryRecall) { clearDisplay(); }
		if (isLastButtonEquals) { calculator.reset(); }
		
		isLastButtonFunction = false;
		isLastButtonMemoryRecall = false;
	});
	
	$("#calculator input[name^=number_]").click(function() {
		var number = this.name.substr("number_".length);

		updateDisplay(number);
	});
	
	$("#calculator input[name=decimal]").click(function() {
		updateDisplay(DECIMAL_SYMBOL);
	});
	
	$("#calculator input[name=toggle_sign]").click(function() {
		var oldValue = getDisplay();
		
		if (oldValue != ZERO_SYMBOL) {
			if (oldValue.substr(0, 1) == NEGATIVE_SYMBOL) {
				setDisplay(oldValue.substr(1));
			} else {
				setDisplay(NEGATIVE_SYMBOL + oldValue);
			}
		}
	});
	
	$("#calculator input[name=backspace]").click(function() {
		var oldOutput = getDisplay();
			
		setDisplay(oldOutput.substr(0, oldOutput.length - 1));
	});
	
	
	// Functions
	
	$("#calculator input.function").click(function() {
		if (!isLastButtonFunction || isLastButtonEquals) {
			calculator.addInput(new Calculator.Operand(getDisplay()));
		}
	});
	
	$("#calculator input[name=add]").click(function() { calculator.addInput(Calculator.Operators.ADD); });
	$("#calculator input[name=subtract]").click(function() { calculator.addInput(Calculator.Operators.SUBTRACT); });
	$("#calculator input[name=multiply]").click(function() { calculator.addInput(Calculator.Operators.MULTIPLY); });
	$("#calculator input[name=divide]").click(function() { calculator.addInput(Calculator.Operators.DIVIDE); });
	$("#calculator input[name=reciprocal]").click(function() { calculator.addInput(Calculator.Operators.RECIPROCAL); });
	$("#calculator input[name=square_root]").click(function() { calculator.addInput(Calculator.Operators.SQUARE_ROOT); });
	$("#calculator input[name=factorial]").click(function() { calculator.addInput(Calculator.Operators.FACTORIAL); });

	$("#calculator input.function").click(function() {			
		calculate();

		isLastButtonFunction = true;
	});
	
	$("#calculator input[name=equals]").click(function() {
		isLastButtonEquals = true;
	});


	// initialize
	clearDisplay();
});