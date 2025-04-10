import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, toggleMobileMenu, setSearchQuery } from "../store";
import Logo from "../assets/images/logo.png";

// Inefficient and unnecessarily complex header component
const Header: React.FC = () => {
	const dispatch = useDispatch();
	const cartCount = useSelector((state: RootState) => state.cart.count);
	const isMobileMenuOpen = useSelector(
		(state: RootState) => state.ui.isMobileMenuOpen
	);
	const searchQuery = useSelector((state: RootState) => state.ui.searchQuery);

	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [headerVisible, setHeaderVisible] = useState(true);
	const [searchOpen, setSearchOpen] = useState(false);

	// Inefficient scroll listener that runs on every scroll event
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			if (scrollTop > lastScrollTop && scrollTop > 100) {
				setHeaderVisible(false);
			} else {
				setHeaderVisible(true);
			}
			setLastScrollTop(scrollTop);

			// Force layout recalculation for every scroll
			const header = document.querySelector("header");
			if (header) {
				const height = header.offsetHeight;
				const width = header.offsetWidth;
				console.log(`Header dimensions: ${width}x${height}`);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollTop]);

	// Unnecessary re-rendering countdown timer
	const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	// Inefficient search handler with no debounce
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchQuery(e.target.value));

		// Unnecessary computation on every keystroke
		let result = 0;
		for (let i = 0; i < 10000; i++) {
			result += Math.random();
		}
		console.log("Search calculation:", result);
	};

	return (
		<header className={`site-header ${headerVisible ? "" : "hidden"}`}>
			<div className='header-container'>
				<div className='logo-container'>
					<Link to='/'>
						<img src={Logo} alt='WebShop Logo' className='logo' />
					</Link>
				</div>

				<nav className={`main-nav ${isMobileMenuOpen ? "open" : ""}`}>
					<ul className='nav-links'>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/products'>Products</Link>
						</li>
						<li>
							<Link to='/products?category=electronics'>Electronics</Link>
						</li>
						<li>
							<Link to='/products?category=furniture'>Furniture</Link>
						</li>
						<li>
							<Link to='/products?category=accessories'>Accessories</Link>
						</li>
						<li>
							<Link to='/order-tracking'>Track Order</Link>
						</li>
					</ul>
				</nav>

				<div className='header-actions'>
					{/* Unnecessary sale countdown */}
					<div className='sale-countdown'>
						<span>Sale ends in: </span>
						<span className='countdown'>{formatTime(timeLeft)}</span>
					</div>

					<div className={`search-container ${searchOpen ? "open" : ""}`}>
						<button
							className='search-toggle'
							onClick={() => setSearchOpen(!searchOpen)}
						>
							🔍
						</button>

						{searchOpen && (
							<input
								type='text'
								placeholder='Search...'
								value={searchQuery}
								onChange={handleSearchChange}
								className='search-input'
							/>
						)}
					</div>

					<Link to='/cart' className='cart-icon'>
						🛒 <span className='cart-count'>{cartCount}</span>
					</Link>

					<button
						className='mobile-menu-toggle'
						onClick={() => dispatch(toggleMobileMenu())}
					>
						{isMobileMenuOpen ? "✕" : "☰"}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
