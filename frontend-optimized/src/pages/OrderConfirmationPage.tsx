import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchOrderDetails } from "../services/api";
import confetti from "canvas-confetti";
import { Order, OrderItem } from "../types";

const OrderConfirmationPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Inefficient loading of order details
	useEffect(() => {
		const loadOrderDetails = async () => {
			if (!id) return;

			setLoading(true);
			setError(null);

			try {
				const orderId = parseInt(id);

				// Artificial delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const orderData = await fetchOrderDetails(orderId);
				setOrder(orderData);
				setLoading(false);

				// Unnecessary confetti animation
				launchConfetti();
			} catch (error) {
				setError("Failed to load order details");
				setLoading(false);
				console.error("Error loading order:", error);
			}
		};

		loadOrderDetails();
	}, [id]);

	// Inefficient confetti animation
	const launchConfetti = () => {
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		const randomInRange = (min: number, max: number): number => {
			return Math.random() * (max - min) + min;
		};

		const interval: NodeJS.Timeout = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			// Use inefficient approach with multiple calls
			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
				})
			);

			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
				})
			);
		}, 250);
	};

	if (loading) {
		return (
			<div className='loading-screen'>
				<div className='spinner'></div>
				<p>Loading order details...</p>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className='error-container'>
				<h2>Error</h2>
				<p>{error || "Order not found"}</p>
				<Link to='/' className='back-button'>
					Return to Home
				</Link>
			</div>
		);
	}

	return (
		<div className='order-confirmation-page'>
			<motion.div
				className='confirmation-container'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className='confirmation-header'>
					<div className='confirmation-icon'>✓</div>
					<h1>Order Confirmed!</h1>
					<p>
						Thank you for your purchase. Your order has been received and is
						being processed.
					</p>
				</div>

				<div className='order-details'>
					<div className='order-info'>
						<div className='info-row'>
							<span>Order Number:</span>
							<span>#{order.id}</span>
						</div>

						<div className='info-row'>
							<span>Tracking Number:</span>
							<span>{order.tracking_number}</span>
						</div>

						<div className='info-row'>
							<span>Order Status:</span>
							<span>{order.status}</span>
						</div>

						<div className='info-row'>
							<span>Order Date:</span>
							<span>{new Date(order.created_at).toLocaleDateString()}</span>
						</div>

						<div className='info-row'>
							<span>Total Amount:</span>
							<span>${order.total_amount}</span>
						</div>
					</div>

					<div className='customer-info'>
						<h3>Customer Information</h3>
						<p>
							<strong>Name:</strong> {order.customer_name}
						</p>
						<p>
							<strong>Email:</strong> {order.customer_email}
						</p>
						<p>
							<strong>Shipping Address:</strong> {order.customer_address}
						</p>
					</div>

					{order.items && order.items.length > 0 && (
						<div className='order-items'>
							<h3>Order Items</h3>
							<table className='items-table'>
								<thead>
									<tr>
										<th>Product</th>
										<th>Quantity</th>
										<th>Price</th>
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									{order.items.map((item: OrderItem) => (
										<tr key={item.id}>
											<td>
												{item.product ? (
													<div className='item-product'>
														<img
															src={item.product.image_url}
															alt={item.product.name}
															className='item-image'
														/>
														<span>{item.product.name}</span>
													</div>
												) : (
													`Product #${item.product_id}`
												)}
											</td>
											<td>{item.quantity}</td>
											<td>${item.price}</td>
											<td>${(item.price * item.quantity).toFixed(2)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<div className='confirmation-actions'>
					<Link
						to={`/order-tracking/${order.tracking_number}`}
						className='track-order-btn'
					>
						Track Your Order
					</Link>
					<Link to='/products' className='continue-shopping-btn'>
						Continue Shopping
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default OrderConfirmationPage;
