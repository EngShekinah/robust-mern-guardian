
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Code, 
  Database, 
  Globe, 
  Bug,
  BarChart3,
  FileText,
  Layers,
  Zap
} from 'lucide-react';
import { UnitTestingSection } from './testing/UnitTestingSection';
import { IntegrationTestingSection } from './testing/IntegrationTestingSection';
import { E2ETestingSection } from './testing/E2ETestingSection';
import { DebuggingSection } from './testing/DebuggingSection';
import { CoverageReport } from './testing/CoverageReport';
import { ProjectStructure } from './testing/ProjectStructure';

export const TestingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [testResults, setTestResults] = useState({
    unit: { passed: 12, failed: 0, total: 12 },
    integration: { passed: 8, failed: 1, total: 9 },
    e2e: { passed: 5, failed: 0, total: 5 }
  });

  const overallCoverage = 85;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              MERN Testing & Debugging Laboratory
            </h1>
            <p className="text-gray-600">
              Comprehensive testing strategies for robust MERN applications
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Unit Tests</p>
                  <p className="text-2xl font-bold text-green-600">
                    {testResults.unit.passed}/{testResults.unit.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Integration</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {testResults.integration.passed}/{testResults.integration.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">E2E Tests</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {testResults.e2e.passed}/{testResults.e2e.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-orange-600">{overallCoverage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="unit">Unit Testing</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="e2e">E2E Testing</TabsTrigger>
          <TabsTrigger value="debugging">Debugging</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectStructure />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Testing Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Unit Tests</span>
                    </div>
                    <Badge variant="secondary">Jest + RTL</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Integration Tests</span>
                    </div>
                    <Badge variant="secondary">Supertest</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">E2E Tests</span>
                    </div>
                    <Badge variant="secondary">Cypress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Debugging</span>
                    </div>
                    <Badge variant="secondary">DevTools</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Testing Pipeline Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Test Coverage</span>
                  <span className="font-bold">{overallCoverage}%</span>
                </div>
                <Progress value={overallCoverage} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Unit Tests Passing</p>
                    <p className="text-sm text-gray-600">All component tests green</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-semibold">1 Integration Test Failing</p>
                    <p className="text-sm text-gray-600">API timeout issue</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">E2E Tests Passing</p>
                    <p className="text-sm text-gray-600">Critical flows working</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unit">
          <UnitTestingSection />
        </TabsContent>

        <TabsContent value="integration">
          <IntegrationTestingSection />
        </TabsContent>

        <TabsContent value="e2e">
          <E2ETestingSection />
        </TabsContent>

        <TabsContent value="debugging">
          <DebuggingSection />
        </TabsContent>

        <TabsContent value="coverage">
          <CoverageReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
