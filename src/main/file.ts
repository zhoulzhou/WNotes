
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTES_DIR = path.join(DATA_DIR, 'notes');
const IMAGES_DIR = path.join(DATA_DIR, 'assets', 'images');

export async function initializeDirectories(): Promise<void> {
  try {
    await fs.mkdir(NOTES_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    console.log('Directories initialized');
  } catch (error) {
    console.error('Failed to initialize directories:', error);
    throw error;
  }
}

export async function readNoteFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    console.log('Read note file:', filePath);
    return content;
  } catch (error) {
    console.error('Failed to read note file:', filePath, error);
    throw error;
  }
}

export async function writeNoteFile(filePath: string, content: string): Promise<void> {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    console.log('Wrote note file:', filePath);
  } catch (error) {
    console.error('Failed to write note file:', filePath, error);
    throw error;
  }
}

export async function createNoteFile(noteId: string, title: string, defaultContent?: string): Promise<string> {
  try {
    await initializeDirectories();
    const filePath = path.join(NOTES_DIR, `${noteId}.md`);
    const content = defaultContent || `# ${title}\n\n`;
    await writeNoteFile(filePath, content);
    console.log('Created note file:', filePath);
    return filePath;
  } catch (error) {
    console.error('Failed to create note file:', error);
    throw error;
  }
}

export async function deleteNoteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    console.log('Deleted note file:', filePath);
  } catch (error) {
    console.error('Failed to delete note file:', filePath, error);
    throw error;
  }
}

export async function createImageDirectory(noteId: string): Promise<string> {
  try {
    const dirPath = path.join(IMAGES_DIR, noteId);
    await fs.mkdir(dirPath, { recursive: true });
    console.log('Created image directory:', dirPath);
    return dirPath;
  } catch (error) {
    console.error('Failed to create image directory:', error);
    throw error;
  }
}
