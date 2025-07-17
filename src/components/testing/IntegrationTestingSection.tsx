
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, XCircle, Database, AlertTriangle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const IntegrationTestingSection = () => {
  const [testResults, setTestResults] = useState({
    userApi: { status: 'passed', endpoint: '/api/users', method: 'GET' },
    authApi: { status: 'passed', endpoint: '/api/auth/login', method: 'POST' },
    dataFlow: { status: 'failed', endpoint: '/api/users/create', method: 'POST' },
    middleware: { status: 'passed', endpoint: '/api/protected', method: 'GET' }
  });

  const apiTest = `const request = require('supertest');
const app = require('../src/app');
const { connectDB, closeDB } = require('../src/config/database');

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    test('should return users with correct structure', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      const user = response.body.users[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).not.toHaveProperty('password');
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUser.email);
    });

    test('should validate required fields', async () => {
      const invalidUser = {
        name: 'Test User'
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});`;

  const authTest = `describe('Authentication Integration Tests', () => {
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Protected Routes', () => {
    let authToken;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      authToken = loginResponse.body.token;
    });

    test('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
    });

    test('should reject access without token', async () => {
      await request(app)
        .get('/api/profile')
        .expect(401);
    });
  });
});`;

  const databaseTest = `const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Database Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Model', () => {
    test('should create user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
    });

    test('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20);
    });

    test('should validate unique email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await new User(userData).save();

      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });
});`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Integration Testing with Supertest & MongoDB Memory Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Integration tests verify that different parts of your application work together correctly,
            including API endpoints, database interactions, and middleware.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{testName.replace(/([A-Z])/g, ' $1')}</span>
                  {result.status === 'passed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{result.endpoint}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <Badge variant="outline" className="text-xs">{result.method}</Badge>
                  </div>
                </div>
                {result.status === 'failed' && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Timeout error - needs investigation</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api">API Testing</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints Testing</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Supertest</Badge>
                <Badge variant="outline">HTTP Assertions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={apiTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Flow Testing</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">JWT Tokens</Badge>
                <Badge variant="outline">Protected Routes</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={authTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Integration Testing</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">MongoDB Memory Server</Badge>
                <Badge variant="outline">Model Validation</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={databaseTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
