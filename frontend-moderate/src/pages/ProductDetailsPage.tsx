/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Chart } from "chart.js/auto";
import {
	fetchProductDetails,
	fetchProductRecommendations,
	fetchHighResolutionImages,
	fetchDetailedProductReport
} from "../services/api";
import { addToCart, addNotification } from "../store";

const ProductDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();

	// Inefficient use of many state variables
	const [product, setProduct] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState<number>(1);
	const [recommendations, setRecommendations] = useState<any[]>([]);
	const [highResImages, setHighResImages] = useState<any>(null);
	const [detailedReport, setDetailedReport] = useState<any>(null);
	const [activeTab, setActiveTab] = useState<string>("description");
	const [selectedImage, setSelectedImage] = useState<string>("");
	const [chartInstance, setChartInstance] = useState<Chart | null>(null);

	// Inefficient loading of everything at once
	useEffect(() => {
		const loadProductData = async () => {
			if (!id) return;

			setLoading(true);
			setError(null);

			try {
				// Load all data at once inefficiently
				const productId = parseInt(id);

				// Get product details
				const productData = await fetchProductDetails(productId);
				setProduct(productData);
				setSelectedImage("http://localhost:3000" + productData.image_url);

				// Inefficiently load large recommendations dataset
				const recommendationsData = await fetchProductRecommendations(
					productId,
					"large"
				);
				setRecommendations(recommendationsData);

				// Load high-resolution images
				const imagesData = await fetchHighResolutionImages(productId);
				setHighResImages(imagesData);

				// Load detailed report with large dataset
				const reportData = await fetchDetailedProductReport(productId);
				setDetailedReport(reportData);

				setLoading(false);
			} catch (error) {
				setError("Failed to load product");
				setLoading(false);
				console.error("Error loading product:", error);
			}
		};

		loadProductData();

		// Cleanup chart on unmount
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [id]);

	// Inefficiently initialize chart after data loads
	useEffect(() => {
		if (detailedReport && activeTab === "stats") {
			// Clean up previous chart
			if (chartInstance) {
				chartInstance.destroy();
			}

			// Get chart context and draw inefficiently
			const ctx = document.getElementById("salesChart") as HTMLCanvasElement;
			if (ctx) {
				const newChart = new Chart(ctx, {
					type: "line",
					data: {
						labels: detailedReport.salesTrend.map((item: any) => item.date),
						datasets: [
							{
								label: "Sales Trend",
								data: detailedReport.salesTrend.map(
									(item: any) => item.quantity
								),
								borderColor: "rgb(75, 192, 192)",
								backgroundColor: "rgba(75, 192, 192, 0.2)",
								tension: 0.1
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: "top"
							},
							title: {
								display: true,
								text: "30-Day Sales Trend"
							}
						}
					}
				});

				setChartInstance(newChart);
			}
		}
	}, [detailedReport, activeTab]);

	// Inefficient quantity handlers
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			setQuantity(value);
		}
	};

	const increaseQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	// Inefficient add to cart handler
	const handleAddToCart = () => {
		if (!product) return;

		// Unnecessary complex calculation
		let totalPrice = 0;
		for (let i = 0; i < quantity; i++) {
			totalPrice += product.price;
		}

		dispatch(
			addToCart({
				product_id: product.id,
				quantity,
				price: product.price
			})
		);

		dispatch(
			addNotification({
				id: Date.now().toString(),
				message: `Added ${quantity} ${product.name} to cart`,
				type: "success"
			})
		);

		// Force layout recalculation
		document.body.offsetHeight;
	};

	// Slider settings for recommendations
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	if (loading) {
		return (
			<div className='loading-screen'>
				<div className='spinner'></div>
				<p>Loading product...</p>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className='error-container'>
				<h2>Error</h2>
				<p>{error || "Product not found"}</p>
				<Link to='/products' className='back-button'>
					Back to Products
				</Link>
			</div>
		);
	}

	return (
		<div className='product-details-page'>
			<div className='product-details-container'>
				<div className='product-image-container'>
					<div className='main-image'>
						<img
							src={selectedImage}
							alt={product.name}
							className='product-main-image'
						/>
					</div>

					{/* High-res image options */}
					{highResImages && (
						<div className='image-options'>
							<button
								className={
									selectedImage === "http://localhost:3000" + product.image_url
										? "active"
										: ""
								}
								onClick={() =>
									setSelectedImage("http://localhost:3000" + product.image_url)
								}
							>
								Standard
							</button>
							<button
								className={selectedImage === highResImages.high ? "active" : ""}
								onClick={() => setSelectedImage(highResImages.high)}
							>
								High Res
							</button>
							<button
								className={
									selectedImage === highResImages.ultra ? "active" : ""
								}
								onClick={() => setSelectedImage(highResImages.ultra)}
							>
								Ultra HD
							</button>
						</div>
					)}
				</div>

				<div className='product-info-container'>
					<h1 className='product-title'>{product.name}</h1>

					<div className='product-rating'>
						{"★".repeat(Math.floor(product.rating))}
						{"☆".repeat(5 - Math.floor(product.rating))}
						<span className='rating-value'>({product.rating})</span>
					</div>

					<div className='product-price'>${product.price}</div>

					<div className='product-meta'>
						<div className='product-category'>
							<span>Category:</span> {product.category}
						</div>
						<div className='product-stock'>
							<span>Availability:</span>{" "}
							{product.stock > 0
								? `In Stock (${product.stock} available)`
								: "Out of Stock"}
						</div>
					</div>

					<div className='product-description'>
						<p>{product.description}</p>
					</div>

					<div className='product-actions'>
						<div className='quantity-controls'>
							<button onClick={decreaseQuantity} className='quantity-btn'>
								-
							</button>
							<input
								type='number'
								min='1'
								value={quantity}
								onChange={handleQuantityChange}
								className='quantity-input'
							/>
							<button onClick={increaseQuantity} className='quantity-btn'>
								+
							</button>
						</div>

						<button
							className='add-to-cart-btn'
							onClick={handleAddToCart}
							disabled={product.stock === 0}
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>

			{/* Product Tabs */}
			<div className='product-tabs'>
				<div className='tabs-header'>
					<button
						className={activeTab === "description" ? "active" : ""}
						onClick={() => setActiveTab("description")}
					>
						Description
					</button>
					<button
						className={activeTab === "specs" ? "active" : ""}
						onClick={() => setActiveTab("specs")}
					>
						Specifications
					</button>
					<button
						className={activeTab === "reviews" ? "active" : ""}
						onClick={() => setActiveTab("reviews")}
					>
						Reviews
					</button>
					<button
						className={activeTab === "stats" ? "active" : ""}
						onClick={() => setActiveTab("stats")}
					>
						Sales Stats
					</button>
				</div>

				<div className='tabs-content'>
					{activeTab === "description" && (
						<div className='tab-pane'>
							<h3>Product Description</h3>
							<p>{product.description}</p>
							{detailedReport && (
								<>
									<h4>Materials</h4>
									<ul>
										{Object.entries(detailedReport.materialDetails).map(
											([key, value]) => (
												<li key={key}>
													<strong>{key}:</strong> {value as string}
												</li>
											)
										)}
									</ul>

									<h4>Sustainability</h4>
									<p>
										Sustainability Score: {detailedReport.sustainabilityScore}
										/100
									</p>
									<p>
										Production Location: {detailedReport.productionLocation}
									</p>
								</>
							)}
						</div>
					)}

					{activeTab === "specs" && detailedReport && (
						<div className='tab-pane'>
							<h3>Technical Specifications</h3>
							<table className='specs-table'>
								<tbody>
									{Object.entries(detailedReport.specifications).map(
										([key, value]) => (
											<tr key={key}>
												<td>{key}</td>
												<td>{value as string}</td>
											</tr>
										)
									)}
								</tbody>
							</table>

							<h4>Carbon Footprint</h4>
							<table className='carbon-table'>
								<tbody>
									{Object.entries(detailedReport.carbonFootprint).map(
										([key, value]) => (
											<tr key={key}>
												<td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
												<td>{value as number} kg CO2e</td>
											</tr>
										)
									)}
								</tbody>
							</table>

							<h4>Shipping Options</h4>
							<table className='shipping-table'>
								<thead>
									<tr>
										<th>Method</th>
										<th>Price</th>
										<th>Estimated Delivery</th>
									</tr>
								</thead>
								<tbody>
									{detailedReport.shippingOptions.map(
										(option: any, index: number) => (
											<tr key={index}>
												<td>{option.method}</td>
												<td>${option.price.toFixed(2)}</td>
												<td>{option.estimated_days}</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					)}

					{activeTab === "reviews" && detailedReport && (
						<div className='tab-pane'>
							<h3>Customer Reviews</h3>
							<div className='reviews-summary'>
								<div className='average-rating'>
									<span className='rating-number'>
										{product.rating.toFixed(1)}
									</span>
									<div className='rating-stars'>
										{"★".repeat(Math.floor(product.rating))}
										{"☆".repeat(5 - Math.floor(product.rating))}
									</div>
									<span className='review-count'>
										Based on {detailedReport.reviews.length} reviews
									</span>
								</div>
							</div>

							<div className='reviews-list'>
								{detailedReport.reviews.map((review: any) => (
									<div key={review.id} className='review-card'>
										<div className='review-header'>
											<div className='review-rating'>
												{"★".repeat(review.rating)}
												{"☆".repeat(5 - review.rating)}
											</div>
											<div className='review-title'>{review.title}</div>
										</div>
										<div className='review-meta'>
											<span className='review-author'>By {review.user}</span>
											<span className='review-date'>on {review.date}</span>
											{review.verified_purchase && (
												<span className='verified-badge'>
													Verified Purchase
												</span>
											)}
										</div>
										<div className='review-content'>{review.comment}</div>
										<div className='review-helpful'>
											<span>Helpful?</span>
											<button className='helpful-btn'>
												Yes ({review.helpful_votes})
											</button>
											<button className='helpful-btn'>No</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === "stats" && detailedReport && (
						<div className='tab-pane'>
							<h3>Sales Statistics</h3>
							<div className='sales-chart-container'>
								<canvas id='salesChart'></canvas>
							</div>

							<div className='stats-grid'>
								<div className='stat-card'>
									<h4>Warranty Information</h4>
									<p>{detailedReport.warrantyInformation.basic_coverage}</p>
									<h5>Extended Options:</h5>
									<ul>
										{detailedReport.warrantyInformation.extended_options.map(
											(option: any, index: number) => (
												<li key={index}>
													<strong>{option.name}</strong> - $
													{option.price.toFixed(2)}
													<p>{option.description}</p>
												</li>
											)
										)}
									</ul>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Recommendations slider */}
			{recommendations.length > 0 && (
				<section className='recommendations-section'>
					<h2>You May Also Like</h2>
					<div className='recommendations-slider'>
						<Slider {...sliderSettings}>
							{recommendations.map((item) => (
								<div key={item.id} className='recommendation-slide'>
									<div className='recommendation-card'>
										<Link to={`/products/${item.id}`}>
											<div className='recommendation-image'>
												<img
													src={"http://localhost:3000" + item.image_url}
													alt={item.name}
												/>
											</div>
											<div className='recommendation-info'>
												<h3>{item.name}</h3>
												<div className='recommendation-price'>
													${item.price}
												</div>
											</div>
										</Link>
									</div>
								</div>
							))}
						</Slider>
					</div>
				</section>
			)}
		</div>
	);
};

export default ProductDetailsPage;
