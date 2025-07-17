import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Bug, Code, Terminal, Rocket, Lightbulb } from 'lucide-react';
import { DeploymentSection } from './testing/DeploymentSection';

export const TestingDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MERN Testing & DevOps Hub</h1>
              <p className="text-gray-600">Comprehensive testing, debugging, and deployment guide</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/bug-tracker')}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" />
            Open Bug Tracker
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="unit">Unit Testing</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="e2e">E2E Testing</TabsTrigger>
            <TabsTrigger value="debugging">Debugging</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to the MERN Testing & DevOps Hub</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This dashboard provides a comprehensive guide to testing, debugging, and deploying your MERN stack application.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="unit">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Learn how to write effective unit tests for your React components and Node.js modules.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Discover how to test the integration between different parts of your application, such as React components and API endpoints.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="e2e">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>End-to-End Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Explore how to write end-to-end tests to ensure your application works correctly from the user's perspective.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="debugging">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Debugging Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This section shows debugging tools and techniques for MERN applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example Test Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Explore example test cases for different parts of your MERN application.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployment">
            <DeploymentSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
