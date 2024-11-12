// Define allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log(`Request Origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('Origin allowed by CORS');
      callback(null, true);  // Allow request
    } else {
      console.log('Origin not allowed by CORS');
      callback(new Error('Not allowed by CORS'));  // Block request
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};