import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'fs';
import path from 'path';
import { checkAuth } from '@/lib/utils/auth-server';

// Configuration - using paths as seen from inside the container
const BACKUP_DIR = '/app/backups/db';
const DB_PATH = '/app/prisma/db/custom.db';

export async function GET(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      return await listBackups();
    } else if (action === 'create') {
      return await createBackup();
    } else if (action === 'restore') {
      const backupFile = searchParams.get('file');
      if (!backupFile) {
        return NextResponse.json({ error: 'Backup file not specified' }, { status: 400 });
      }
      return await restoreBackup(backupFile);
    } else if (action === 'download') {
      const backupFile = searchParams.get('file');
      if (!backupFile) {
        return NextResponse.json({ error: 'Backup file not specified' }, { status: 400 });
      }
      return await downloadBackup(backupFile);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in backup API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const backupFile = searchParams.get('file');

    if (action === 'restore-images') {
      if (!backupFile) {
        return NextResponse.json({ error: 'Backup file not specified' }, { status: 400 });
      }
      return await restoreImageBackup(backupFile);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in backup API POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function restoreImageBackup(backupFile: string) {
  // Validate backup file name to prevent directory traversal
  if (!/^images_backup_[a-zA-Z0-9_-]+\.tar\.gz$/.test(backupFile)) {
    return NextResponse.json({ error: 'Invalid image backup file name' }, { status: 400 });
  }

  const backupPath = path.join(BACKUP_DIR, backupFile);

  if (!existsSync(backupPath)) {
    return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
  }

  try {
    // Create a safety backup of current images
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').substring(0, 15);
    const safetyBackupPath = path.join(BACKUP_DIR, `images_pre_restore_${timestamp}.tar.gz`);

    // Backup current images directory
    execSync(`cd /app/public && tar -czf ${safetyBackupPath} images`, { encoding: 'utf-8' });

    // Remove current images directory contents
    execSync('rm -rf /app/public/images/*', { encoding: 'utf-8' });

    // Extract the backup images
    execSync(`cd /app/public && tar -xzf ${backupPath}`, { encoding: 'utf-8' });

    return NextResponse.json({
      success: true,
      message: 'Images restored successfully',
      restoredBackup: backupFile,
      safetyBackup: path.basename(safetyBackupPath)
    });
  } catch (error: any) {
    console.error('Image restore error:', error);
    return NextResponse.json({
      success: false,
      error: `Image restore failed: ${error.message}`
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const backupFile = searchParams.get('file');

    if (!backupFile) {
      return NextResponse.json({ error: 'Backup file not specified' }, { status: 400 });
    }

    // Validate backup file name to prevent directory traversal
    if (!/^[a-zA-Z0-9_-]+\.(db|tar\.gz)$/.test(backupFile)) {
      return NextResponse.json({ error: 'Invalid backup file name' }, { status: 400 });
    }

    const backupPath = path.join(BACKUP_DIR, backupFile);

    if (!existsSync(backupPath)) {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }

    // Delete the backup file
    unlinkSync(backupPath);

    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully',
      deletedFile: backupFile
    });
  } catch (error: any) {
    console.error('Delete backup error:', error);
    return NextResponse.json({
      success: false,
      error: `Delete failed: ${error.message}`
    }, { status: 500 });
  }
}

async function downloadBackup(backupFile: string) {
  if (!/^[a-zA-Z0-9_-]+\.(db|tar\.gz)$/.test(backupFile)) {
    return NextResponse.json({ error: 'Invalid backup file name' }, { status: 400 });
  }

  const backupPath = path.join(BACKUP_DIR, backupFile);

  if (!existsSync(backupPath)) {
    return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
  }

  const fileBuffer = readFileSync(backupPath);
  const contentType = backupFile.endsWith('.db')
    ? 'application/x-sqlite3'
    : 'application/gzip';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${backupFile}"`,
      'Content-Length': String(fileBuffer.length),
    },
  });
}

async function listBackups() {
  if (!existsSync(BACKUP_DIR)) {
    return NextResponse.json({ backups: [] });
  }

  // Get both database and image backups
  const allBackupFiles = readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.db') || file.startsWith('images_backup_'))
    .map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = statSync(filePath);
      return {
        name: file,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        type: file.endsWith('.db') ? 'database' : 'images'
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ backups: allBackupFiles });
}

async function createBackup() {
  try {
    // Execute the POSIX-compliant backup script
    const result = execSync('/app/scripts/container-backup-db.sh', {
      encoding: 'utf-8',
      timeout: 30000, // 30 seconds timeout
      shell: '/bin/sh'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Backup created successfully',
      details: result 
    });
  } catch (error: any) {
    console.error('Backup creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Backup failed: ${error.message}` 
    }, { status: 500 });
  }
}

async function restoreBackup(backupFile: string) {
  // Validate backup file name to prevent directory traversal
  if (!/^[a-zA-Z0-9_-]+\.db$/.test(backupFile)) {
    return NextResponse.json({ error: 'Invalid backup file name' }, { status: 400 });
  }

  const backupPath = path.join(BACKUP_DIR, backupFile);

  if (!existsSync(backupPath)) {
    return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
  }

  try {
    // Create a safety backup of current database
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').substring(0, 15);
    const safetyBackupPath = path.join(BACKUP_DIR, `pre_restore_${timestamp}.db`);
    execSync(`cp "${DB_PATH}" "${safetyBackupPath}"`, { encoding: 'utf-8' });

    // Stop the database connection by copying the backup over the current database
    execSync(`cp "${backupPath}" "${DB_PATH}"`, { encoding: 'utf-8' });

    return NextResponse.json({
      success: true,
      message: 'Database restored successfully. The application may need to be restarted for changes to take full effect.',
      restoredBackup: backupFile,
      safetyBackup: path.basename(safetyBackupPath)
    });
  } catch (error: any) {
    console.error('Restore error:', error);
    return NextResponse.json({
      success: false,
      error: `Restore failed: ${error.message}`
    }, { status: 500 });
  }
}