import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import _ from "lodash"; // Keep lodash for moderate optimization
import store from "./store";
import { loadTestResources } from "./services/api";
import "./App.css";

// Import essential components directly
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

// Lazy load other page components for code splitting
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Moderately optimized App component
function App() {
	const [renderCount, setRenderCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Reduced frequency of re-renders for moderate optimization
	useEffect(() => {
		const interval = setInterval(() => {
			setRenderCount((prev) => prev + 1);
		}, 30000); // Update every 30 seconds instead of 10

		return () => clearInterval(interval);
	}, []);

	// Moderately optimized resource loading
	useEffect(() => {
		const loadResources = async () => {
			try {
				// Smaller loading delay
				await new Promise((resolve) => setTimeout(resolve, 200));

				// Load resources - keep but with reduced scope
				await loadTestResources();

				// Run a smaller calculation for moderate optimization
				const result = _.range(1, 100).map((num) => {
					return {
						original: num,
						squared: num * num,
						sqrt: Math.sqrt(num)
					};
				});

				// Log result
				console.log("Calculated data:", result.length);

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading resources:", error);
				setIsLoading(false);
			}
		};

		loadResources();
	}, []);

	// A single reflow check, not continuous
	useEffect(() => {
		const element = document.getElementById("root");
		if (element) {
			// Force layout recalculation once, not repeatedly
			const height = element.offsetHeight;
			const width = element.offsetWidth;
			console.log(`Initial dimensions: ${width}x${height}`);
		}
	}, []);

	// Loading spinner with simpler animation
	if (isLoading) {
		return (
			<div className='loading-screen'>
				<div className='spinner'></div>
				<p>Loading resources...</p>
			</div>
		);
	}

	// Render app with code splitting
	return (
		<Provider store={store}>
			<Router>
				<div className='app-container'>
					{/* Render counter - kept for UI similarity */}
					<div className='render-counter'>Render count: {renderCount}</div>

					{/* Header component (eagerly loaded) */}
					<Header />

					{/* Main content with routes and code splitting */}
					<main className='main-content'>
						<Routes>
							{/* Home page is eagerly loaded */}
							<Route path='/' element={<HomePage />} />
							
							{/* Lazy-loaded routes with suspense fallback */}
							<Route path='/products' element={
								<Suspense fallback={<div className="loading-page">Loading products...</div>}>
									<ProductsPage />
								</Suspense>
							} />
							<Route path='/products/:id' element={
								<Suspense fallback={<div className="loading-page">Loading product details...</div>}>
									<ProductDetailsPage />
								</Suspense>
							} />
							<Route path='/cart' element={
								<Suspense fallback={<div className="loading-page">Loading cart...</div>}>
									<CartPage />
								</Suspense>
							} />
							<Route path='/checkout' element={
								<Suspense fallback={<div className="loading-page">Loading checkout...</div>}>
									<CheckoutPage />
								</Suspense>
							} />
							<Route path='/order-confirmation/:id' element={
								<Suspense fallback={<div className="loading-page">Loading confirmation...</div>}>
									<OrderConfirmationPage />
								</Suspense>
							} />
							<Route path='/order-tracking/:trackingNumber' element={
								<Suspense fallback={<div className="loading-page">Loading tracking...</div>}>
									<OrderTrackingPage />
								</Suspense>
							} />
							<Route path='*' element={
								<Suspense fallback={<div className="loading-page">Loading...</div>}>
									<NotFoundPage />
								</Suspense>
							} />
						</Routes>
					</main>

					{/* Footer component (eagerly loaded) */}
					<Footer />

					{/* Toast notifications */}
					<ToastContainer />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
