/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
	RootState,
	fetchProductsStart,
	fetchProductsSuccess,
	fetchProductsFailure,
	fetchCategoriesSuccess,
	setCurrentPage,
	addToCart
} from "../store";
import { fetchProducts, fetchCategories } from "../services/api";
import ProductImage from "../components/ProductImage";

const ProductsPage: React.FC = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { products, loading, error, totalProducts, currentPage, categories } =
		useSelector((state: RootState) => state.products);

	// Inefficient use of multiple state variables instead of a single filter object
	const [category, setCategory] = useState<string>("");
	const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	// Even more unnecessary state
	const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
	const [animateFilters, setAnimateFilters] = useState(false);
	const [filterOpen, setFilterOpen] = useState(true);

	// Inefficient params parsing on every render
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const categoryParam = params.get("category");

		if (categoryParam) {
			setCategory(categoryParam);
		}
	}, [location]);

	// Inefficient way to load products - refetching on any state change
	useEffect(() => {
		const loadProducts = async () => {
			dispatch(fetchProductsStart());

			try {
				// Create params object inefficiently
				const params: any = {};
				if (category) params.category = category;
				if (minPrice !== undefined) params.minPrice = minPrice;
				if (maxPrice !== undefined) params.maxPrice = maxPrice;
				if (sortBy) params.sortBy = sortBy;
				if (sortDirection) params.sortDirection = sortDirection;

				// Add pagination params
				params.page = currentPage;
				params.limit = 10;

				// Inefficient fetch on every state change
				const data = await fetchProducts(params);
				dispatch(
					fetchProductsSuccess({
						products: data.data,
						total: data.total
					})
				);
			} catch (error) {
				dispatch(
					fetchProductsFailure(
						error instanceof Error ? error.message : "Unknown error"
					)
				);
			}
		};

		loadProducts();

		// Animate filters unnecessarily
		setAnimateFilters(true);
		const timeout = setTimeout(() => {
			setAnimateFilters(false);
		}, 500);

		return () => clearTimeout(timeout);
	}, [
		dispatch,
		category,
		minPrice,
		maxPrice,
		sortBy,
		sortDirection,
		currentPage
	]);

	// Load categories separately - inefficient multiple API calls
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const data = await fetchCategories();
				dispatch(fetchCategoriesSuccess(data));
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};

		loadCategories();
	}, [dispatch]);

	// Pagination controls - inefficient function recreation on every render
	const handlePageChange = (page: number) => {
		dispatch(setCurrentPage(page));

		// Scroll to top (inefficiently)
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});

		// Inefficient reflow forcing
		document.body.offsetHeight;
	};

	// Inefficient handler that recreates function on every render
	const handleAddToCart = (productId: number, name: string, price: number) => {
		dispatch(
			addToCart({
				product_id: productId,
				quantity: 1,
				price
			})
		);

		alert(`Added ${name} to cart!`);
	};

	// Calculate total pages inefficiently
	const totalPages = Math.ceil(totalProducts / 10);
	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	return (
		<div className='products-page'>
			<div className='products-header'>
				<h1>Our Products</h1>
				<div className='filter-toggle'>
					<button onClick={() => setFilterOpen(!filterOpen)}>
						{filterOpen ? "Hide Filters" : "Show Filters"}
					</button>
				</div>
			</div>

			<div className='products-content'>
				{/* Sidebar Filters - inefficiently animated */}
				<motion.aside
					className={`products-sidebar ${filterOpen ? "open" : ""}`}
					initial={{ x: -100, opacity: 0 }}
					animate={{
						x: filterOpen ? 0 : -100,
						opacity: filterOpen ? 1 : 0,
						scale: animateFilters ? 1.05 : 1 // Unnecessary animation
					}}
					transition={{ duration: 0.3 }}
				>
					<div className='filter-section'>
						<h3>Categories</h3>
						<ul className='category-list'>
							<li>
								<button
									className={category === "" ? "active" : ""}
									onClick={() => setCategory("")}
								>
									All Categories
								</button>
							</li>
							{categories.map((cat) => (
								<li key={cat}>
									<button
										className={category === cat ? "active" : ""}
										onClick={() => setCategory(cat)}
									>
										{cat.charAt(0).toUpperCase() + cat.slice(1)}
									</button>
								</li>
							))}
						</ul>
					</div>

					<div className='filter-section'>
						<h3>Price Range</h3>
						<div className='price-inputs'>
							<input
								type='number'
								placeholder='Min'
								value={minPrice === undefined ? "" : minPrice}
								onChange={(e) =>
									setMinPrice(
										e.target.value ? Number(e.target.value) : undefined
									)
								}
							/>
							<span>to</span>
							<input
								type='number'
								placeholder='Max'
								value={maxPrice === undefined ? "" : maxPrice}
								onChange={(e) =>
									setMaxPrice(
										e.target.value ? Number(e.target.value) : undefined
									)
								}
							/>
						</div>
					</div>

					<div className='filter-section'>
						<h3>Sort By</h3>
						<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
							<option value='name'>Name</option>
							<option value='price'>Price</option>
							<option value='rating'>Rating</option>
						</select>
						<div className='sort-direction'>
							<button
								className={sortDirection === "asc" ? "active" : ""}
								onClick={() => setSortDirection("asc")}
							>
								Ascending
							</button>
							<button
								className={sortDirection === "desc" ? "active" : ""}
								onClick={() => setSortDirection("desc")}
							>
								Descending
							</button>
						</div>
					</div>
				</motion.aside>

				{/* Products Grid */}
				<div className='products-grid-container'>
					{loading ? (
						<div className='loading-spinner'>Loading...</div>
					) : error ? (
						<div className='error-message'>Error: {error}</div>
					) : (
						<>
							<div className='products-grid'>
								{products.map((product) => (
									<motion.div
										key={product.id}
										className='product-card'
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										onMouseEnter={() => setHoveredProductId(product.id)}
										onMouseLeave={() => setHoveredProductId(null)}
									>
										<Link to={`/products/${product.id}`}>
											<div className='product-image'>
												<ProductImage
													src={product.image_url}
													alt={product.name}
													className='product-image'
												/>
											</div>
											<div className='product-info'>
												<h3>{product.name}</h3>
												<div className='product-price'>${product.price}</div>
												<div className='product-rating'>
													{"★".repeat(Math.floor(product.rating))}
													{"☆".repeat(5 - Math.floor(product.rating))}
													<span className='rating-value'>
														({product.rating})
													</span>
												</div>
											</div>
										</Link>
										<button
											className='add-to-cart-btn'
											onClick={() =>
												handleAddToCart(product.id, product.name, product.price)
											}
										>
											Add to Cart
										</button>

										{/* Inefficient conditional rendering */}
										{hoveredProductId === product.id && (
											<div className='quick-view'>
												<Link to={`/products/${product.id}`}>Quick View</Link>
											</div>
										)}
									</motion.div>
								))}
							</div>

							{/* Pagination */}
							<div className='pagination'>
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className='page-nav prev'
								>
									Previous
								</button>

								<div className='page-numbers'>
									{pageNumbers.map((page) => (
										<button
											key={page}
											onClick={() => handlePageChange(page)}
											className={currentPage === page ? "active" : ""}
										>
											{page}
										</button>
									))}
								</div>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className='page-nav next'
								>
									Next
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
