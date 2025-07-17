
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, Play, AlertTriangle, Terminal, Search, Shield } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const DebuggingExamples = () => {
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const buggyComponent = `import React, { useState, useEffect } from 'react';

// Buggy Component with intentional issues
const BuggyBugForm = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Bug 1: Missing dependency array causes infinite re-renders
    fetchBugs();
  });

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bugs');
      const data = await response.json();
      // Bug 2: Not checking if response is ok
      setBugs(data.bugs);
    } catch (error) {
      // Bug 3: Swallowing errors silently
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSubmit = (formData) => {
    // Bug 4: No validation
    // Bug 5: Assuming formData always has required fields
    const newBug = {
      id: Math.random(), // Bug 6: Non-unique ID generation
      title: formData.title.trim(),
      description: formData.description.trim(),
      severity: formData.severity || 'medium',
      // Bug 7: Missing required fields
    };

    // Bug 8: Mutating state directly
    bugs.push(newBug);
    setBugs(bugs);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {/* Bug 9: Not handling empty state */}
      {bugs.map(bug => (
        <div key={bug.id}>
          <h3>{bug.title}</h3>
          {/* Bug 10: Not handling undefined values */}
          <p>Severity: {bug.severity.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
};`;

  const fixedComponent = `import React, { useState, useEffect, useCallback } from 'react';

// Fixed Component with proper error handling and debugging
const FixedBugForm = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fix: Proper error boundary and logging
  const logDebug = useCallback((message, data = null) => {
    console.log(\`[BugForm] \${message}\`, data);
    if (process.env.NODE_ENV === 'development') {
      // Additional debugging in development
      console.trace();
    }
  }, []);

  // Fix: Memoized fetch function with proper error handling
  const fetchBugs = useCallback(async () => {
    logDebug('Fetching bugs...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bugs');
      
      // Fix: Check response status
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const data = await response.json();
      
      // Fix: Validate response structure
      if (!data || !Array.isArray(data.bugs)) {
        throw new Error('Invalid response format');
      }
      
      logDebug('Bugs fetched successfully', data.bugs);
      setBugs(data.bugs);
    } catch (error) {
      // Fix: Proper error handling and user feedback
      logDebug('Error fetching bugs', error);
      setError(\`Failed to load bugs: \${error.message}\`);
      setBugs([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }, [logDebug]);

  // Fix: Proper dependency array
  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const validateBugData = (formData) => {
    const errors = [];
    
    if (!formData || typeof formData !== 'object') {
      errors.push('Invalid form data');
      return errors;
    }
    
    if (!formData.title || formData.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters');
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!formData.reporter || formData.reporter.trim().length < 1) {
      errors.push('Reporter is required');
    }
    
    return errors;
  };

  const handleSubmit = (formData) => {
    logDebug('Submitting new bug', formData);
    
    // Fix: Proper validation
    const validationErrors = validateBugData(formData);
    if (validationErrors.length > 0) {
      logDebug('Validation errors', validationErrors);
      setError(\`Validation failed: \${validationErrors.join(', ')}\`);
      return;
    }

    try {
      // Fix: Proper ID generation (in real app, this would come from server)
      const newBug = {
        id: \`bug_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        severity: formData.severity || 'medium',
        status: formData.status || 'open',
        reporter: formData.reporter.trim(),
        assignee: formData.assignee?.trim() || null,
        tags: formData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Fix: Immutable state update
      setBugs(prevBugs => [newBug, ...prevBugs]);
      logDebug('Bug added successfully', newBug);
      
    } catch (error) {
      logDebug('Error adding bug', error);
      setError(\`Failed to add bug: \${error.message}\`);
    }
  };

  // Error boundary fallback
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchBugs();
          }}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading bugs...</span>
        </div>
      )}
      
      {/* Fix: Handle empty state */}
      {!loading && bugs.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          <p>No bugs found. Create your first bug report!</p>
        </div>
      )}
      
      {bugs.map(bug => (
        <div key={bug.id} className="border rounded p-4 mb-2">
          <h3 className="font-medium">{bug.title}</h3>
          {/* Fix: Safe property access */}
          <p>Severity: {bug.severity?.toUpperCase() || 'UNKNOWN'}</p>
          <p>Status: {bug.status?.toUpperCase() || 'UNKNOWN'}</p>
          <p>Reporter: {bug.reporter || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  );
};`;

  const debuggingTechniques = `// 1. Console Logging Strategies
const debugLog = (component, action, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(\`[\${component}] \${action}\`);
    console.log('Data:', data);
    console.log('Timestamp:', new Date().toISOString());
    console.trace('Call stack');
    console.groupEnd();
  }
};

// 2. Performance Monitoring
const performanceMonitor = (name) => {
  return {
    start: () => performance.mark(\`\${name}-start\`),
    end: () => {
      performance.mark(\`\${name}-end\`);
      performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
      const measure = performance.getEntriesByName(name)[0];
      console.log(\`\${name} took \${measure.duration.toFixed(2)}ms\`);
    }
  };
};

// Usage in component
const BugComponent = () => {
  const [bugs, setBugs] = useState([]);
  
  const fetchBugs = async () => {
    const monitor = performanceMonitor('fetchBugs');
    monitor.start();
    
    try {
      const response = await fetch('/api/bugs');
      const data = await response.json();
      
      debugLog('BugComponent', 'fetchBugs success', {
        count: data.bugs.length,
        response: data
      });
      
      setBugs(data.bugs);
    } catch (error) {
      debugLog('BugComponent', 'fetchBugs error', error);
    } finally {
      monitor.end();
    }
  };
  
  // 3. State Change Monitoring
  useEffect(() => {
    debugLog('BugComponent', 'bugs state changed', {
      previous: bugs.length,
      current: bugs.length,
      bugs: bugs
    });
  }, [bugs]);
  
  return <div>...</div>;
};

// 4. Custom Hook for Debugging
const useDebugValue = (value, label) => {
  useEffect(() => {
    console.log(\`[DEBUG] \${label}:\`, value);
  }, [value, label]);
  
  return value;
};

// 5. Error Boundary with Debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details (Development Only)</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>{this.state.errorInfo.componentStack}</p>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}`;

  const networkDebugging = `// Network Request Debugging
const debugFetch = async (url, options = {}) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  
  console.group(\`🌐 HTTP Request [\${requestId}]\`);
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Headers:', options.headers);
  console.log('Body:', options.body);
  
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    
    console.log(\`✅ Response [\${requestId}] (\${(endTime - startTime).toFixed(2)}ms)\`);
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Data:', data);
    console.groupEnd();
    
    return { response, data };
  } catch (error) {
    const endTime = performance.now();
    console.log(\`❌ Error [\${requestId}] (\${(endTime - startTime).toFixed(2)}ms)\`);
    console.error('Error:', error);
    console.groupEnd();
    throw error;
  }
};

// Browser DevTools Integration
const addToDevTools = () => {
  if (typeof window !== 'undefined' && window.chrome) {
    // Add custom functions to window for debugging
    window.debugBugTracker = {
      getAllBugs: () => {
        const bugs = JSON.parse(localStorage.getItem('bugs') || '[]');
        console.table(bugs);
        return bugs;
      },
      
      clearAllBugs: () => {
        localStorage.removeItem('bugs');
        console.log('All bugs cleared from localStorage');
      },
      
      addTestBug: () => {
        const testBug = {
          id: 'test-' + Date.now(),
          title: 'Test Bug from DevTools',
          description: 'This bug was created using browser dev tools',
          severity: 'low',
          status: 'open',
          reporter: 'DevTools',
          createdAt: new Date().toISOString()
        };
        
        const bugs = JSON.parse(localStorage.getItem('bugs') || '[]');
        bugs.push(testBug);
        localStorage.setItem('bugs', JSON.stringify(bugs));
        console.log('Test bug added:', testBug);
        
        // Trigger re-render if React DevTools is available
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          window.location.reload();
        }
      },
      
      logComponentTree: () => {
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          console.log('Use React DevTools to inspect component tree');
        } else {
          console.log('React DevTools not installed');
        }
      }
    };
    
    console.log('🔧 Debug utilities added to window.debugBugTracker');
    console.log('Available methods:', Object.keys(window.debugBugTracker));
  }
};

// Initialize debugging tools
if (process.env.NODE_ENV === 'development') {
  addToDevTools();
}`;

  const simulateBug = () => {
    const bugs = [
      "🐛 Infinite re-render detected in useEffect",
      "🚨 Network request failed with 500 error",
      "⚠️ State mutation detected",
      "💥 Cannot read property 'map' of undefined",
      "🔥 Memory leak in component cleanup"
    ];
    
    const randomBug = bugs[Math.floor(Math.random() * bugs.length)];
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${randomBug}`]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debugging Techniques for MERN Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Comprehensive debugging strategies and tools for identifying and resolving issues 
            in MERN stack applications.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={simulateBug}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Simulate Debug Event
            </Button>
          </div>
          
          {debugLog.length > 0 && (
            <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-4 w-4" />
                <span>Debug Console</span>
              </div>
              {debugLog.slice(-5).map((log, index) => (
                <div key={index} className="text-xs mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="buggy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buggy">Buggy Code</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Code</TabsTrigger>
          <TabsTrigger value="techniques">Debug Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="buggy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Common React Bugs
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="destructive">Buggy Code</Badge>
                <Badge variant="outline">Learning Example</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This example contains 10 common React bugs that you might encounter in real applications.
              </p>
              <CodeBlock code={buggyComponent} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Fixed Implementation
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Best Practices</Badge>
                <Badge variant="outline">Error Handling</Badge>
                <Badge variant="outline">Debugging</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                The same component with proper error handling, debugging techniques, and best practices applied.
              </p>
              <CodeBlock code={fixedComponent} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="techniques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Advanced Debugging Techniques
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Console Logging</Badge>
                <Badge variant="outline">Performance</Badge>
                <Badge variant="outline">DevTools</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={debuggingTechniques} language="javascript" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network and Browser Debugging</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Network Requests</Badge>
                <Badge variant="outline">Browser DevTools</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={networkDebugging} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
