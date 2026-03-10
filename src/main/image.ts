
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { createImageDirectory } from './file';

export async function saveImage(
  fileBuffer: Buffer,
  noteId: string
): Promise&lt;string&gt; {
  try {
    const imageDir = await createImageDirectory(noteId);
    const fileName = `${Date.now()}.jpg`;
    const imagePath = path.join(imageDir, fileName);

    await sharp(fileBuffer)
      .resize({ width: 1920, withoutEnlarging: true })
      .jpeg({ quality: 80 })
      .toFile(imagePath);

    const relativePath = path.join('assets', 'images', noteId, fileName);
    console.log('Saved image:', imagePath);
    return relativePath;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
}
