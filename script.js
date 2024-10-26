/* eslint-disable no-console */
// import { } from "mathjs";

const DECIMAL_INPUT_STEP = 0.1;
const DECIMAL_INPUT_DECIMAL_POINTS = 1;

const DEFAULT_FIRST_TERM = 1;
const DEFAULT_COMMON_RATIO = 10;
const DEFAULT_NUMBER_OF_TERMS = 9;

const inputFirstTerm = document.getElementById("input-first-term");
const inputCommonRatio = document.getElementById("input-common-ratio");

const inputNumberOfTerms = document.getElementById("input-number-of-terms");
const inputLogScale = document.getElementById("input-log-scale");
const inputDecimalInput = document.getElementById("input-decimal-input");


const sumNumberOfTerms = document.getElementById("sum-number-of-terms");

const firstTermDisplays = document.getElementsByClassName("first-term");
const commonRatioDisplays = document.getElementsByClassName("common-ratio");
const numberOfTermsDisplay = document.getElementById("number-of-terms");

const commonRatioPowerNMinusOne = document.getElementById("common-ratio-power-n-minus-one");
const commonRatioMinusOne = document.getElementById("common-ratio-minus-one");
const finalSumElem = document.getElementById("final-sum");


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

	sumNumberOfTerms.innerText = numberOfTerms;

	for (const el of firstTermDisplays) {
		el.innerText = firstTerm;
	}
	for (const el of commonRatioDisplays) {
		el.innerText = commonRatio;
	}
	numberOfTermsDisplay.innerText = numberOfTerms;

	commonRatioPowerNMinusOne.innerText = (commonRatio ** numberOfTerms) - 1;
	commonRatioMinusOne.innerText = commonRatio - 1;

	finalSumElem.innerText = sumToNthTerm(numberOfTerms, firstTerm, commonRatio);

	for (let n = 1; n <= numberOfTerms; n += 1) {
		const nthTermValue = nthTerm(n, firstTerm, commonRatio);
		const barHeight = useLogScale === true ? Math.log2(nthTermValue) * 10 : nthTermValue;

		const barContainer = document.createElement("li");

		// #region
		const termNumberLabel = document.createElement("span");
		termNumberLabel.innerText = "T";

		const subscript = document.createElement("sub");
		subscript.innerText = n.toString().padEnd(2, " ");
		termNumberLabel.appendChild(subscript);

		barContainer.appendChild(termNumberLabel);
		// #endregion

		const bar = document.createElement("div");
		bar.classList.add("bar");
		bar.style.width = `${barHeight}px`;

		const termValueLabel = document.createElement("span");
		termValueLabel.classList.add("term-value");
		termValueLabel.innerText = nthTermValue;

		bar.appendChild(termValueLabel);

		barContainer.appendChild(bar);
		visContainer.appendChild(barContainer);
	}
	console.log("updated visualisation");
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
