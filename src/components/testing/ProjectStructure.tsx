
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, File, FileText } from 'lucide-react';

export const ProjectStructure = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Project Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm font-mono">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-blue-500" />
            <span>mern-testing/</span>
          </div>
          <div className="ml-4 space-y-1">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-500" />
              <span>client/</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-500" />
                <span>src/</span>
              </div>
              <div className="ml-8 space-y-1">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-green-500" />
                  <span>components/</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-purple-500" />
                  <span>tests/</span>
                </div>
                <div className="ml-8 space-y-1">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-orange-500" />
                    <span>unit/</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-orange-500" />
                    <span>integration/</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-yellow-500" />
                <span>cypress/</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-500" />
              <span>server/</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-500" />
                <span>src/</span>
              </div>
              <div className="ml-8 space-y-1">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-green-500" />
                  <span>controllers/</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-green-500" />
                  <span>models/</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-green-500" />
                  <span>routes/</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-purple-500" />
                <span>tests/</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>jest.config.js</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>package.json</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
