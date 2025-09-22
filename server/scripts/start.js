#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const config = require('../config/environment');
const { validateConfig, getConfigStatus } = require('../config/validation');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m'
};

// Helper function to log colored messages
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to check if MongoDB is running
function checkMongoDB() {
    return new Promise((resolve) => {
        const mongoose = require('mongoose');
        
        mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000,
            socketTimeoutMS: 2000,
        })
        .then(() => {
            mongoose.connection.close();
            resolve(true);
        })
        .catch(() => {
            resolve(false);
        });
    });
}

// Helper function to check if port is available
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        
        server.listen(port, () => {
            server.once('close', () => resolve(true));
            server.close();
        });
        
        server.on('error', () => resolve(false));
    });
}

// Helper function to create directories if they don't exist
function createDirectories() {
    const dirs = ['logs', 'uploads'];
    
    dirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            log(`Created directory: ${dir}`, 'green');
        }
    });
}

// Helper function to check dependencies
function checkDependencies() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ package.json not found', 'red');
        return false;
    }
    
    if (!fs.existsSync(nodeModulesPath)) {
        log('❌ node_modules not found. Please run: npm install', 'red');
        return false;
    }
    
    return true;
}

// Helper function to display startup banner
function displayBanner() {
    log('╔═══════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                                                               ║', 'cyan');
    log('║                    🚀 EPIX API SERVER                        ║', 'cyan');
    log('║                                                               ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════╝', 'cyan');
    log('', 'cyan');
}

// Helper function to display system info
function displaySystemInfo() {
    const os = require('os');
    const nodeVersion = process.version;
    const platform = os.platform();
    const arch = os.arch();
    const cpus = os.cpus().length;
    const totalMemory = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    
    log('📊 System Information:', 'blue');
    log(`   Node.js Version: ${nodeVersion}`, 'blue');
    log(`   Platform: ${platform} (${arch})`, 'blue');
    log(`   CPU Cores: ${cpus}`, 'blue');
    log(`   Total Memory: ${totalMemory} GB`, 'blue');
    log('', 'blue');
}

// Helper function to display configuration status
function displayConfigStatus() {
    const status = getConfigStatus();
    
    log('⚙️  Configuration Status:', 'magenta');
    log(`   Environment: ${status.environment}`, 'magenta');
    log(`   Port: ${status.port}`, 'magenta');
    log(`   Database: ${status.database.connected ? 'Connected' : 'Not Connected'}`, 'magenta');
    log(`   JWT Secret: ${status.jwt.secret}`, 'magenta');
    log(`   CORS Origin: ${status.cors.origin}`, 'magenta');
    log(`   Email Service: ${status.features.email ? 'Enabled' : 'Disabled'}`, 'magenta');
    log(`   Payment Service: ${status.features.payments ? 'Enabled' : 'Disabled'}`, 'magenta');
    log(`   Redis Cache: ${status.features.redis ? 'Enabled' : 'Disabled'}`, 'magenta');
    log('', 'magenta');
}

// Main startup function
async function startup() {
    displayBanner();
    displaySystemInfo();
    
    log('🔍 Performing pre-startup checks...', 'yellow');
    log('', 'yellow');
    
    // Check 1: Dependencies
    log('1. Checking dependencies...', 'yellow');
    if (!checkDependencies()) {
        log('❌ Dependency check failed', 'red');
        process.exit(1);
    }
    log('✅ Dependencies are installed', 'green');
    log('', 'green');
    
    // Check 2: Configuration
    log('2. Validating configuration...', 'yellow');
    const configErrors = validateConfig();
    if (configErrors.length > 0) {
        log('❌ Configuration validation failed:', 'red');
        configErrors.forEach(error => log(`   - ${error}`, 'red'));
        process.exit(1);
    }
    log('✅ Configuration is valid', 'green');
    displayConfigStatus();
    
    // Check 3: Port availability
    log('3. Checking port availability...', 'yellow');
    const portAvailable = await checkPort(config.PORT);
    if (!portAvailable) {
        log(`❌ Port ${config.PORT} is already in use`, 'red');
        process.exit(1);
    }
    log(`✅ Port ${config.PORT} is available`, 'green');
    log('', 'green');
    
    // Check 4: MongoDB connection
    log('4. Checking MongoDB connection...', 'yellow');
    const mongoDBAvailable = await checkMongoDB();
    if (!mongoDBAvailable) {
        log('❌ MongoDB is not running or not accessible', 'red');
        log('   Please make sure MongoDB is installed and running', 'red');
        log('   Check your MONGODB_URI in the configuration', 'red');
        process.exit(1);
    }
    log('✅ MongoDB is running and accessible', 'green');
    log('', 'green');
    
    // Check 5: Create directories
    log('5. Creating necessary directories...', 'yellow');
    createDirectories();
    log('✅ Directories are ready', 'green');
    log('', 'green');
    
    // All checks passed
    log('🎉 All pre-startup checks passed!', 'green');
    log('', 'green');
    
    // Start the server
    log('🚀 Starting Epilux API Server...', 'cyan');
    log('', 'cyan');
    
    const serverProcess = spawn('node', ['index.js'], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    });
    
    serverProcess.on('error', (error) => {
        log(`❌ Failed to start server: ${error.message}`, 'red');
        process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        log('🛑 Received SIGTERM, shutting down gracefully...', 'yellow');
        serverProcess.kill('SIGTERM');
    });
    
    process.on('SIGINT', () => {
        log('🛑 Received SIGINT, shutting down gracefully...', 'yellow');
        serverProcess.kill('SIGINT');
    });
}

// Check if script is run directly
if (require.main === module) {
    startup().catch((error) => {
        log(`❌ Startup failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { startup, checkMongoDB, checkPort, checkDependencies };
