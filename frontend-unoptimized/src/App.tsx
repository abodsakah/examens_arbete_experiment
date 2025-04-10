import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import $ from "jquery";
import _ from "lodash";
import moment from "moment";
import store from "./store";
import { loadTestResources } from "./services/api";
import "./App.css";

// Import all components (no code splitting/lazy loading)
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";

// Inefficient counter that rerenders the entire app
function App() {
	const [renderCount, setRenderCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Unnecessary re-renders
	useEffect(() => {
		const interval = setInterval(() => {
			setRenderCount((prev) => prev + 1);
		}, 10000); // Update every 10 seconds

		return () => clearInterval(interval);
	}, []);

	// Inefficient loading of resources
	useEffect(() => {
		const loadResources = async () => {
			try {
				// Simulate loading delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Load unnecessary resources
				await loadTestResources();

				// Run some unnecessary calculations
				const result = _.range(1, 1000).map((num) => {
					return {
						original: num,
						squared: num * num,
						cubed: num * num * num,
						sqrt: Math.sqrt(num),
						date: moment().add(num, "days").format("YYYY-MM-DD")
					};
				});

				// Do nothing with the result, just log it
				console.log("Calculated unnecessary data:", result.length);

				// Use jQuery unnecessarily
				$(document).ready(function () {
					console.log("Document ready via jQuery");
					$("body").addClass("loaded");
				});

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading resources:", error);
				setIsLoading(false);
			}
		};

		loadResources();
	}, []);

	// Force reflow by accessing DOM properties
	useEffect(() => {
		const forceReflow = () => {
			const element = document.getElementById("root");
			if (element) {
				// Force layout recalculation
				const height = element.offsetHeight;
				const width = element.offsetWidth;
				console.log(`Forced reflow: ${width}x${height}`);
			}
		};

		// Force reflow on interval
		const reflowInterval = setInterval(forceReflow, 5000);

		return () => clearInterval(reflowInterval);
	}, []);

	if (isLoading) {
		return (
			<div className='loading-screen'>
				<div className='spinner'></div>
				<p>Loading resources...</p>
			</div>
		);
	}

	// Render the entire app (no code splitting)
	return (
		<Provider store={store}>
			<Router>
				<div className='app-container'>
					{/* Render counter */}
					<div className='render-counter'>Render count: {renderCount}</div>

					{/* Header component */}
					<Header />

					{/* Main content with routes */}
					<main className='main-content'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/products' element={<ProductsPage />} />
							<Route path='/products/:id' element={<ProductDetailsPage />} />
							<Route path='/cart' element={<CartPage />} />
							<Route path='/checkout' element={<CheckoutPage />} />
							<Route
								path='/order-confirmation/:id'
								element={<OrderConfirmationPage />}
							/>
							<Route
								path='/order-tracking/:trackingNumber'
								element={<OrderTrackingPage />}
							/>
							<Route path='*' element={<NotFoundPage />} />
						</Routes>
					</main>

					{/* Footer component */}
					<Footer />

					{/* Toast notifications */}
					<ToastContainer />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
