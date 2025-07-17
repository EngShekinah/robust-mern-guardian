
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, Plus, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BugForm } from './bug-tracker/BugForm';
import { BugList } from './bug-tracker/BugList';
import { BugFilters } from './bug-tracker/BugFilters';
import { BugStats } from './bug-tracker/BugStats';

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  reporter: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export const BugTracker = () => {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [filteredBugs, setFilteredBugs] = useState<BugReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    assignee: 'all'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockBugs: BugReport[] = [
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
      },
      {
        id: '3',
        title: 'UI button misalignment on mobile',
        description: 'Submit button appears cut off on small screens',
        severity: 'low',
        status: 'resolved',
        reporter: 'Charlie Brown',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-17'),
        tags: ['frontend', 'mobile', 'ui']
      }
    ];
    setBugs(mockBugs);
    setFilteredBugs(mockBugs);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = bugs;

    if (searchTerm) {
      filtered = filtered.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(bug => bug.status === filters.status);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(bug => bug.severity === filters.severity);
    }

    if (filters.assignee !== 'all') {
      filtered = filtered.filter(bug => bug.assignee === filters.assignee);
    }

    setFilteredBugs(filtered);
  }, [bugs, searchTerm, filters]);

  const handleCreateBug = (bugData: Omit<BugReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBug: BugReport = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setBugs(prev => [newBug, ...prev]);
    setShowForm(false);
  };

  const handleUpdateBug = (bugId: string, updates: Partial<BugReport>) => {
    setBugs(prev => prev.map(bug =>
      bug.id === bugId
        ? { ...bug, ...updates, updatedAt: new Date() }
        : bug
    ));
  };

  const handleDeleteBug = (bugId: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bug Tracker</h1>
              <p className="text-gray-600">Track and manage application issues</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
            data-testid="create-bug-button"
          >
            <Plus className="h-4 w-4" />
            Report Bug
          </Button>
        </div>

        {/* Stats */}
        <BugStats bugs={bugs} />

        <Tabs defaultValue="bugs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
            <TabsTrigger value="testing">Testing Examples</TabsTrigger>
            <TabsTrigger value="debugging">Debugging Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="bugs" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search bugs by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="search-input"
                      />
                    </div>
                  </div>
                  <BugFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </CardContent>
            </Card>

            {/* Bug List */}
            <BugList
              bugs={filteredBugs}
              onUpdateBug={handleUpdateBug}
              onDeleteBug={handleDeleteBug}
            />
          </TabsContent>

          <TabsContent value="testing">
            <div className="grid gap-6">
              {/* Testing examples will be added here */}
              <Card>
                <CardHeader>
                  <CardTitle>Testing Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This section demonstrates various testing approaches used in the Bug Tracker application.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="debugging">
            <div className="grid gap-6">
              {/* Debugging examples will be added here */}
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
        </Tabs>

        {/* Bug Form Modal */}
        {showForm && (
          <BugForm
            onSubmit={handleCreateBug}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};
