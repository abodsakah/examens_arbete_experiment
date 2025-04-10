import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation
} from "react-router-dom";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import store from "./store";
import "./App.css";

// Import optimized components with code splitting
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LoadingFallback, ErrorFallback } from "./components/Fallbacks";

// Eagerly load home page for better initial load performance
import HomePage from "./pages/HomePage";

// Lazy load all other pages to optimize bundle size
const ProductsPage = lazy(
	() => import(/* webpackChunkName: "products" */ "./pages/ProductsPage")
);
const ProductDetailsPage = lazy(
	() =>
		import(
			/* webpackChunkName: "product-details" */ "./pages/ProductDetailsPage"
		)
);
const CartPage = lazy(
	() => import(/* webpackChunkName: "cart" */ "./pages/CartPage")
);
const CheckoutPage = lazy(
	() => import(/* webpackChunkName: "checkout" */ "./pages/CheckoutPage")
);
const OrderConfirmationPage = lazy(
	() =>
		import(
			/* webpackChunkName: "order-confirmation" */ "./pages/OrderConfirmationPage"
		)
);
const OrderTrackingPage = lazy(
	() =>
		import(/* webpackChunkName: "order-tracking" */ "./pages/OrderTrackingPage")
);
const NotFoundPage = lazy(
	() => import(/* webpackChunkName: "not-found" */ "./pages/NotFoundPage")
);

// ScrollToTop component to handle page transitions
const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

/**
 * App Component - Main application container
 * Optimized for performance with:
 * - Code splitting and lazy loading
 * - Error boundaries for resilience
 * - Resource prefetching
 * - Reduced unnecessary renders
 */
function App() {
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize app resources only once
	useEffect(() => {
		// Mark critical rendering path complete
		if ("performance" in window && "mark" in window.performance) {
			performance.mark("app-rendered");
			performance.measure("app-startup", "app-rendered");
		}

		// Prefetch important routes for better UX
		const prefetchRoutes = async () => {
			if ("requestIdleCallback" in window) {
				// Use idle time to prefetch routes
				window.requestIdleCallback(() => {
					// Dynamically import components that are likely to be used soon
					import("./pages/ProductsPage");
					import("./pages/CartPage");
				});
			}
		};

		prefetchRoutes();
		setIsInitialized(true);
	}, []);

	// ErrorBoundary error handler
	const handleError = useCallback((error: Error) => {
		// Log errors to monitoring service in production
		if (process.env.NODE_ENV === "production") {
			// Here you would typically log to a service like Sentry
			console.error("Application error:", error);
		}
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<ScrollToTop />
				<div className='app-container'>
					<Header />

					<main className='main-content'>
						<ErrorBoundary
							FallbackComponent={ErrorFallback}
							onError={handleError}
						>
							<Routes>
								{/* Home page is eagerly loaded for optimal initial load */}
								<Route path='/' element={<HomePage />} />

								{/* All other routes are lazy-loaded with Suspense */}
								<Route
									path='/products'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<ProductsPage />
										</Suspense>
									}
								/>

								<Route
									path='/products/:id'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<ProductDetailsPage />
										</Suspense>
									}
								/>

								<Route
									path='/cart'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<CartPage />
										</Suspense>
									}
								/>

								<Route
									path='/checkout'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<CheckoutPage />
										</Suspense>
									}
								/>

								<Route
									path='/order-confirmation/:id'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<OrderConfirmationPage />
										</Suspense>
									}
								/>

								<Route
									path='/order-tracking/:trackingNumber'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<OrderTrackingPage />
										</Suspense>
									}
								/>

								<Route
									path='*'
									element={
										<Suspense fallback={<LoadingFallback />}>
											<NotFoundPage />
										</Suspense>
									}
								/>
							</Routes>
						</ErrorBoundary>
					</main>

					<Footer />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
