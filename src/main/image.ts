import path from 'path';
import fs from 'fs/promises';
import { createImageDirectory } from './file';

export async function saveImage(
  fileBuffer: Buffer,
  noteId: string
): Promise<string> {
  console.log('===== 后端保存图片 =====');
  console.log('笔记 ID:', noteId);
  console.log('Buffer 大小:', fileBuffer.length);
  
  try {
    const imageDir = await createImageDirectory(noteId);
    console.log('图片目录:', imageDir);
    
    const timestamp = Date.now();
    const fileName = `${timestamp}.png`;
    const imagePath = path.join(imageDir, fileName);
    console.log('保存路径:', imagePath);

    console.log('写入文件...');
    await fs.writeFile(imagePath, fileBuffer);
    console.log('✓ 文件写入成功');

    const relativePath = path.join('assets', 'images', noteId, fileName);
    console.log('返回相对路径:', relativePath);
    console.log('===== 图片保存完成 =====');
    return relativePath;
  } catch (error: any) {
    console.error('===== 图片保存失败 =====');
    console.error('错误:', error);
    console.error('错误消息:', error.message);
    throw error;
  }
}
