/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { RootState, Product, fetchFeaturedProductsSuccess } from "../store";
import { fetchFeaturedProducts } from "../services/api";
import ProductImage from "../components/ProductImage";

interface Banner {
	id: number;
	title: string;
	subtitle: string;
	image: string;
	link: string;
}

const HomePage: React.FC = () => {
	const dispatch = useDispatch();
	const featuredProducts = useSelector(
		(state: RootState) => state.products.featuredProducts
	);

	// Unnecessary state updates for animations
	const [animationCounter, setAnimationCounter] = useState(0);

	// Load featured products
	useEffect(() => {
		const loadFeaturedProducts = async () => {
			try {
				// Inefficient - fetch all products on every render
				const data = await fetchFeaturedProducts();
				dispatch(fetchFeaturedProductsSuccess(data));
			} catch (error) {
				console.error("Error fetching featured products:", error);
			}
		};

		loadFeaturedProducts();

		// Unnecessary interval for animations
		const interval = setInterval(() => {
			setAnimationCounter((prev) => prev + 1);
		}, 3000);

		return () => clearInterval(interval);
	}, [dispatch, animationCounter]); // Inefficiently depends on animationCounter

	// Banner data
	const banners: Banner[] = [
		{
			id: 1,
			title: "Summer Sale",
			subtitle: "Up to 50% off on selected items",
			image: "/images/banner1.jpg",
			link: "/products?sale=true"
		},
		{
			id: 2,
			title: "New Arrivals",
			subtitle: "Check out our latest products",
			image: "/images/banner2.jpg",
			link: "/products?new=true"
		},
		{
			id: 3,
			title: "Electronics",
			subtitle: "Top-rated electronics and gadgets",
			image: "/images/banner3.jpg",
			link: "/products?category=electronics"
		}
	];

	// Unnecessarily complex slider settings
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		adaptiveHeight: true,
		beforeChange: (current: number, next: number) =>
			console.log(`Slider changing from ${current} to ${next}`),
		afterChange: (current: number) =>
			console.log(`Slider changed to ${current}`),
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false
				}
			}
		]
	};

	return (
		<div className='home-page'>
			{/* Banner slider */}
			<div className='banner-slider'>
				<Slider {...sliderSettings}>
					{banners.map((banner) => (
						<div key={banner.id} className='banner-slide'>
							<div
								className='banner-image'
								style={{ backgroundImage: `url(${banner.image})` }}
							>
								<div className='banner-content'>
									<h2>{banner.title}</h2>
									<p>{banner.subtitle}</p>
									<Link to={banner.link} className='banner-button'>
										Shop Now
									</Link>
								</div>
							</div>
						</div>
					))}
				</Slider>
			</div>

			{/* Featured Products */}
			<section className='featured-products'>
				<h2>Featured Products</h2>
				<div className='products-grid'>
					{featuredProducts.map((product) => (
						<motion.div
							key={product.id}
							className='product-card'
							initial={{ opacity: 0, y: 20 }}
							animate={{
								opacity: 1,
								y: 0,
								rotate: animationCounter % 2 === 0 ? 0 : 1 // Unnecessary animation
							}}
							transition={{ duration: 0.5 }}
						>
							<Link to={`/products/${product.id}`}>
								<div className='product-image'>
									<ProductImage src={product.image_url} alt={product.name} />
								</div>
								<div className='product-info'>
									<h3>{product.name}</h3>
									<div className='product-price'>${product.price}</div>
									<div className='product-rating'>
										{"★".repeat(Math.floor(product.rating))}
										{"☆".repeat(5 - Math.floor(product.rating))}
										<span className='rating-value'>({product.rating})</span>
									</div>
								</div>
							</Link>
							<button className='add-to-cart-btn'>Add to Cart</button>
						</motion.div>
					))}
				</div>
				<div className='view-all-container'>
					<Link to='/products' className='view-all-btn'>
						View All Products
					</Link>
				</div>
			</section>

			{/* Categories Section */}
			<section className='categories-section'>
				<h2>Shop by Category</h2>
				<div className='categories-grid'>
					<div className='category-card'>
						<Link to='/products?category=electronics'>
							<div className='category-image'>
								<ProductImage src='/images/product1.png' alt='Electronics' />
							</div>
							<h3>Electronics</h3>
						</Link>
					</div>
					<div className='category-card'>
						<Link to='/products?category=furniture'>
							<div className='category-image'>
								<ProductImage src='/images/product2.png' alt='Furniture' />
							</div>
							<h3>Furniture</h3>
						</Link>
					</div>
					<div className='category-card'>
						<Link to='/products?category=accessories'>
							<div className='category-image'>
								<ProductImage src='/images/product3.png' alt='Accessories' />
							</div>
							<h3>Accessories</h3>
						</Link>
					</div>
				</div>
			</section>

			{/* Promotion Section */}
			<section className='promotion-section'>
				<div className='promotion-content'>
					<h2>Summer Special Offer</h2>
					<p>Get up to 40% off on selected items. Limited time offer!</p>
					<Link to='/products?sale=true' className='promotion-button'>
						Shop Now
					</Link>
				</div>
			</section>
		</div>
	);
};

export default HomePage;