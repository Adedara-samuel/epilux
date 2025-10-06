import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorHandler.js';
import config from './config/environment.js';
import { validateConfig, getConfigStatus } from './config/validation.js';
import { requestLogger } from './middleware/errorHandler.js';
import supportRoutes from './routes/support.js';



const app = express();
// File URL to path conversion available via import.meta.url if needed

// Enable JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = config.PORT;
// const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    "http://192.168.1.100:3002",
];

// Middleware - Dynamic CORS handling
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        // For development, allow any localhost with any port
        if (process.env.NODE_ENV === 'development' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        
        // For development, allow any IP address with port 3000
        if (process.env.NODE_ENV === 'development' && /^https?:\/\/\d+\.\d+\.\d+\.\d+:3000$/.test(origin)) {
            return callback(null, true);
        }
        
        console.log('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
// Validate configuration
const configErrors = validateConfig();
if (configErrors.length > 0) {
    console.error('Configuration errors:');
    configErrors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
}

// MongoDB Connection (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Configuration status:', JSON.stringify(getConfigStatus(), null, 2));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
}

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import affiliateRoutes from './routes/affiliate.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/users', userRoutes);


// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Epilux API Server is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler for undefined routes

// Global error handling middleware
app.use(globalErrorHandler);

// Start server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
    // Start the server
    app.listen(PORT, async () => {
        const localIP = await getLocalIP();
        console.log(`\n🚀 Server is running in ${config.NODE_ENV} mode on port ${PORT}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`🌐 Access the server via:`);
        console.log(`   - Local: http://localhost:${PORT}`);
        console.log(`   - Network: http://${localIP}:${PORT}`);
        console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
        console.log(`📚 API documentation available at: http://localhost:${PORT}/api/docs`);
    });
}

// Helper function to get local IP address
async function getLocalIP() {
    const { networkInterfaces } = await import('os');
    const interfaces = networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            const { address, family, internal } = iface;
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
    return 'localhost';
}

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;