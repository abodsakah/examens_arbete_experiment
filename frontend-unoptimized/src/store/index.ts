import {
	configureStore,
	createSlice,
	PayloadAction,
	combineReducers
} from "@reduxjs/toolkit";

// Product Types
export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image_url: string;
	category: string;
	stock: number;
	featured: boolean;
	rating: number;
}

// Order Types
export interface OrderItem {
	product_id: number;
	quantity: number;
	price: number;
}

export interface Order {
	id?: number;
	customer_name: string;
	customer_email: string;
	customer_address: string;
	total_amount: number;
	status?: string;
	tracking_number?: string;
	items: OrderItem[];
}

// Tracking Types
export interface TrackingUpdate {
	status: string;
	location: string;
	timestamp: Date;
	details: string;
}

// Cart State
interface CartState {
	items: OrderItem[];
	total: number;
	count: number;
}

// Products State
interface ProductsState {
	products: Product[];
	loading: boolean;
	error: string | null;
	totalProducts: number;
	currentPage: number;
	featuredProducts: Product[];
	productDetails: Product | null;
	categories: string[];
}

// User State
interface UserState {
	isLoggedIn: boolean;
	name: string;
	email: string;
	orders: Order[];
}

// UI State
interface UIState {
	darkMode: boolean;
	notifications: { id: string; message: string; type: string }[];
	isMobileMenuOpen: boolean;
	isFiltersVisible: boolean;
	activeModal: string | null;
	searchQuery: string;
	isLoading: { [key: string]: boolean };
}

// Create slices (reducers + actions)

// Cart slice
const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: [],
		total: 0,
		count: 0
	} as CartState,
	reducers: {
		addToCart: (state, action: PayloadAction<OrderItem>) => {
			const existingItem = state.items.find(
				(item) => item.product_id === action.payload.product_id
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}
			state.total = state.items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
		},
		removeFromCart: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(
				(item) => item.product_id !== action.payload
			);
			state.total = state.items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
		},
		updateQuantity: (
			state,
			action: PayloadAction<{ productId: number; quantity: number }>
		) => {
			const item = state.items.find(
				(item) => item.product_id === action.payload.productId
			);
			if (item) {
				item.quantity = action.payload.quantity;
			}
			state.total = state.items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
		},
		clearCart: (state) => {
			state.items = [];
			state.total = 0;
			state.count = 0;
		}
	}
});

// Products slice
const productsSlice = createSlice({
	name: "products",
	initialState: {
		products: [],
		loading: false,
		error: null,
		totalProducts: 0,
		currentPage: 1,
		featuredProducts: [],
		productDetails: null,
		categories: []
	} as ProductsState,
	reducers: {
		fetchProductsStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchProductsSuccess: (
			state,
			action: PayloadAction<{ products: Product[]; total: number }>
		) => {
			state.products = action.payload.products;
			state.totalProducts = action.payload.total;
			state.loading = false;
		},
		fetchProductsFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},
		fetchFeaturedProductsSuccess: (state, action: PayloadAction<Product[]>) => {
			state.featuredProducts = action.payload;
		},
		fetchProductDetailsSuccess: (state, action: PayloadAction<Product>) => {
			state.productDetails = action.payload;
		},
		fetchCategoriesSuccess: (state, action: PayloadAction<string[]>) => {
			state.categories = action.payload;
		}
	}
});

// User slice
const userSlice = createSlice({
	name: "user",
	initialState: {
		isLoggedIn: false,
		name: "",
		email: "",
		orders: []
	} as UserState,
	reducers: {
		login: (state, action: PayloadAction<{ name: string; email: string }>) => {
			state.isLoggedIn = true;
			state.name = action.payload.name;
			state.email = action.payload.email;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.name = "";
			state.email = "";
			state.orders = [];
		},
		fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
			state.orders = action.payload;
		}
	}
});

// UI slice
const uiSlice = createSlice({
	name: "ui",
	initialState: {
		darkMode: false,
		notifications: [],
		isMobileMenuOpen: false,
		isFiltersVisible: true,
		activeModal: null,
		searchQuery: "",
		isLoading: {}
	} as UIState,
	reducers: {
		toggleDarkMode: (state) => {
			state.darkMode = !state.darkMode;
		},
		addNotification: (
			state,
			action: PayloadAction<{ id: string; message: string; type: string }>
		) => {
			state.notifications.push(action.payload);
		},
		removeNotification: (state, action: PayloadAction<string>) => {
			state.notifications = state.notifications.filter(
				(n) => n.id !== action.payload
			);
		},
		toggleMobileMenu: (state) => {
			state.isMobileMenuOpen = !state.isMobileMenuOpen;
		},
		toggleFilters: (state) => {
			state.isFiltersVisible = !state.isFiltersVisible;
		},
		setActiveModal: (state, action: PayloadAction<string | null>) => {
			state.activeModal = action.payload;
		},
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},
		setLoading: (
			state,
			action: PayloadAction<{ key: string; isLoading: boolean }>
		) => {
			state.isLoading[action.payload.key] = action.payload.isLoading;
		}
	}
});

// Combine all reducers
const rootReducer = combineReducers({
	cart: cartSlice.reducer,
	products: productsSlice.reducer,
	user: userSlice.reducer,
	ui: uiSlice.reducer
});

// Configure store with middleware
const store = configureStore({
	reducer: rootReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
	cartSlice.actions;
export const {
	fetchProductsStart,
	fetchProductsSuccess,
	fetchProductsFailure,
	setCurrentPage,
	fetchFeaturedProductsSuccess,
	fetchProductDetailsSuccess,
	fetchCategoriesSuccess
} = productsSlice.actions;
export const { login, logout, fetchOrdersSuccess } = userSlice.actions;
export const {
	toggleDarkMode,
	addNotification,
	removeNotification,
	toggleMobileMenu,
	toggleFilters,
	setActiveModal,
	setSearchQuery,
	setLoading
} = uiSlice.actions;

export default store;
