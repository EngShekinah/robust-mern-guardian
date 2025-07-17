
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, Globe, Clock, User, ShoppingCart } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const E2ETestingSection = () => {
  const [testResults, setTestResults] = useState({
    userRegistration: { status: 'passed', duration: '2.3s', steps: 5 },
    userLogin: { status: 'passed', duration: '1.8s', steps: 4 },
    profileUpdate: { status: 'passed', duration: '3.1s', steps: 6 },
    dataFlow: { status: 'passed', duration: '4.2s', steps: 8 }
  });

  const userFlowTest = `describe('User Registration and Login Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full user registration flow', () => {
    // Navigate to registration page
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/register');

    // Fill out registration form
    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john.doe@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123!');

    // Submit registration
    cy.get('[data-testid="register-button"]').click();

    // Verify success message
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Registration successful');

    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]')
      .should('contain', 'Welcome, John Doe');
  });

  it('should handle registration validation errors', () => {
    cy.get('[data-testid="register-link"]').click();

    // Try to submit empty form
    cy.get('[data-testid="register-button"]').click();

    // Verify validation messages
    cy.get('[data-testid="name-error"]').should('contain', 'Name is required');
    cy.get('[data-testid="email-error"]').should('contain', 'Email is required');
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required');

    // Test password mismatch
    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('different');
    cy.get('[data-testid="register-button"]').click();

    cy.get('[data-testid="password-match-error"]')
      .should('contain', 'Passwords do not match');
  });
});`;

  const loginFlowTest = `describe('User Login Flow', () => {
  beforeEach(() => {
    // Create a test user first
    cy.request('POST', '/api/test-users', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
    
    // Check if user data is loaded
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });

  it('should handle invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    // Verify error message
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');

    // Verify user stays on login page
    cy.url().should('include', '/login');
  });

  it('should maintain login state after page refresh', () => {
    // Login first
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Verify login success
    cy.url().should('include', '/dashboard');

    // Refresh page
    cy.reload();

    // Verify user is still logged in
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });
});`;

  const dataFlowTest = `describe('Complete Data Flow', () => {
  beforeEach(() => {
    // Login as test user
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('should complete full CRUD operations', () => {
    // Create new item
    cy.get('[data-testid="add-item-button"]').click();
    cy.get('[data-testid="item-title-input"]').type('Test Item');
    cy.get('[data-testid="item-description-input"]').type('This is a test item');
    cy.get('[data-testid="save-item-button"]').click();

    // Verify item appears in list
    cy.get('[data-testid="items-list"]')
      .should('contain', 'Test Item')
      .and('contain', 'This is a test item');

    // Edit the item
    cy.get('[data-testid="edit-item-button"]').first().click();
    cy.get('[data-testid="item-title-input"]').clear().type('Updated Test Item');
    cy.get('[data-testid="save-item-button"]').click();

    // Verify update
    cy.get('[data-testid="items-list"]').should('contain', 'Updated Test Item');

    // Delete the item
    cy.get('[data-testid="delete-item-button"]').first().click();
    cy.get('[data-testid="confirm-delete-button"]').click();

    // Verify deletion
    cy.get('[data-testid="items-list"]').should('not.contain', 'Updated Test Item');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API call and force it to fail
    cy.intercept('POST', '/api/items', { statusCode: 500 }).as('createItemError');

    cy.get('[data-testid="add-item-button"]').click();
    cy.get('[data-testid="item-title-input"]').type('Test Item');
    cy.get('[data-testid="save-item-button"]').click();

    // Wait for the intercepted request
    cy.wait('@createItemError');

    // Verify error handling
    cy.get('[data-testid="error-toast"]')
      .should('be.visible')
      .and('contain', 'Failed to create item');
  });
});

// Custom commands for reusability
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            End-to-End Testing with Cypress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            E2E tests simulate real user interactions with your application, testing complete user flows
            from start to finish across the entire stack.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{testName.replace(/([A-Z])/g, ' $1')}</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Duration: {result.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Steps: {result.steps}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Run Test
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="user-flow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-flow">User Flow</TabsTrigger>
          <TabsTrigger value="auth-flow">Authentication</TabsTrigger>
          <TabsTrigger value="data-flow">Data Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="user-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Registration Flow
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Cypress</Badge>
                <Badge variant="outline">Form Testing</Badge>
                <Badge variant="outline">Navigation</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={userFlowTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Flow Testing</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Session Management</Badge>
                <Badge variant="outline">State Persistence</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={loginFlowTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Complete Data Flow Testing
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">CRUD Operations</Badge>
                <Badge variant="outline">API Integration</Badge>
                <Badge variant="outline">Error Handling</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={dataFlowTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
