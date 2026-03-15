import path from 'path';
import fs from 'fs';

export interface Note {
  id: string;
  title: string;
  filePath: string;
  updatedAt: number;
  createdAt: number;
}

let dbInstance: any = null;

function getDatabasePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory:', dataDir);
  }
  return path.join(dataDir, 'metadata.db');
}

function initializeDatabase(db: any): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      file_path TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
  console.log('Database initialized successfully');
}

export function getDatabase(): any {
  if (!dbInstance) {
    const dbPath = getDatabasePath();
    console.log('Opening database at:', dbPath);
    const Database = require('better-sqlite3');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    initializeDatabase(dbInstance);
  }
  return dbInstance;
}

export function getAllNotes(): Note[] {
  try {
    const db = getDatabase();
    const stmt = db.prepare('SELECT id, title, file_path AS filePath, updated_at AS updatedAt, created_at AS createdAt FROM notes ORDER BY updated_at DESC');
    const rows = stmt.all() as Note[];
    console.log('Retrieved all notes, count:', rows.length);
    return rows;
  } catch (error) {
    console.error('Error getting all notes:', error);
    throw error;
  }
}

export function createNote(id: string, title: string, filePath: string): Note {
  try {
    const db = getDatabase();
    const now = Date.now();
    const stmt = db.prepare(
      'INSERT INTO notes (id, title, file_path, updated_at, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(id, title, filePath, now, now);
    console.log('Created note:', id, title);
    return {
      id,
      title,
      filePath,
      updatedAt: now,
      createdAt: now,
    };
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

export function updateNoteTitle(id: string, title: string): Note | null {
  try {
    const db = getDatabase();
    const now = Date.now();
    const stmt = db.prepare(
      'UPDATE notes SET title = ?, updated_at = ? WHERE id = ?'
    );
    const result = stmt.run(title, now, id);
    
    if (result.changes === 0) {
      console.log('No note found to update with id:', id);
      return null;
    }
    
    const selectStmt = db.prepare(
      'SELECT id, title, file_path AS filePath, updated_at AS updatedAt, created_at AS createdAt FROM notes WHERE id = ?'
    );
    const note = selectStmt.get(id) as Note | undefined;
    console.log('Updated note title:', id, title);
    return note || null;
  } catch (error) {
    console.error('Error updating note title:', error);
    throw error;
  }
}

export function updateNoteContent(id: string, filePath: string): Note | null {
  try {
    const db = getDatabase();
    const now = Date.now();
    const stmt = db.prepare(
      'UPDATE notes SET file_path = ?, updated_at = ? WHERE id = ?'
    );
    const result = stmt.run(filePath, now, id);
    
    if (result.changes === 0) {
      console.log('No note found to update with id:', id);
      return null;
    }
    
    const selectStmt = db.prepare(
      'SELECT id, title, file_path AS filePath, updated_at AS updatedAt, created_at AS createdAt FROM notes WHERE id = ?'
    );
    const note = selectStmt.get(id) as Note | undefined;
    console.log('Updated note content:', id, filePath);
    return note || null;
  } catch (error) {
    console.error('Error updating note content:', error);
    throw error;
  }
}

export function deleteNote(id: string): boolean {
  try {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      console.log('No note found to delete with id:', id);
      return false;
    }
    
    console.log('Deleted note:', id);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

export function searchNotes(query: string): Note[] {
  try {
    const db = getDatabase();
    const searchTerm = `%${query}%`;
    
    // 搜索标题
    const titleStmt = db.prepare(`
      SELECT id, title, file_path AS filePath, updated_at AS updatedAt, created_at AS createdAt 
      FROM notes 
      WHERE title LIKE ? 
      ORDER BY updated_at DESC
    `);
    const titleResults = titleStmt.all(searchTerm) as Note[];
    
    // 搜索内容（读取文件内容）
    const allNotes = getAllNotes();
    const contentResults: Note[] = [];
    
    for (const note of allNotes) {
      // 跳过已经在标题搜索结果中的笔记
      if (titleResults.find(n => n.id === note.id)) {
        continue;
      }
      
      try {
        const fs = require('fs');
        if (fs.existsSync(note.filePath)) {
          const content = fs.readFileSync(note.filePath, 'utf-8');
          if (content.includes(query)) {
            contentResults.push(note);
          }
        }
      } catch (error) {
        console.error(`Error reading note file ${note.filePath}:`, error);
        // 继续处理其他笔记
      }
    }
    
    const results = [...titleResults, ...contentResults];
    console.log(`Search results for "${query}": ${results.length} notes found`);
    return results;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
}
