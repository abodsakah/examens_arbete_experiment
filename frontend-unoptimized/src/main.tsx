/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three"; // Completely unnecessary import
import { gsap } from "gsap"; // Unnecessary animation library
import Chart from "chart.js/auto"; // Unnecessary chart library
import * as d3 from "d3"; // Another visualization library we don't need
import "bootstrap/dist/css/bootstrap.min.css"; // Large CSS framework
import "slick-carousel/slick/slick.css"; // Carousel CSS
import "slick-carousel/slick/slick-theme.css"; // More carousel CSS
import "react-datepicker/dist/react-datepicker.css"; // Datepicker CSS
import "react-toastify/dist/ReactToastify.css"; // Toast notifications CSS
import "./index.css"; // Our custom CSS
import App from "./App.tsx";

// Initialize unnecessary libraries
const threeScene = new THREE.Scene(); // Create unused Three.js scene
const threeCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const threeRenderer = new THREE.WebGLRenderer();

// Unused GSAP animation
gsap.to(
	{},
	{
		duration: 1,
		onComplete: () => console.log("GSAP initialized")
	}
);

// Unused Chart.js initialization
const unusedChart = new Chart(document.createElement("canvas"), {
	type: "bar",
	data: {
		labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		datasets: [
			{
				label: "Unused Dataset",
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: ["red", "blue", "yellow", "green", "purple", "orange"]
			}
		]
	}
});

// Unused D3 code
const unusedSvg = d3
	.select(document.createElement("div"))
	.append("svg")
	.attr("width", 100)
	.attr("height", 100);

// Create unnecessary large array in memory
const largeArray = new Array(100000).fill(0).map((_, i) => ({
	id: i,
	value: Math.random(),
	data: new Array(20).fill(0).map(() => Math.random())
}));

// Create unnecessary event listeners
window.addEventListener("resize", () => {
	console.log("Window resized", window.innerWidth, window.innerHeight);
	threeCamera.aspect = window.innerWidth / window.innerHeight;
	threeCamera.updateProjectionMatrix();
});

// Simulate a large memory leak
const leakyArray: number[][] = [];
setInterval(() => {
	leakyArray.push(new Array(10000).fill(Math.random()));
	console.log("Memory leak size:", leakyArray.length);
}, 60000); // Every minute add more data

// Slow down page load with unnecessary calculation
console.log("Running unnecessary calculation...");
let sum = 0;
for (let i = 0; i < 10000000; i++) {
	sum += Math.sqrt(i) * Math.sin(i);
}
console.log("Calculation result:", sum);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
