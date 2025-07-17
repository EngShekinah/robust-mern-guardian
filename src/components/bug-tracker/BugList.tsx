
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Clock, User, Calendar } from 'lucide-react';
import { BugReport } from '../BugTracker';

interface BugListProps {
  bugs: BugReport[];
  onUpdateBug: (bugId: string, updates: Partial<BugReport>) => void;
  onDeleteBug: (bugId: string) => void;
}

export const BugList: React.FC<BugListProps> = ({ bugs, onUpdateBug, onDeleteBug }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (bugId: string, newStatus: BugReport['status']) => {
    onUpdateBug(bugId, { status: newStatus });
  };

  if (bugs.length === 0) {
    return (
      <Card data-testid="empty-bug-list">
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bugs found</h3>
          <p className="text-gray-600">
            No bugs match your current search and filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="bug-list">
      {bugs.map((bug) => (
        <Card key={bug.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2" data-testid={`bug-title-${bug.id}`}>
                  {bug.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    className={getSeverityColor(bug.severity)}
                    data-testid={`bug-severity-${bug.id}`}
                  >
                    {bug.severity}
                  </Badge>
                  <Badge
                    className={getStatusColor(bug.status)}
                    data-testid={`bug-status-${bug.id}`}
                  >
                    {bug.status}
                  </Badge>
                  {bug.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs"
                      data-testid={`bug-tag-${bug.id}-${tag}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid={`edit-bug-${bug.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteBug(bug.id)}
                  className="text-red-600 hover:text-red-700"
                  data-testid={`delete-bug-${bug.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4" data-testid={`bug-description-${bug.id}`}>
              {bug.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Reporter: {bug.reporter}</span>
              </div>
              {bug.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Assignee: {bug.assignee}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {bug.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={bug.status}
                onChange={(e) => handleStatusChange(bug.id, e.target.value as BugReport['status'])}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                data-testid={`status-select-${bug.id}`}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
