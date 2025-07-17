
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface BugFiltersProps {
  filters: {
    status: string;
    severity: string;
    assignee: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const BugFilters: React.FC<BugFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-400" />
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        data-testid="status-filter"
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={filters.severity}
        onChange={(e) => handleFilterChange('severity', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        data-testid="severity-filter"
      >
        <option value="all">All Severity</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFiltersChange({ status: 'all', severity: 'all', assignee: 'all' })}
        data-testid="clear-filters"
      >
        Clear
      </Button>
    </div>
  );
};
