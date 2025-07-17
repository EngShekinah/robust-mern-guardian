
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from './CodeBlock';
import { 
  Server, 
  Globe, 
  Settings, 
  Monitor, 
  GitBranch,
  Shield,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const DeploymentSection = () => {
  const [activeTab, setActiveTab] = useState('preparation');

  const deploymentSteps = [
    { id: 'preparation', label: 'App Preparation', icon: Settings, status: 'completed' },
    { id: 'backend', label: 'Backend Deploy', icon: Server, status: 'in-progress' },
    { id: 'frontend', label: 'Frontend Deploy', icon: Globe, status: 'pending' },
    { id: 'cicd', label: 'CI/CD Pipeline', icon: GitBranch, status: 'pending' },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor, status: 'pending' }
  ];

  const productionOptimizations = `// vite.config.ts - Production optimization
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});`;

  const backendConfig = `// server/index.js - Production Express setup
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// Performance middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

  const githubActions = `# .github/workflows/deploy.yml - CI/CD Pipeline
name: Deploy MERN Bug Tracker

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Render
      uses: render-deploy/github-action@v1
      with:
        service-id: \${{ secrets.RENDER_SERVICE_ID }}
        api-key: \${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`;

  const monitoringSetup = `// utils/monitoring.js - Application monitoring
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'bug-tracker' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Error tracking middleware
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(500).json({
    error: 'Internal Server Error',
    requestId: req.id
  });
};

// Performance monitoring
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip
    });
  });
  
  next();
};

module.exports = { logger, errorHandler, performanceMiddleware };`;

  const envConfig = `# Environment Configuration Examples

# Development (.env.development)
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bugtracker_dev
JWT_SECRET=dev_secret_key
FRONTEND_URL=http://localhost:3000
PORT=5000

# Production (.env.production)
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bugtracker
JWT_SECRET=secure_production_secret
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
REDIS_URL=redis://localhost:6379

# Docker Configuration
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/bugtracker
    depends_on:
      - mongo
      
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
      
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
      
volumes:
  mongo_data:`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            Deployment & DevOps Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {deploymentSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={step.id} 
                  className={`cursor-pointer transition-all ${
                    activeTab === step.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setActiveTab(step.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-purple-600" />
                        {getStatusIcon(step.status)}
                      </div>
                      <span className="text-sm font-medium text-center">{step.label}</span>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="preparation">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Application Preparation for Production
                </h3>
                
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Frontend Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={productionOptimizations} language="typescript" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Environment Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={envConfig} language="bash" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backend">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend Deployment Configuration
                </h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Production Express Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={backendConfig} language="javascript" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-semibold">Security</p>
                          <p className="text-sm text-gray-600">Helmet, CORS, Rate limiting</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Zap className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-semibold">Performance</p>
                          <p className="text-sm text-gray-600">Compression, Caching</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="font-semibold">Monitoring</p>
                          <p className="text-sm text-gray-600">Health checks, Logging</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frontend">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Frontend Deployment Strategy
                </h3>
                
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Static Hosting Platforms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold text-green-600">Vercel</h4>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Automatic deployments</li>
                            <li>• Edge functions</li>
                            <li>• Custom domains</li>
                            <li>• Performance analytics</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold text-blue-600">Netlify</h4>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Form handling</li>
                            <li>• Serverless functions</li>
                            <li>• Branch previews</li>
                            <li>• A/B testing</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold text-purple-600">GitHub Pages</h4>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Free hosting</li>
                            <li>• GitHub integration</li>
                            <li>• Custom workflows</li>
                            <li>• Simple setup</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cicd">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  CI/CD Pipeline Setup
                </h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">GitHub Actions Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={githubActions} language="yaml" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Continuous Integration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Automated testing on every push
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Code quality checks and linting
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Build verification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Security vulnerability scanning
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Continuous Deployment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Automatic deployment on main branch
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Staging environment for testing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Rollback capabilities
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Environment-specific configurations
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitoring">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Monitoring & Maintenance
                </h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Application Monitoring Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={monitoringSetup} language="javascript" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Monitoring Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Database className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Database Monitoring</p>
                            <p className="text-sm text-gray-600">MongoDB Atlas monitoring</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Server className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">Server Monitoring</p>
                            <p className="text-sm text-gray-600">CPU, Memory, Disk usage</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Globe className="h-6 w-6 text-purple-600" />
                          <div>
                            <p className="font-semibold">Frontend Monitoring</p>
                            <p className="text-sm text-gray-600">User experience metrics</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Maintenance Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Weekly dependency updates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Daily backup verification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Monthly security audits
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Performance optimization reviews
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Log analysis and cleanup
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          SSL certificate renewal
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
