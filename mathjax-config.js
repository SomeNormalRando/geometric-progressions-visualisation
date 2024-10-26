// config should be set before MathJax is loaded - see https://docs.mathjax.org/en/latest/web/configuration.html#configuring-mathjax-after-it-is-loaded

window.MathJax = {
	loader: {
		load: ["input/tex", "output/chtml"],
	},
	chtml: {
		displayAlign: "left",
	},
};
