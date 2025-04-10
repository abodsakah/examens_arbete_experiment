import { pool } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Service for generating large product recommendations
 * This will test the frontend's ability to handle large data sets
 */
export const getProductRecommendations = async (
  productId: number,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<any[]> => {
  try {
    // Determine the size of response (for testing frontend performance)
    const limits = {
      small: 5,
      medium: 20,
      large: 50,
    };

    const limit = limits[size];

    // Get base product category
    const [productRows] = (await pool.query('SELECT category FROM products WHERE id = ?', [
      productId,
    ])) as [any[], any];

    if (productRows.length === 0) {
      return [];
    }

    const category = productRows[0].category;

    // Get similar products (same category, excluding the current product)
    const [rows] = (await pool.query(
      'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY rating DESC LIMIT ?',
      [category, productId, limit]
    )) as [any[], any];

    return rows;
  } catch (error) {
    logger.error(`Error in getProductRecommendations service for product ID ${productId}:`, error);
    return [];
  }
};

/**
 * Generate high resolution image URLs for products
 * This will test the frontend's ability to handle large images
 */
export const getHighResolutionImages = async (
  productId: number
): Promise<{ normal: string; high: string; ultra: string } | null> => {
  try {
    // Get product image
    const [rows] = (await pool.query('SELECT image_url FROM products WHERE id = ?', [
      productId,
    ])) as [any[], any];

    if (rows.length === 0) {
      return null;
    }

    // Calculate which product image to use (variety based on ID)
    const categoryNum = (productId % 10) + 1; // 1-10 for variety
    const baseImageUrl = `/images/products/product${categoryNum}.png`;
    
    // For the high-res and ultra-HD versions, we'll use the same files 
    // In a real app, these would be different resolution images from a CDN
    // We're simulating different resolutions using the same images
    return {
      normal: baseImageUrl,
      high: baseImageUrl, // In a real app, this would be a higher resolution version
      ultra: baseImageUrl  // In a real app, this would be an ultra HD version
    };
  } catch (error) {
    logger.error(`Error in getHighResolutionImages service for product ID ${productId}:`, error);
    return null;
  }
};

/**
 * Generate a detailed product report with lots of data
 * This will test the frontend's ability to render complex data structures
 */
export const getDetailedProductReport = async (productId: number): Promise<any | null> => {
  try {
    // Get base product data
    const [rows] = (await pool.query('SELECT * FROM products WHERE id = ?', [productId])) as [
      any[],
      any
    ];

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    // Generate mock sales history (30 day trend)
    const salesHistory = generateMockSalesHistory(30);

    // Generate mock reviews
    const reviews = generateMockReviews(product.rating, 15);

    // Generate mock specifications
    const specifications = generateMockSpecifications(product.category);

    // Generate mock related products
    const relatedProducts = await getRelatedProductIds(productId, 10);

    // Combine everything into a detailed report
    return {
      product,
      salesTrend: salesHistory,
      reviews,
      specifications,
      relatedProducts,
      materialDetails: generateMockMaterialDetails(product.category),
      shippingOptions: generateMockShippingOptions(),
      warrantyInformation: generateMockWarrantyInfo(),
      sustainabilityScore: Math.floor(Math.random() * 100),
      productionLocation: generateRandomLocation(),
      carbonFootprint: {
        manufacturing: Math.random() * 20,
        shipping: Math.random() * 10,
        usage: Math.random() * 5,
        disposal: Math.random() * 3,
        total: Math.random() * 38,
      },
    };
  } catch (error) {
    logger.error(`Error in getDetailedProductReport service for product ID ${productId}:`, error);
    return null;
  }
};

// Helper to generate mock sales history
const generateMockSalesHistory = (days: number): { date: string; quantity: number }[] => {
  const result = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    result.push({
      date: date.toISOString().split('T')[0],
      quantity: Math.floor(Math.random() * 10) + 1,
    });
  }

  return result;
};

// Helper to generate mock reviews
const generateMockReviews = (avgRating: number, count: number): any[] => {
  const reviews = [];
  const names = [
    'John D.',
    'Sarah M.',
    'Robert K.',
    'Emily L.',
    'Michael T.',
    'Jessica R.',
    'David S.',
    'Amanda B.',
    'Thomas W.',
    'Lisa G.',
  ];

  for (let i = 0; i < count; i++) {
    // Generate a rating that averages close to the product rating
    let rating = Math.max(1, Math.min(5, Math.round(avgRating + (Math.random() * 2 - 1))));

    reviews.push({
      id: i + 1,
      user: names[Math.floor(Math.random() * names.length)],
      rating,
      title: getRandomReviewTitle(rating),
      comment: getRandomReviewComment(rating),
      date: new Date(Date.now() - Math.floor(Math.random() * 9000000000))
        .toISOString()
        .split('T')[0],
      helpful_votes: Math.floor(Math.random() * 20),
      verified_purchase: Math.random() > 0.2,
    });
  }

  return reviews;
};

// Helper to get related product IDs
const getRelatedProductIds = async (productId: number, count: number): Promise<any[]> => {
  try {
    const [rows] = (await pool.query(
      'SELECT id, name, price, image_url FROM products WHERE id != ? ORDER BY RAND() LIMIT ?',
      [productId, count]
    )) as [any[], any];

    return rows;
  } catch (error) {
    logger.error(`Error getting related products for ID ${productId}:`, error);
    return [];
  }
};

// Helper to generate mock specifications based on category
const generateMockSpecifications = (category: string): Record<string, string> => {
  if (category === 'electronics') {
    return {
      Dimensions: '12 x 8 x 2 inches',
      Weight: '1.2 lbs',
      Material: 'Aluminum, Plastic',
      'Power Source': 'Battery, USB-C',
      'Battery Life': '10 hours',
      Connectivity: 'Bluetooth 5.0, WiFi 6',
      Warranty: '2 years limited',
      Manufacturer: 'TechCorp Inc.',
    };
  } else if (category === 'furniture') {
    return {
      Dimensions: '30 x 48 x 28 inches',
      Weight: '45 lbs',
      Material: 'Oak, Steel',
      'Assembly Required': 'Yes',
      'Max Weight Capacity': '250 lbs',
      'Care Instructions': 'Wipe clean with damp cloth',
      Warranty: '5 years limited',
      Manufacturer: 'Modern Furnish Co.',
    };
  } else {
    return {
      Dimensions: '9 x 6 x 3 inches',
      Weight: '0.8 lbs',
      Material: 'Mixed',
      Warranty: '1 year limited',
      Manufacturer: 'Accessories Plus Ltd.',
    };
  }
};

// Helper to generate mock material details
const generateMockMaterialDetails = (category: string): Record<string, string> => {
  if (category === 'electronics') {
    return {
      Casing: 'Recyclable aluminum',
      Display: 'Gorilla Glass',
      'Internal Components': 'RoHS compliant',
      Packaging: '90% recycled materials',
    };
  } else if (category === 'furniture') {
    return {
      Frame: 'Sustainably sourced oak',
      Finish: 'Low VOC lacquer',
      Hardware: 'Stainless steel',
      Upholstery: 'Recycled polyester blend',
    };
  } else {
    return {
      'Main Material': 'Mixed composition',
      Packaging: 'Recyclable cardboard',
      Finish: 'Water-based coating',
    };
  }
};

// Helper to generate mock shipping options
const generateMockShippingOptions = (): any[] => {
  return [
    {
      method: 'Standard Shipping',
      price: 4.99,
      estimated_days: '3-5 business days',
    },
    {
      method: 'Express Shipping',
      price: 9.99,
      estimated_days: '1-2 business days',
    },
    {
      method: 'Next Day Air',
      price: 19.99,
      estimated_days: 'Next business day',
    },
  ];
};

// Helper to generate mock warranty information
const generateMockWarrantyInfo = (): any => {
  return {
    basic_coverage: '1 year limited warranty',
    extended_options: [
      {
        name: '2-Year Protection Plan',
        price: 12.99,
        description: 'Covers mechanical and electrical failures',
      },
      {
        name: '3-Year Protection Plan',
        price: 19.99,
        description: 'Covers mechanical, electrical failures and accidental damage',
      },
    ],
    support_contact: 'warranty@example.com',
    terms_url: 'https://example.com/warranty-terms',
  };
};

// Helper to generate a random location
const generateRandomLocation = (): string => {
  const locations = [
    'Shanghai, China',
    'Detroit, USA',
    'Hamburg, Germany',
    'Taipei, Taiwan',
    'Gothenburg, Sweden',
    'Manchester, UK',
    'Bangalore, India',
    'Busan, South Korea',
  ];

  return locations[Math.floor(Math.random() * locations.length)];
};

// Helper to get random review titles
const getRandomReviewTitle = (rating: number): string => {
  if (rating >= 4) {
    const titles = [
      'Excellent product!',
      'Highly recommend',
      'Exactly what I needed',
      'Worth every penny',
      'Exceeded my expectations',
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  } else if (rating === 3) {
    const titles = [
      'Good but not great',
      'Decent product',
      'Met expectations',
      'Does the job',
      'Some pros and cons',
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  } else {
    const titles = [
      'Disappointed',
      'Not worth the money',
      'Would not recommend',
      'Had issues',
      "Doesn't work as expected",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }
};

// Helper to get random review comments
const getRandomReviewComment = (rating: number): string => {
  if (rating >= 4) {
    const comments = [
      'This product has been amazing. The quality is excellent and it works exactly as described. Would definitely purchase again!',
      "I've been using this for a few weeks now and I'm very happy with it. The design is perfect and it's very user-friendly.",
      'Extremely satisfied with this purchase. Fast shipping, great packaging, and the product itself is top-notch.',
      "This is the third one I've bought because I love them so much. Great quality and durability.",
      'Very impressed with the build quality and performance. It has made my daily tasks so much easier.',
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  } else if (rating === 3) {
    const comments = [
      "It's an okay product. Does what it says but nothing special. There are a few minor issues but overall it works.",
      "Good value for the price, but there's definitely room for improvement in the design.",
      'Works as expected, but the quality could be better. Not sure how long it will last.',
      'I like it, but I think there are better options out there. The functionality is good but the build quality is average.',
      "It serves its purpose but doesn't wow me. Instructions could have been clearer and setup was a bit tricky.",
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  } else {
    const comments = [
      'I regret this purchase. The quality is poor and it started having issues within days of arrival.',
      "Very disappointed with this product. It doesn't perform as advertised and customer service was unhelpful.",
      "Save your money and look elsewhere. This broke after minimal use and doesn't seem well-made at all.",
      "The design has serious flaws and it's not user-friendly. I've had nothing but problems with it.",
      "Not worth even half the price. Cheaply made and doesn't work properly. Avoid this product.",
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
};
