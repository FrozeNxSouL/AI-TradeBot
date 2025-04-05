// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const FILES_DIRECTORY = path.join(process.cwd(), 'private-files');

export async function GET(request: NextRequest) {
  try {
    // Get the directory path from the query parameter
    const searchParams = request.nextUrl.searchParams;
    const dirPath = searchParams.get('path') || '';
    
    // Prevent path traversal attacks
    const normalizedPath = path.normalize(dirPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(FILES_DIRECTORY, normalizedPath);
    
    // Check if the path exists and is within the allowed directory
    if (!fullPath.startsWith(FILES_DIRECTORY)) {
      return NextResponse.json(
        { error: 'Invalid directory path' },
        { status: 403 }
      );
    }
    
    try {
      // Check if directory exists
      const stats = await stat(fullPath);
      
      if (!stats.isDirectory()) {
        return NextResponse.json(
          { error: 'Not a directory' },
          { status: 400 }
        );
      }
      
      // Read the directory
      const entries = await readdir(fullPath);
      
      // Get file details
      const filesPromises = entries.map(async (entry) => {
        const entryPath = path.join(fullPath, entry);
        const relativePath = path.relative(FILES_DIRECTORY, entryPath);
        
        try {
          const entryStats = await stat(entryPath);
          
          return {
            name: entry,
            path: relativePath,
            size: entryStats.size,
            isDirectory: entryStats.isDirectory(),
            lastModified: entryStats.mtime.toISOString(),
          };
        } catch (error) {
          console.error(`Error getting stats for ${entry}:`, error);
          return null;
        }
      });
      
      const files = (await Promise.all(filesPromises)).filter(Boolean);
      
      // Sort directories first, then files
      files.sort((a, b) => {
        if (a!.isDirectory && !b!.isDirectory) return -1;
        if (!a!.isDirectory && b!.isDirectory) return 1;
        return a!.name.localeCompare(b!.name);
      });
      
      return NextResponse.json({
        currentPath: normalizedPath,
        files,
      });
      
    } catch (dirError) {
      console.error('Directory error:', dirError);
      return NextResponse.json(
        { error: 'Directory not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}