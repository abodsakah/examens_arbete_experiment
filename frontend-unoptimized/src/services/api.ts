import axios from "axios";
import { Product, Order, TrackingUpdate } from "../store";

// Inefficiently configured API client
const api = axios.create({
	baseURL: "http://157.180.66.56:3000/api/v1",
	timeout: 30000, // Unnecessarily long timeout
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
		Pragma: "no-cache",
		Expires: "0"
	},
	withCredentials: false // Allow cross-domain requests
});

// Inefficient product fetching with no batching or pagination handling on frontend
export const fetchProducts = async (params: any = {}) => {
	// Inefficiently copy and manipulate params object
	const queryParams = { ...params };

	// Call API for all products at once instead of paginating
	const response = await api.get("/products", { params: queryParams });
	return response.data;
};

// Fetch product details inefficiently (separate call for each product)
export const fetchProductDetails = async (productId: number) => {
	const response = await api.get(`/products/${productId}`);
	return response.data.data;
};

// Inefficient featured products fetching
export const fetchFeaturedProducts = async () => {
	const response = await api.get("/products/featured");
	return response.data.data;
};

// Fetch all product categories
export const fetchCategories = async () => {
	const response = await api.get("/products/categories");
	return response.data.data;
};

// Search products (no debounce in implementation)
export const searchProducts = async (query: string) => {
	const response = await api.get(`/products/search?q=${query}`);
	return response.data.data;
};

// Fetch product recommendations (inefficiently handling large data)
export const fetchProductRecommendations = async (
	productId: number,
	size: "small" | "medium" | "large" = "medium"
) => {
	const response = await api.get(
		`/products/${productId}/recommendations?size=${size}`
	);
	return response.data.data;
};

// Fetch high-resolution images inefficiently
export const fetchHighResolutionImages = async (productId: number) => {
	const response = await api.get(`/products/${productId}/high-res-images`);
	return response.data.data;
};

// Fetch detailed product report (large payload)
export const fetchDetailedProductReport = async (productId: number) => {
	const response = await api.get(`/products/${productId}/detailed-report`);
	return response.data.data;
};

// Create order with no validation
export const createOrder = async (orderData: Order) => {
	const response = await api.post("/orders", {
		orderData: {
			customer_name: orderData.customer_name,
			customer_email: orderData.customer_email,
			customer_address: orderData.customer_address,
			total_amount: orderData.total_amount
		},
		items: orderData.items
	});
	return response.data.data;
};

// Get order details
export const fetchOrderDetails = async (orderId: number) => {
	const response = await api.get(`/orders/${orderId}`);
	return response.data.data;
};

// Get order tracking
export const fetchOrderTracking = async (orderId: number) => {
	const response = await api.get(`/orders/${orderId}/tracking`);
	return response.data.data;
};

// Track order by tracking number
export const trackOrderByNumber = async (trackingNumber: string) => {
	const response = await api.get(`/orders/tracking/${trackingNumber}`);
	return response.data.data;
};

// Submit performance benchmark data
export const submitBenchmarkData = async (data: any) => {
	const response = await api.post("/benchmark", data);
	return response.data;
};

// Function to simulate network load by making multiple unnecessary requests
export const loadTestResources = async () => {
	console.log("Loading extra resources...");

	// Make multiple unnecessary requests to test performance
	const promises = [];

	for (let i = 1; i <= 5; i++) {
		promises.push(api.get(`/products/${i}`));
	}

	// Get all categories multiple times
	for (let i = 0; i < 3; i++) {
		promises.push(api.get("/products/categories"));
	}

	// Get featured products multiple times
	for (let i = 0; i < 3; i++) {
		promises.push(api.get("/products/featured"));
	}

	// Wait for all unnecessary requests to complete
	await Promise.all(promises);

	return true;
};

export default api;
