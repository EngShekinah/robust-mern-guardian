
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, XCircle, Code, Clock } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export const UnitTestingSection = () => {
  const [testResults, setTestResults] = useState({
    userCard: { status: 'passed', duration: '45ms' },
    loginForm: { status: 'passed', duration: '67ms' },
    userUtils: { status: 'passed', duration: '23ms' },
    apiService: { status: 'failed', duration: '156ms' }
  });

  const [runningTest, setRunningTest] = useState(null);

  const runTest = (testName) => {
    setRunningTest(testName);
    setTimeout(() => {
      setRunningTest(null);
      // Simulate test completion
    }, 2000);
  };

  const userCardTest = `import { render, screen } from '@testing-library/react';
import { UserCard } from '../components/UserCard';

describe('UserCard Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  test('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe avatar')).toBeInTheDocument();
  });

  test('handles missing user data gracefully', () => {
    render(<UserCard user={null} />);
    
    expect(screen.getByText('Guest User')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<UserCard user={mockUser} />);
    
    const card = screen.getByTestId('user-card');
    expect(card).toHaveClass('user-card', 'bg-white', 'shadow-md');
  });
});`;

  const loginFormTest = `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('validates required fields', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});`;

  const utilsTest = `import { validateEmail, formatDate, calculateAge } from '../utils/helpers';

describe('Utility Functions', () => {
  describe('validateEmail', () => {
    test('returns true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('returns false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2023-12-25');
      expect(formatDate(date)).toBe('Dec 25, 2023');
    });

    test('handles invalid date', () => {
      expect(formatDate(null)).toBe('Invalid Date');
    });
  });

  describe('calculateAge', () => {
    test('calculates age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const today = new Date('2023-01-01');
      expect(calculateAge(birthDate, today)).toBe(33);
    });
  });
});`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Unit Testing with Jest & React Testing Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Unit tests focus on testing individual components and functions in isolation. 
            They're fast, reliable, and form the foundation of your testing strategy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{result.duration}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => runTest(testName)}
                  disabled={runningTest === testName}
                >
                  {runningTest === testName ? (
                    <>Running...</>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Run Test
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="component" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="component">Component Testing</TabsTrigger>
          <TabsTrigger value="form">Form Testing</TabsTrigger>
          <TabsTrigger value="utils">Utility Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="component" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UserCard Component Test</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">React Testing Library</Badge>
                <Badge variant="outline">Component Rendering</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={userCardTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LoginForm Component Test</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">User Events</Badge>
                <Badge variant="outline">Form Validation</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={loginFormTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utils" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utility Functions Test</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Pure Functions</Badge>
                <Badge variant="outline">Edge Cases</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code={utilsTest} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
