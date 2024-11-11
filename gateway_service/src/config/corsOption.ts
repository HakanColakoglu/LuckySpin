// Define allowed origins
const allowedOrigins = ['https://example.com'];

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Check if the origin is in the allowed origins array
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow request
    } else {
      callback(new Error('Not allowed by CORS'));  // Block request
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};