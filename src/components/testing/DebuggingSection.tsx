
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bug, Search, AlertTriangle, CheckCircle, Terminal, Code, Globe } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const DebuggingSection = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const errorBoundaryCode = `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service
    this.logErrorToService(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  logErrorToService = (error, errorInfo) => {
    // Example: Send to Sentry, LogRocket, etc.
    console.error('Logging to error service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`;

  const debugUtilsCode = `// Debug utilities for MERN applications
export const debugUtils = {
  // Enhanced logging with context
  log: (message, data = null, level = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      stack: new Error().stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    };

    console.log(\`[\${level.toUpperCase()}] \${timestamp}: \${message}\`, logEntry);
    
    // Send to logging service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToLoggingService(logEntry);
    }
  },

  // Performance monitoring
  performanceTimer: (label) => {
    const start = performance.now();
    
    return {
      end: () => {
        const end = performance.now();
        const duration = end - start;
        console.log(\`⏱️ \${label}: \${duration.toFixed(2)}ms\`);
        return duration;
      }
    };
  },

  // Network request debugging
  debugRequest: async (url, options = {}) => {
    const timer = debugUtils.performanceTimer(\`Request to \${url}\`);
    
    try {
      console.log('🌐 Making request:', { url, options });
      const response = await fetch(url, options);
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      timer.end();
      return response;
    } catch (error) {
      timer.end();
      console.error('❌ Request failed:', error);
      throw error;
    }
  },

  // React component debugging
  debugRender: (componentName, props, state = null) => {
    console.group(\`🔄 \${componentName} Render\`);
    console.log('Props:', props);
    if (state) console.log('State:', state);
    console.trace('Render trace');
    console.groupEnd();
  },

  // Memory usage monitoring
  checkMemory: () => {
    if (typeof window !== 'undefined' && window.performance.memory) {
      const memory = window.performance.memory;
      console.log('💾 Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }
};

// React Hook for debugging
export const useDebug = (componentName) => {
  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current++;
    console.log(\`🔄 \${componentName} rendered \${renderCount.current} times\`);
  });

  return {
    log: (message, data) => debugUtils.log(\`[\${componentName}] \${message}\`, data),
    renderCount: renderCount.current
  };
};`;

  const serverDebuggingCode = `// Server-side debugging middleware and utilities
const express = require('express');
const morgan = require('morgan');

// Enhanced request logging middleware
const debugMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log('📨 Incoming Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    console.log('📤 Response:', {
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      dataSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    });
    
    return originalJson.call(this, data);
  };

  next();
};

// Database query debugging
const debugQuery = (model, operation) => {
  return async (...args) => {
    const timer = debugUtils.performanceTimer(\`\${model.modelName} \${operation}\`);
    
    try {
      console.log(\`🗄️ Database Query: \${model.modelName}.\${operation}\`, args);
      const result = await model[operation](...args);
      
      console.log(\`✅ Query Success: \${model.modelName}.\${operation}\`, {
        resultCount: Array.isArray(result) ? result.length : result ? 1 : 0
      });
      
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      console.error(\`❌ Query Failed: \${model.modelName}.\${operation}\`, error);
      throw error;
    }
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('🚨 Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Different handling for different environments
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      request: {
        url: req.url,
        method: req.method
      }
    });
  } else {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  debugMiddleware,
  debugQuery,
  errorHandler
};`;

  const commonIssuesCode = `// Common MERN debugging scenarios and solutions

// 1. CORS Issues
const corsDebug = {
  issue: "Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy",
  
  solution: \`
    // Server (Express.js)
    const cors = require('cors');
    
    app.use(cors({
      origin: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://yourapp.com',
      credentials: true
    }));
  \`,
  
  debugging: \`
    // Check preflight requests
    console.log('CORS Debug:', {
      origin: req.headers.origin,
      method: req.method,
      headers: req.headers['access-control-request-headers']
    });
  \`
};

// 2. MongoDB Connection Issues
const mongoDebug = {
  issue: "MongooseServerSelectionError: connect ECONNREFUSED",
  
  solution: \`
    const mongoose = require('mongoose');
    
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
  \`,
  
  debugging: \`
    // Check connection status
    console.log('MongoDB State:', mongoose.connection.readyState);
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  \`
};

// 3. React State Updates
const stateDebug = {
  issue: "Component not re-rendering after state update",
  
  solution: \`
    // ❌ Mutating state directly
    const [users, setUsers] = useState([]);
    users.push(newUser); // Wrong!
    
    // ✅ Creating new state
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // ❌ Mutating nested objects
    user.name = 'New Name'; // Wrong!
    setUser(user);
    
    // ✅ Creating new object
    setUser(prevUser => ({ ...prevUser, name: 'New Name' }));
  \`,
  
  debugging: \`
    // Use React DevTools and add logging
    useEffect(() => {
      console.log('Component re-rendered with state:', state);
    });
    
    // Check if state is actually changing
    const prevState = useRef();
    useEffect(() => {
      console.log('State changed:', {
        previous: prevState.current,
        current: state,
        changed: prevState.current !== state
      });
      prevState.current = state;
    }, [state]);
  \`
};

// 4. JWT Authentication Issues
const authDebug = {
  issue: "JWT token verification failing",
  
  solution: \`
    // Client-side token handling
    const token = localStorage.getItem('authToken');
    
    const authHeaders = {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    };
    
    // Server-side verification
    const jwt = require('jsonwebtoken');
    
    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Token verification failed:', err);
          return res.status(403).json({ message: 'Invalid token' });
        }
        
        req.user = decoded;
        next();
      });
    };
  \`,
  
  debugging: \`
    // Debug token issues
    console.log('Token Debug:', {
      token: token ? 'Present' : 'Missing',
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...',
      headers: req.headers.authorization
    });
  \`
};`;

  const debuggingTools = [
    {
      name: 'Chrome DevTools',
      icon: Globe,
      description: 'Browser debugging and performance analysis',
      features: ['Sources panel', 'Network tab', 'Performance profiler', 'Console']
    },
    {
      name: 'VSCode Debugger',
      icon: Code,
      description: 'Integrated debugging for Node.js and React',
      features: ['Breakpoints', 'Variable inspection', 'Call stack', 'Watch expressions']
    },
    {
      name: 'React DevTools',
      icon: Bug,
      description: 'React component inspection and profiling',
      features: ['Component tree', 'Props/state inspection', 'Performance profiler', 'Hook debugging']
    },
    {
      name: 'MongoDB Compass',
      icon: Terminal,
      description: 'Database debugging and query optimization',
      features: ['Query performance', 'Index analysis', 'Document inspection', 'Aggregation pipeline']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debugging Techniques & Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Effective debugging is crucial for maintaining robust MERN applications. 
            Here are essential tools and techniques for identifying and resolving issues.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debuggingTools.map((tool) => (
              <div key={tool.name} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <tool.icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{tool.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="error-handling" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="error-handling">Error Handling</TabsTrigger>
          <TabsTrigger value="debug-utils">Debug Utils</TabsTrigger>
          <TabsTrigger value="server-debug">Server Debug</TabsTrigger>
          <TabsTrigger value="common-issues">Common Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="error-handling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>React Error Boundaries</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Error Handling</Badge>
                <Badge variant="outline">Component Protection</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error boundaries catch JavaScript errors in React component trees and display fallback UI.
                </AlertDescription>
              </Alert>
              <CodeBlock code={errorBoundaryCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug-utils" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debug Utilities & Hooks</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Logging</Badge>
                <Badge variant="outline">Performance</Badge>
                <Badge variant="outline">Memory Monitoring</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={debugUtilsCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server-debug" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server-Side Debugging</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Middleware</Badge>
                <Badge variant="outline">Database Queries</Badge>
                <Badge variant="outline">Error Handling</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={serverDebuggingCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="common-issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Common MERN Issues & Solutions</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">CORS</Badge>
                <Badge variant="outline">MongoDB</Badge>
                <Badge variant="outline">Authentication</Badge>
                <Badge variant="outline">State Management</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={commonIssuesCode} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
