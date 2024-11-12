import rateLimit from 'express-rate-limit';

// Define the rate limit options
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true, // Include rate limit headers in the response
});
