import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState, updateQuantity, removeFromCart, clearCart } from "../store";
import { fetchProductDetails } from "../services/api";
import ProductImage from "../components/ProductImage";

const CartPage: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const cartTotal = useSelector((state: RootState) => state.cart.total);

	// More efficient state management
	const [products, setProducts] = useState<Record<number, any>>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [couponCode, setCouponCode] = useState<string>("");
	const [discount, setDiscount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	// More efficient product fetching - fetches all products in parallel
	useEffect(() => {
		const loadProductDetails = async () => {
			if (cartItems.length === 0) {
				setLoading(false);
				return;
			}

			setLoading(true);
			const productIds = cartItems.map((item) => item.product_id);

			try {
				// Fetch all products in parallel
				const productPromises = productIds.map((id) => fetchProductDetails(id));
				const productResults = await Promise.all(productPromises);

				// Create a map of product ID to product details
				const productDetails: Record<number, any> = {};
				productResults.forEach((product, index) => {
					productDetails[productIds[index]] = product;
				});

				setProducts(productDetails);
			} catch (error) {
				console.error("Error loading product details:", error);
			} finally {
				setLoading(false);
			}
		};

		loadProductDetails();
	}, [cartItems]);

	// Efficient quantity change handler
	const handleQuantityChange = (productId: number, quantity: number) => {
		if (quantity < 1) quantity = 1;
		dispatch(updateQuantity({ productId, quantity }));
	};

	// Efficient remove item handler
	const handleRemoveItem = (productId: number) => {
		dispatch(removeFromCart(productId));
	};

	// Efficient coupon handling
	const handleApplyCoupon = () => {
		setError(null);

		if (couponCode === "SAVE10") {
			setDiscount(cartTotal * 0.1);
		} else if (couponCode === "SAVE20") {
			setDiscount(cartTotal * 0.2);
		} else {
			setError("Invalid coupon code. Try SAVE10 or SAVE20");
		}
	};

	// Checkout handler
	const handleCheckout = () => {
		navigate("/checkout");
	};

	// Calculate order summary values using useMemo to avoid unnecessary recalculations
	const orderSummary = useMemo(() => {
		const subtotal = cartTotal;
		const tax = subtotal * 0.1; // 10% tax
		const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
		const total = subtotal + tax + shipping - discount;

		return { subtotal, tax, shipping, total };
	}, [cartTotal, discount]);

	return (
		<div className='cart-page'>
			<h1>Your Shopping Cart</h1>

			{cartItems.length === 0 ? (
				<div className='empty-cart'>
					<h2>Your cart is empty</h2>
					<p>Looks like you haven't added any products to your cart yet.</p>
					<Link to='/products' className='continue-shopping-btn'>
						Continue Shopping
					</Link>
				</div>
			) : (
				<div className='cart-content'>
					<div className='cart-items'>
						<table className='cart-table'>
							<thead>
								<tr>
									<th>Product</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Total</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item) => {
									const product = products[item.product_id];

									return (
										<tr key={item.product_id}>
											<td className='product-cell' data-label='Product'>
												{product ? (
													<div className='cart-product'>
														<ProductImage
															src={product.image_url}
															alt={product.name}
															className='cart-product-image'
														/>
														<div className='cart-product-info'>
															<h3>{product.name}</h3>
															<div className='product-category'>
																{product.category}
															</div>
														</div>
													</div>
												) : (
													<div className='loading-placeholder'>
														Loading product...
													</div>
												)}
											</td>
											<td className='price-cell' data-label='Price'>
												${item.price}
											</td>
											<td className='quantity-cell' data-label='Quantity'>
												<div className='quantity-controls'>
													<button
														onClick={() =>
															handleQuantityChange(
																item.product_id,
																item.quantity - 1
															)
														}
														className='quantity-btn'
													>
														-
													</button>
													<input
														type='number'
														min='1'
														value={item.quantity}
														onChange={(e) =>
															handleQuantityChange(
																item.product_id,
																parseInt(e.target.value) || 1
															)
														}
														className='quantity-input'
													/>
													<button
														onClick={() =>
															handleQuantityChange(
																item.product_id,
																item.quantity + 1
															)
														}
														className='quantity-btn'
													>
														+
													</button>
												</div>
											</td>
											<td className='total-cell' data-label='Total'>
												${(item.price * item.quantity).toFixed(2)}
											</td>
											<td className='actions-cell' data-label='Actions'>
												<button
													onClick={() => handleRemoveItem(item.product_id)}
													className='remove-btn'
												>
													Remove
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						<div className='cart-actions'>
							<Link to='/products' className='continue-shopping-btn'>
								Continue Shopping
							</Link>
							<button
								onClick={() => dispatch(clearCart())}
								className='clear-cart-btn'
							>
								Clear Cart
							</button>
						</div>
					</div>

					<div className='cart-summary'>
						<h2>Order Summary</h2>

						<div className='summary-row'>
							<span>Subtotal:</span>
							<span>${orderSummary.subtotal.toFixed(2)}</span>
						</div>

						<div className='summary-row'>
							<span>Tax (10%):</span>
							<span>${orderSummary.tax.toFixed(2)}</span>
						</div>

						<div className='summary-row'>
							<span>Shipping:</span>
							<span>
								{orderSummary.shipping === 0
									? "Free"
									: `$${orderSummary.shipping.toFixed(2)}`}
							</span>
						</div>

						{discount > 0 && (
							<div className='summary-row discount'>
								<span>Discount:</span>
								<span>-${discount.toFixed(2)}</span>
							</div>
						)}

						<div className='summary-total'>
							<span>Total:</span>
							<span>${orderSummary.total.toFixed(2)}</span>
						</div>

						<div className='coupon-section'>
							<h3>Apply Coupon</h3>
							<div className='coupon-form'>
								<input
									type='text'
									placeholder='Enter coupon code'
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value)}
								/>
								<button onClick={handleApplyCoupon}>Apply</button>
							</div>
							{error && <div className='coupon-error'>{error}</div>}
							{discount > 0 && (
								<div className='coupon-success'>
									Coupon applied successfully!
								</div>
							)}
						</div>

						<button
							onClick={handleCheckout}
							className='checkout-btn'
							disabled={cartItems.length === 0}
						>
							Proceed to Checkout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CartPage;
