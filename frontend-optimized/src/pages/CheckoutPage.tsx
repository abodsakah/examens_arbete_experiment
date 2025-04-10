import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RootState, clearCart } from "../store";
import { createOrder } from "../services/api";

// Define a proper interface for form values
interface CheckoutFormValues {
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	cardName: string;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
}

const CheckoutPage: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const cartTotal = useSelector((state: RootState) => state.cart.total);

	// Optimized state management
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [cardType, setCardType] = useState<string>("");
	const [progress, setProgress] = useState<number>(0);
	const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

	// Redirect if cart is empty
	useEffect(() => {
		if (cartItems.length === 0 && !orderConfirmed) {
			navigate("/cart");
		}
	}, [cartItems, navigate]);

	// Optimized loading animation
	useEffect(() => {
		if (loading) {
			const interval = setInterval(() => {
				setProgress((prev) => {
					const increment = prev < 60 ? 15 : 5; // Move faster at first, then slower
					const newValue = Math.min(prev + increment, 95); // Cap at 95% until complete
					return newValue;
				});
			}, 500);

			return () => clearInterval(interval);
		} else {
			setProgress(0);
		}
	}, [loading]);

	// Efficient card type detection
	const detectCardType = (cardNumber: string) => {
		// Remove spaces and dashes
		const cleanNumber = cardNumber.replace(/[\s-]/g, "");

		if (/^4/.test(cleanNumber)) {
			setCardType("Visa");
		} else if (/^5[1-5]/.test(cleanNumber)) {
			setCardType("MasterCard");
		} else if (/^3[47]/.test(cleanNumber)) {
			setCardType("American Express");
		} else if (/^6(?:011|5)/.test(cleanNumber)) {
			setCardType("Discover");
		} else {
			setCardType("");
		}
	};

	// Form validation schema
	const validationSchema = Yup.object().shape({
		firstName: Yup.string().required("First name is required"),
		lastName: Yup.string().required("Last name is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		address: Yup.string().required("Address is required"),
		city: Yup.string().required("City is required"),
		state: Yup.string().required("State is required"),
		zipCode: Yup.string().required("ZIP code is required"),
		country: Yup.string().required("Country is required"),
		cardName: Yup.string().required("Name on card is required"),
		cardNumber: Yup.string()
			.required("Card number is required")
			.min(13, "Card number must be at least 13 digits")
			.max(19, "Card number must be at most 19 digits"),
		expiryDate: Yup.string()
			.required("Expiry date is required")
			.min(4, "Please enter a valid expiry date (MM/YY)"),
		cvv: Yup.string()
			.required("CVV is required")
			.min(3, "CVV must be at least 3 digits")
			.max(4, "CVV must be at most 4 digits")
	});

	// Initial form values
	const initialValues: CheckoutFormValues = {
		firstName: "",
		lastName: "",
		email: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
		cardName: "",
		cardNumber: "",
		expiryDate: "",
		cvv: ""
	};

	// Optimized form submission
	const handleSubmit = async (values: CheckoutFormValues) => {
		setLoading(true);
		setError(null);

		try {
			// Create order data
			const orderData = {
				customer_name: `${values.firstName} ${values.lastName}`,
				customer_email: values.email,
				customer_address: `${values.address}, ${values.city}, ${values.state} ${values.zipCode}, ${values.country}`,
				total_amount: cartTotal,
				items: cartItems.map((item) => ({
					product_id: item.product_id,
					quantity: item.quantity,
					price: item.price
				}))
			};

			// Submit order
			const response = await createOrder(orderData);

			setOrderConfirmed(true);

			// Set progress to 100% when complete
			setProgress(100);

			// Short delay to show 100% complete before navigating
			setTimeout(() => {
				// Clear cart
				dispatch(clearCart());
				// Navigate to confirmation page
				navigate(`/order-confirmation/${response.id}`);
			}, 500);
		} catch {
			setError("Failed to process your order. Please try again.");
			setLoading(false);
		}
	};

	// Calculate order summary values using useMemo to avoid unnecessary recalculations
	const orderSummary = useMemo(() => {
		const subtotal = cartTotal;
		const tax = subtotal * 0.1; // 10% tax
		const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
		const total = subtotal + tax + shipping;

		return { subtotal, tax, shipping, total };
	}, [cartTotal]);

	// Simpler credit card input handler
	const handleCardNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => {
		// First let Formik know about the change
		handleChange(e);

		// Then update card type
		detectCardType(e.target.value);
	};

	// Simple handlers for other fields - just let Formik handle it
	const handleExpiryDateChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => {
		handleChange(e);
	};

	return (
		<div className='checkout-page'>
			<h1>Checkout</h1>

			{loading ? (
				<div className='loading-screen'>
					<div className='loading-progress'>
						<div
							className='loading-bar'
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<p>Processing your order... Please don't close this page.</p>
				</div>
			) : (
				<div className='checkout-content'>
					{error && <div className='checkout-error'>{error}</div>}

					<div className='checkout-grid'>
						<div className='checkout-form-container'>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
							>
								{({ isSubmitting, handleChange, values }) => (
									<Form className='checkout-form'>
										<div className='form-section'>
											<h2>Shipping Information</h2>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='firstName'>First Name</label>
													<Field type='text' id='firstName' name='firstName' />
													<ErrorMessage
														name='firstName'
														component='div'
														className='error'
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='lastName'>Last Name</label>
													<Field type='text' id='lastName' name='lastName' />
													<ErrorMessage
														name='lastName'
														component='div'
														className='error'
													/>
												</div>
											</div>

											<div className='form-group'>
												<label htmlFor='email'>Email</label>
												<Field type='email' id='email' name='email' />
												<ErrorMessage
													name='email'
													component='div'
													className='error'
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='address'>Address</label>
												<Field type='text' id='address' name='address' />
												<ErrorMessage
													name='address'
													component='div'
													className='error'
												/>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='city'>City</label>
													<Field type='text' id='city' name='city' />
													<ErrorMessage
														name='city'
														component='div'
														className='error'
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='state'>State/Province</label>
													<Field type='text' id='state' name='state' />
													<ErrorMessage
														name='state'
														component='div'
														className='error'
													/>
												</div>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='zipCode'>ZIP/Postal Code</label>
													<Field type='text' id='zipCode' name='zipCode' />
													<ErrorMessage
														name='zipCode'
														component='div'
														className='error'
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='country'>Country</label>
													<Field as='select' id='country' name='country'>
														<option value=''>Select a country</option>
														<option value='United States'>United States</option>
														<option value='Canada'>Canada</option>
														<option value='United Kingdom'>
															United Kingdom
														</option>
														<option value='Australia'>Australia</option>
														<option value='Germany'>Germany</option>
														<option value='France'>France</option>
														<option value='Japan'>Japan</option>
														<option value='Other'>Other</option>
													</Field>
													<ErrorMessage
														name='country'
														component='div'
														className='error'
													/>
												</div>
											</div>
										</div>

										<div className='form-section'>
											<h2>Payment Information</h2>

											<div className='form-group'>
												<label htmlFor='cardName'>Name on Card</label>
												<Field type='text' id='cardName' name='cardName' />
												<ErrorMessage
													name='cardName'
													component='div'
													className='error'
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='cardNumber'>
													Card Number{" "}
													{cardType && (
														<span className='card-type'>({cardType})</span>
													)}
												</label>
												<Field
													type='text'
													id='cardNumber'
													name='cardNumber'
													placeholder='0000 0000 0000 0000'
													maxLength={19}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
														handleCardNumberChange(e, handleChange)
													}
												/>
												<ErrorMessage
													name='cardNumber'
													component='div'
													className='error'
												/>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='expiryDate'>
														Expiry Date (MM/YY)
													</label>
													<Field
														type='text'
														id='expiryDate'
														name='expiryDate'
														placeholder='MM/YY'
														maxLength={5}
														onChange={(
															e: React.ChangeEvent<HTMLInputElement>
														) => handleExpiryDateChange(e, handleChange)}
													/>
													<ErrorMessage
														name='expiryDate'
														component='div'
														className='error'
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='cvv'>CVV</label>
													<Field
														type='text'
														id='cvv'
														name='cvv'
														maxLength={4}
													/>
													<ErrorMessage
														name='cvv'
														component='div'
														className='error'
													/>
												</div>
											</div>
										</div>

										<button
											type='submit'
											className='place-order-btn'
											disabled={isSubmitting}
										>
											{isSubmitting ? "Processing..." : "Place Order"}
										</button>
									</Form>
								)}
							</Formik>
						</div>

						<div className='order-summary'>
							<h2>Order Summary</h2>

							<div className='summary-items'>
								{cartItems.map((item) => (
									<div key={item.product_id} className='summary-item'>
										<div className='item-quantity'>{item.quantity} ×</div>
										<div className='item-name'>Product #{item.product_id}</div>
										<div className='item-price'>
											${(item.price * item.quantity).toFixed(2)}
										</div>
									</div>
								))}
							</div>

							<div className='summary-totals'>
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

								<div className='summary-total'>
									<span>Total:</span>
									<span>${orderSummary.total.toFixed(2)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CheckoutPage;
