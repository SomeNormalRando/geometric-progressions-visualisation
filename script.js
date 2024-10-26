const DECIMAL_INPUT_STEP = 0.1;
const DECIMAL_INPUT_DECIMAL_POINTS = 1;

const DEFAULT_FIRST_TERM = 1;
const DEFAULT_COMMON_RATIO = 10;
const DEFAULT_NUMBER_OF_TERMS = 9;

// in LaTeX
const SUM_LINE_1 = "S_n &= \\dfrac{a(r^n-1)}{r - 1}";

const inputFirstTerm = document.getElementById("input-first-term");
const inputCommonRatio = document.getElementById("input-common-ratio");

const inputNumberOfTerms = document.getElementById("input-number-of-terms");
const inputLogScale = document.getElementById("input-log-scale");
const inputDecimalInput = document.getElementById("input-decimal-input");

const sumMathDisplay = document.getElementById("sum-math-display");


let firstTerm = DEFAULT_FIRST_TERM;
let commonRatio = DEFAULT_COMMON_RATIO;
let numberOfTerms = DEFAULT_NUMBER_OF_TERMS;
let useLogScale = inputLogScale.checked;

inputFirstTerm.value = firstTerm;
inputCommonRatio.value = commonRatio;
inputNumberOfTerms.value = numberOfTerms;

function nthTerm(n, a, r) {
	return a * (r ** (n - 1));
}
function sumToNthTerm(n, a, r) {
	return (a * (r ** n - 1)) / (r - 1);
}

function handleScroll(ev) {
	ev.preventDefault();
	const currentVal = parseFloat(ev.target.value, 10);
	const step = parseFloat(ev.target.step);

	const val = ev.deltaY < 0 ? currentVal + step : currentVal - step;
	if (step !== 1) {
		ev.target.value = val.toFixed(DECIMAL_INPUT_DECIMAL_POINTS);
	} else ev.target.value = val;

	const inputEvent = new Event("input");
	ev.target.dispatchEvent(inputEvent);
}
inputFirstTerm.addEventListener("wheel", handleScroll);
inputCommonRatio.addEventListener("wheel", handleScroll);
inputNumberOfTerms.addEventListener("wheel", handleScroll);

const visContainer = document.getElementById("vis-container");
// const visTableBody = document.getElementById("vis-table-body");

function updateVisualisation() {
	visContainer.replaceChildren();

	const line2 = `S_${numberOfTerms} &= \\dfrac{${firstTerm}(${commonRatio}^{${numberOfTerms}} - 1)}{${commonRatio} - 1}`;
	const line3 = `&=\\dfrac{${(commonRatio ** numberOfTerms) - 1}}{${commonRatio - 1}}`;
	const line4 = `&=${sumToNthTerm(numberOfTerms, firstTerm, commonRatio)}`;

	sumMathDisplay.innerText = `$$\\begin{aligned}${SUM_LINE_1}\\\\${line2}\\\\${line3}\\\\${line4}\\end{aligned}$$`;

	for (let n = 1; n <= numberOfTerms; n += 1) {
		const nthTermValue = nthTerm(n, firstTerm, commonRatio);
		// to ensure consistent width when value of the nth term is negative
		const absNthTermValue = Math.abs(nthTermValue);
		const barWidth = useLogScale === true ? Math.log2(absNthTermValue) * 10 : absNthTermValue;

		const barContainer = document.createElement("li");

		// #region
		const termNumberLabel = document.createElement("span");
		// \( \) delimit single-line expressions
		termNumberLabel.innerText = `\\(T_{${n}}\\)`;

		// const subscript = document.createElement("sub");
		// subscript.innerText = n.toString().padEnd(2, " ");
		// termNumberLabel.appendChild(subscript);

		barContainer.appendChild(termNumberLabel);
		// #endregion

		const bar = document.createElement("div");
		bar.classList.add("bar");
		bar.style.width = `${barWidth}px`;

		// colour bars for negative values a different colour
		if (nthTermValue < 0) bar.classList.add("negative-term-value");

		const termValueLabel = document.createElement("span");
		termValueLabel.classList.add("term-value");
		termValueLabel.innerText = nthTermValue;

		bar.appendChild(termValueLabel);

		barContainer.appendChild(bar);
		visContainer.appendChild(barContainer);
	}

	window.MathJax.typeset();
}

inputFirstTerm.addEventListener("input", (ev) => {
	firstTerm = parseFloat(ev.target.value, 10);
	updateVisualisation();
});
inputCommonRatio.addEventListener("input", (ev) => {
	commonRatio = parseFloat(ev.target.value, 10);
	updateVisualisation();
});
inputNumberOfTerms.addEventListener("input", (ev) => {
	numberOfTerms = parseFloat(ev.target.value, 10);
	updateVisualisation();
});
inputLogScale.addEventListener("input", (ev) => {
	useLogScale = ev.target.checked;
	updateVisualisation();
});
inputDecimalInput.addEventListener("input", (ev) => {
	let step = DECIMAL_INPUT_STEP;
	if (ev.target.checked !== true) {
		step = 1;
		// round input values to whole numbers when decimal input is unchecked
		inputFirstTerm.value = parseInt(inputFirstTerm.value, 10);
		inputCommonRatio.value = parseInt(inputCommonRatio.value, 10);

		inputFirstTerm.dispatchEvent(new Event("input"));
		inputCommonRatio.dispatchEvent(new Event("input"));
	}
	inputFirstTerm.step = step;
	inputCommonRatio.step = step;
});
inputDecimalInput.dispatchEvent(new Event("input"));

updateVisualisation();
