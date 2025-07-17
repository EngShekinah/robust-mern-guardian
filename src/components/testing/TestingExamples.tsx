
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from './CodeBlock';
import { TestTube, Bug, Play, Shield } from 'lucide-react';

export const TestingExamples = () => {
  const bugFormTest = `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugForm } from '../components/bug-tracker/BugForm';

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByTestId('bug-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('severity-select')).toBeInTheDocument();
    expect(screen.getByTestId('reporter-input')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
      expect(screen.getByTestId('description-error')).toHaveTextContent('Description is required');
      expect(screen.getByTestId('reporter-error')).toHaveTextContent('Reporter name is required');
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates minimum length requirements', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await user.type(screen.getByTestId('title-input'), 'Bug');
    await user.type(screen.getByTestId('description-input'), 'Short');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title must be at least 5 characters');
      expect(screen.getByTestId('description-error')).toHaveTextContent('Description must be at least 10 characters');
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await user.type(screen.getByTestId('title-input'), 'Login form validation error');
    await user.type(screen.getByTestId('description-input'), 'The email validation allows invalid email formats to pass through');
    await user.type(screen.getByTestId('reporter-input'), 'John Doe');
    await user.selectOptions(screen.getByTestId('severity-select'), 'high');
    
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Login form validation error',
        description: 'The email validation allows invalid email formats to pass through',
        severity: 'high',
        status: 'open',
        assignee: '',
        reporter: 'John Doe',
        tags: []
      });
    });
  });

  test('manages tags correctly', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const tagInput = screen.getByTestId('tag-input');
    const addTagButton = screen.getByTestId('add-tag-button');
    
    // Add a tag
    await user.type(tagInput, 'frontend');
    await user.click(addTagButton);
    
    expect(screen.getByTestId('tag-frontend')).toBeInTheDocument();
    expect(tagInput).toHaveValue('');
    
    // Try to add duplicate tag
    await user.type(tagInput, 'frontend');
    await user.click(addTagButton);
    
    expect(screen.getAllByTestId('tag-frontend')).toHaveLength(1);
  });

  test('cancels form correctly', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await user.click(screen.getByTestId('cancel-button'));
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});`;

  const bugListTest = `import { render, screen, fireEvent } from '@testing-library/react';
import { BugList } from '../components/bug-tracker/BugList';

describe('BugList Component', () => {
  const mockBugs = [
    {
      id: '1',
      title: 'Login form validation not working',
      description: 'Email validation allows invalid formats',
      severity: 'high',
      status: 'open',
      reporter: 'John Doe',
      assignee: 'Jane Smith',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['frontend', 'validation']
    },
    {
      id: '2',
      title: 'Database connection timeout',
      description: 'Server throws timeout error during peak hours',
      severity: 'critical',
      status: 'in-progress',
      reporter: 'Alice Johnson',
      assignee: 'Bob Wilson',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      tags: ['backend', 'database']
    }
  ];

  const mockOnUpdateBug = jest.fn();
  const mockOnDeleteBug = jest.fn();

  beforeEach(() => {
    mockOnUpdateBug.mockClear();
    mockOnDeleteBug.mockClear();
  });

  test('renders empty state when no bugs', () => {
    render(<BugList bugs={[]} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    expect(screen.getByTestId('empty-bug-list')).toBeInTheDocument();
    expect(screen.getByText('No bugs found')).toBeInTheDocument();
  });

  test('renders bug list correctly', () => {
    render(<BugList bugs={mockBugs} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    expect(screen.getByTestId('bug-title-1')).toHaveTextContent('Login form validation not working');
    expect(screen.getByTestId('bug-title-2')).toHaveTextContent('Database connection timeout');
  });

  test('displays bug details correctly', () => {
    render(<BugList bugs={mockBugs} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    // Check severity badges
    expect(screen.getByTestId('bug-severity-1')).toHaveTextContent('high');
    expect(screen.getByTestId('bug-severity-2')).toHaveTextContent('critical');
    
    // Check status badges
    expect(screen.getByTestId('bug-status-1')).toHaveTextContent('open');
    expect(screen.getByTestId('bug-status-2')).toHaveTextContent('in-progress');
    
    // Check tags
    expect(screen.getByTestId('bug-tag-1-frontend')).toHaveTextContent('frontend');
    expect(screen.getByTestId('bug-tag-1-validation')).toHaveTextContent('validation');
  });

  test('handles status change correctly', () => {
    render(<BugList bugs={mockBugs} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    const statusSelect = screen.getByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });
    
    expect(mockOnUpdateBug).toHaveBeenCalledWith('1', { status: 'resolved' });
  });

  test('handles delete correctly', () => {
    render(<BugList bugs={mockBugs} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    const deleteButton = screen.getByTestId('delete-bug-1');
    fireEvent.click(deleteButton);
    
    expect(mockOnDeleteBug).toHaveBeenCalledWith('1');
  });

  test('applies correct CSS classes for severity', () => {
    render(<BugList bugs={mockBugs} onUpdateBug={mockOnUpdateBug} onDeleteBug={mockOnDeleteBug} />);
    
    const highSeverityBadge = screen.getByTestId('bug-severity-1');
    const criticalSeverityBadge = screen.getByTestId('bug-severity-2');
    
    expect(highSeverityBadge).toHaveClass('bg-orange-100', 'text-orange-800');
    expect(criticalSeverityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });
});`;

  const apiTest = `const request = require('supertest');
const app = require('../src/app');
const Bug = require('../src/models/Bug');
const { connectDB, closeDB } = require('../src/config/database');

describe('Bug API Routes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await Bug.deleteMany({});
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug report', async () => {
      const bugData = {
        title: 'Login form validation error',
        description: 'Email validation allows invalid formats',
        severity: 'high',
        status: 'open',
        reporter: 'John Doe',
        tags: ['frontend', 'validation']
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body).toHaveProperty('bug');
      expect(response.body.bug.title).toBe(bugData.title);
      expect(response.body.bug.severity).toBe(bugData.severity);
      expect(response.body.bug).toHaveProperty('id');
      expect(response.body.bug).toHaveProperty('createdAt');
    });

    test('should validate required fields', async () => {
      const invalidBugData = {
        description: 'Missing title and reporter'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBugData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('required')
        })
      );
    });

    test('should validate severity enum values', async () => {
      const bugData = {
        title: 'Test bug',
        description: 'Test description',
        severity: 'invalid-severity',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'severity',
          message: expect.stringContaining('must be one of')
        })
      );
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          severity: 'high',
          status: 'open',
          reporter: 'John Doe',
          tags: ['frontend']
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          severity: 'low',
          status: 'resolved',
          reporter: 'Jane Smith',
          tags: ['backend']
        }
      ]);
    });

    test('should return all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toHaveProperty('bugs');
      expect(response.body.bugs).toHaveLength(2);
      expect(response.body.bugs[0]).toHaveProperty('title');
      expect(response.body.bugs[0]).toHaveProperty('id');
    });

    test('should filter bugs by status', async () => {
      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.bugs).toHaveLength(1);
      expect(response.body.bugs[0].status).toBe('open');
    });

    test('should filter bugs by severity', async () => {
      const response = await request(app)
        .get('/api/bugs?severity=high')
        .expect(200);

      expect(response.body.bugs).toHaveLength(1);
      expect(response.body.bugs[0].severity).toBe('high');
    });

    test('should search bugs by title', async () => {
      const response = await request(app)
        .get('/api/bugs?search=Bug 1')
        .expect(200);

      expect(response.body.bugs).toHaveLength(1);
      expect(response.body.bugs[0].title).toBe('Bug 1');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Test bug',
        description: 'Test description',
        severity: 'medium',
        status: 'open',
        reporter: 'John Doe'
      });
      bugId = bug._id.toString();
    });

    test('should update bug status', async () => {
      const response = await request(app)
        .put(\`/api/bugs/\${bugId}\`)
        .send({ status: 'resolved' })
        .expect(200);

      expect(response.body.bug.status).toBe('resolved');
      expect(response.body.bug).toHaveProperty('updatedAt');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .put(\`/api/bugs/\${fakeId}\`)
        .send({ status: 'resolved' })
        .expect(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'This bug will be deleted',
        severity: 'low',
        status: 'open',
        reporter: 'John Doe'
      });
      bugId = bug._id.toString();
    });

    test('should delete a bug', async () => {
      await request(app)
        .delete(\`/api/bugs/\${bugId}\`)
        .expect(204);

      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .delete(\`/api/bugs/\${fakeId}\`)
        .expect(404);
    });
  });
});`;

  const e2eTest = `describe('Bug Tracker E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/bug-tracker');
    cy.intercept('GET', '/api/bugs', { fixture: 'bugs.json' }).as('getBugs');
    cy.intercept('POST', '/api/bugs', { statusCode: 201, body: { bug: { id: '123' } } }).as('createBug');
  });

  describe('Bug Creation Flow', () => {
    it('should create a new bug report successfully', () => {
      // Open bug creation form
      cy.get('[data-testid="create-bug-button"]').click();
      cy.get('[data-testid="bug-form"]').should('be.visible');

      // Fill out the form
      cy.get('[data-testid="title-input"]').type('Login form validation error');
      cy.get('[data-testid="description-input"]').type('The email validation allows invalid email formats to pass through the system');
      cy.get('[data-testid="reporter-input"]').type('John Doe');
      cy.get('[data-testid="severity-select"]').select('high');

      // Add tags
      cy.get('[data-testid="tag-input"]').type('frontend');
      cy.get('[data-testid="add-tag-button"]').click();
      cy.get('[data-testid="tag-frontend"]').should('be.visible');

      cy.get('[data-testid="tag-input"]').type('validation');
      cy.get('[data-testid="add-tag-button"]').click();
      cy.get('[data-testid="tag-validation"]').should('be.visible');

      // Submit the form
      cy.get('[data-testid="submit-button"]').click();

      // Verify API call
      cy.wait('@createBug').then((interception) => {
        expect(interception.request.body).to.deep.include({
          title: 'Login form validation error',
          severity: 'high',
          reporter: 'John Doe',
          tags: ['frontend', 'validation']
        });
      });
    });

    it('should validate form fields before submission', () => {
      cy.get('[data-testid="create-bug-button"]').click();
      cy.get('[data-testid="submit-button"]').click();

      // Check for validation errors
      cy.get('[data-testid="title-error"]').should('contain', 'Title is required');
      cy.get('[data-testid="description-error"]').should('contain', 'Description is required');
      cy.get('[data-testid="reporter-error"]').should('contain', 'Reporter name is required');
    });

    it('should validate minimum field lengths', () => {
      cy.get('[data-testid="create-bug-button"]').click();
      
      cy.get('[data-testid="title-input"]').type('Bug');
      cy.get('[data-testid="description-input"]').type('Short');
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="title-error"]').should('contain', 'at least 5 characters');
      cy.get('[data-testid="description-error"]').should('contain', 'at least 10 characters');
    });
  });

  describe('Bug List and Filtering', () => {
    it('should display bug list with correct information', () => {
      cy.wait('@getBugs');
      
      cy.get('[data-testid="bug-list"]').should('be.visible');
      cy.get('[data-testid="bug-title-1"]').should('contain', 'Login form validation');
      cy.get('[data-testid="bug-severity-1"]').should('contain', 'high');
      cy.get('[data-testid="bug-status-1"]').should('contain', 'open');
    });

    it('should filter bugs by status', () => {
      cy.wait('@getBugs');
      
      cy.get('[data-testid="status-filter"]').select('resolved');
      
      // Should only show resolved bugs
      cy.get('[data-testid="bug-status-3"]').should('contain', 'resolved');
      cy.get('[data-testid="bug-status-1"]').should('not.exist');
    });

    it('should search bugs by title', () => {
      cy.wait('@getBugs');
      
      cy.get('[data-testid="search-input"]').type('validation');
      
      // Should filter results based on search term
      cy.get('[data-testid="bug-title-1"]').should('be.visible');
      cy.get('[data-testid="bug-title-2"]').should('not.exist');
    });

    it('should clear all filters', () => {
      cy.wait('@getBugs');
      
      cy.get('[data-testid="status-filter"]').select('resolved');
      cy.get('[data-testid="severity-filter"]').select('critical');
      cy.get('[data-testid="clear-filters"]').click();
      
      cy.get('[data-testid="status-filter"]').should('have.value', 'all');
      cy.get('[data-testid="severity-filter"]').should('have.value', 'all');
    });
  });

  describe('Bug Management', () => {
    it('should update bug status', () => {
      cy.intercept('PUT', '/api/bugs/*', { statusCode: 200, body: { bug: { status: 'resolved' } } }).as('updateBug');
      cy.wait('@getBugs');
      
      cy.get('[data-testid="status-select-1"]').select('resolved');
      
      cy.wait('@updateBug').then((interception) => {
        expect(interception.request.body).to.deep.include({
          status: 'resolved'
        });
      });
    });

    it('should delete a bug', () => {
      cy.intercept('DELETE', '/api/bugs/*', { statusCode: 204 }).as('deleteBug');
      cy.wait('@getBugs');
      
      cy.get('[data-testid="delete-bug-1"]').click();
      
      cy.wait('@deleteBug');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('POST', '/api/bugs', { statusCode: 500, body: { message: 'Server error' } }).as('createBugError');
      
      cy.get('[data-testid="create-bug-button"]').click();
      cy.get('[data-testid="title-input"]').type('Test Bug Title');
      cy.get('[data-testid="description-input"]').type('Test description for the bug');
      cy.get('[data-testid="reporter-input"]').type('Test User');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.wait('@createBugError');
      
      // Should show error message
      cy.get('[data-testid="error-toast"]').should('be.visible');
      cy.get('[data-testid="error-toast"]').should('contain', 'Failed to create bug');
    });

    it('should handle network errors', () => {
      cy.intercept('GET', '/api/bugs', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/bug-tracker');
      cy.wait('@networkError');
      
      // Should show error state
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Failed to load bugs');
    });
  });

  describe('Responsive Design', () => {
    it('should work correctly on mobile devices', () => {
      cy.viewport('iphone-6');
      cy.wait('@getBugs');
      
      cy.get('[data-testid="bug-list"]').should('be.visible');
      cy.get('[data-testid="create-bug-button"]').should('be.visible');
      
      // Test form on mobile
      cy.get('[data-testid="create-bug-button"]').click();
      cy.get('[data-testid="bug-form"]').should('be.visible');
      cy.get('[data-testid="title-input"]').should('be.visible');
    });
  });
});`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Bug Tracker Testing Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive testing examples for the Bug Tracker application, demonstrating 
            unit tests, integration tests, and end-to-end testing strategies.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="unit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="unit">Unit Tests</TabsTrigger>
          <TabsTrigger value="integration">Integration Tests</TabsTrigger>
          <TabsTrigger value="e2e">E2E Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                BugForm Component Tests
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">React Testing Library</Badge>
                <Badge variant="outline">Form Validation</Badge>
                <Badge variant="outline">User Events</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={bugFormTest} language="javascript" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>BugList Component Tests</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Component Rendering</Badge>
                <Badge variant="outline">State Management</Badge>
                <Badge variant="outline">Event Handling</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={bugListTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bug API Integration Tests
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Supertest</Badge>
                <Badge variant="outline">MongoDB Memory Server</Badge>
                <Badge variant="outline">API Validation</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={apiTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="e2e" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Complete User Flow Tests
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Cypress</Badge>
                <Badge variant="outline">User Flows</Badge>
                <Badge variant="outline">API Mocking</Badge>
                <Badge variant="outline">Error Handling</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={e2eTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
