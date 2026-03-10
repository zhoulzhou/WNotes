# WNotes 笔记应用需求文档

## 1. 项目概述

WNotes 是一个 Windows 平台桌面笔记应用，采用左右分栏布局，提供简洁高效的笔记管理功能。

### 1.1 产品定位
- 轻量级本地笔记应用
- 专注于核心的笔记编辑和管理功能
- 无复杂功能，简单易用

### 1.2 核心技术栈

**核心技术栈**：优先选「Electron + Vue3 + SQLite + 本地文件目录」，兼顾开发效率、新手友好度和 Windows 适配性。

**存储核心**：结构化文本（笔记信息）存在 SQLite，二进制图片存在本地目录，分离存储更高效。

**关键依赖**：
- **md-editor-v3**：Markdown 编辑
- **better-sqlite3**：SQLite 操作
- **sharp**：图片处理

直接复用可大幅减少开发量。

---

## 2. 界面设计

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  WNotes                                    □ - ×       │
├─────────────────┬───────────────────────────────────────┤
│                 │                                       │
│   笔记列表      │           笔记编辑器                   │
│   (左侧面板)    │           (右侧面板)                  │
│                 │                                       │
│                 │                                       │
└─────────────────┴───────────────────────────────────────┘
```

### 2.2 左侧面板 - 笔记列表

**功能组件**:
- 新建笔记按钮（置顶）
- 笔记列表项（垂直排列）
- 删除笔记按钮（每个笔记项）

**列表项显示内容**:
- 笔记标题
- 最后更新时间

**交互行为**:
- 点击笔记项 → 选中该笔记，右侧显示内容
- 点击新建按钮 → 创建空笔记，自动选中
- 点击删除按钮 → 删除该笔记（需确认）

### 2.3 右侧面板 - 笔记编辑器

**功能组件**:
- 标题输入框（单行文本）
- Markdown 编辑器（md-editor-v3）
- 图片插入（拖拽和点击）

**交互行为**:
- 标题编辑 → 实时更新左侧列表
- 内容编辑 → 支持 Markdown 语法
- 插入图片 → 支持拖拽和点击插入
- 自动保存 → 内容变化后自动保存
- 未选中笔记时 → 显示提示"请选择或创建笔记"

---

## 3. 功能需求

### 3.1 笔记管理

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 创建笔记 | 点击新建按钮创建空笔记 | P0 |
| 删除笔记 | 删除指定笔记，需二次确认 | P0 |
| 选择笔记 | 点击列表项选中笔记 | P0 |
| 列表排序 | 按更新时间倒序排列 | P0 |

### 3.2 笔记编辑

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 编辑标题 | 单行文本输入 | P0 |
| 编辑内容 | Markdown 格式文本输入 | P0 |
| 标题同步 | 标题变化时左侧列表实时更新 | P0 |
| 自动保存 | 内容变化后自动保存到本地 | P0 |
| Markdown 渲染 | 实时渲染 Markdown 格式 | P0 |
| 插入图片 | 支持拖拽和点击插入图片 | P0 |
| 图片预览 | 编辑器中显示图片预览 | P0 |

### 3.3 数据持久化

| 功能 | 描述 | 优先级 |
|------|------|--------|
| SQLite 存储 | 使用 SQLite 存储笔记元数据 | P0 |
| 文件存储 | 使用 .md 文件存储笔记内容 | P0 |
| 图片存储 | 使用本地目录存储图片 | P0 |
| 启动加载 | 应用启动时加载已有数据 | P0 |
| 自动保存 | 修改后自动保存，无需手动操作 | P0 |

---

## 4. 数据结构

### 4.1 SQLite 数据表

**表名**: `notes`

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
```

### 4.2 文件存储结构

```
data/
├── notes/                    # Markdown 文件目录
│   ├── note-1.md
│   └── note-2.md
├── assets/
│   └── images/               # 图片资源目录
│       ├── note-1/
│       │   ├── image-1.jpg
│       │   └── image-2.jpg
│       └── note-2/
│           └── image-1.jpg
└── metadata.db               # SQLite 数据库文件
```

### 4.3 Markdown 文件格式

每个笔记保存为独立的 `.md` 文件：

```markdown
# 笔记标题

笔记内容...

![图片描述](../assets/images/note-1/image-1.jpg)
```

---

## 5. 交互流程

### 5.1 启动流程

```
应用启动
    ↓
检查数据库文件是否存在
    ↓
加载 SQLite 中的笔记列表
    ↓
渲染笔记列表
    ↓
等待用户操作
```

### 5.2 标题编辑同步流程

```
用户编辑标题
    ↓
onChange 事件触发
    ↓
更新当前笔记状态
    ↓
左侧列表对应项实时更新
    ↓
防抖保存（500ms）
    ↓
更新 SQLite 元数据
```

### 5.3 笔记创建流程

```
点击新建按钮
    ↓
创建空笔记对象
    ↓
创建 .md 文件
    ↓
插入 SQLite 记录
    ↓
自动选中该笔记
    ↓
右侧编辑器聚焦标题输入框
```

### 5.4 笔记删除流程

```
点击删除按钮
    ↓
弹出确认对话框
    ↓
用户确认
    ↓
删除 .md 文件
    ↓
删除 SQLite 记录
    ↓
更新选中状态（如删除的是当前笔记）
```

### 5.5 图片插入流程

```
拖拽图片到编辑器
    ↓
sharp 处理图片（压缩、格式转换）
    ↓
保存到 data/assets/images/{noteId}/
    ↓
生成 Markdown 图片语法
    ↓
插入到编辑器光标位置
    ↓
自动保存
```

---

## 6. 技术实现

### 6.1 状态管理（Pinia）

```typescript
import { defineStore } from 'pinia';

interface Note {
  id: string;
  title: string;
  filePath: string;
  updatedAt: number;
  createdAt: number;
}

interface AppState {
  notes: Note[];
  selectedNoteId: string | null;
}

export const useStore = defineStore('main', {
  state: (): AppState => ({
    notes: [],
    selectedNoteId: null,
  }),
  
  actions: {
    setNotes(notes: Note[]) {
      this.notes = notes;
    },
    
    selectNote(noteId: string) {
      this.selectedNoteId = noteId;
    },
    
    updateNoteTitle(id: string, title: string) {
      const note = this.notes.find(n => n.id === id);
      if (note) {
        note.title = title;
        note.updatedAt = Date.now();
      }
    },
  },
});
```

### 6.2 SQLite 数据访问

```typescript
import Database from 'better-sqlite3';

const db = new Database('data/metadata.db');

// 初始化数据库
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// 获取所有笔记列表
export const getAllNotes = () => {
  return db
    .prepare('SELECT * FROM notes ORDER BY updated_at DESC')
    .all() as Note[];
};

// 创建笔记
export const createNote = (id: string, title: string, filePath: string) => {
  const now = Date.now();
  db.prepare(`
    INSERT INTO notes (id, title, file_path, updated_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, title, filePath, now, now);
};

// 更新笔记标题
export const updateNoteTitle = (id: string, title: string) => {
  db.prepare(`
    UPDATE notes SET title = ?, updated_at = ? WHERE id = ?
  `).run(title, Date.now(), id);
};

// 删除笔记
export const deleteNote = (id: string) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
};
```

### 6.3 文件系统操作

```typescript
import fs from 'fs/promises';
import path from 'path';

// 读取 Markdown 文件
export const readNoteFile = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, 'utf-8');
};

// 写入 Markdown 文件
export const writeNoteFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  await fs.writeFile(filePath, content, 'utf-8');
};

// 创建笔记文件
export const createNoteFile = async (
  noteId: string,
  title: string
): Promise<string> => {
  const notesDir = 'data/notes';
  await fs.mkdir(notesDir, { recursive: true });
  
  const filePath = path.join(notesDir, `${noteId}.md`);
  const content = `# ${title}\n\n`;
  await fs.writeFile(filePath, content, 'utf-8');
  
  return filePath;
};

// 删除笔记文件
export const deleteNoteFile = async (filePath: string): Promise<void> => {
  await fs.unlink(filePath);
};
```

### 6.4 图片处理（使用 Sharp）

```typescript
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// 保存图片（带压缩和优化）
export const saveImage = async (
  file: File,
  noteId: string
): Promise<string> => {
  const imageDir = path.join('data', 'assets', 'images', noteId);
  await fs.mkdir(imageDir, { recursive: true });
  
  const fileName = `${Date.now()}.jpg`;
  const imagePath = path.join(imageDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 使用 sharp 处理图片（压缩、格式转换）
  await sharp(buffer)
    .resize({ width: 1920, withoutEnlarging: true })
    .jpeg({ quality: 80 })
    .toFile(imagePath);
  
  return `../assets/images/${noteId}/${fileName}`;
};

// 生成图片缩略图
export const generateThumbnail = async (
  imagePath: string,
  thumbnailPath: string
) => {
  await sharp(imagePath)
    .resize({ width: 200, height: 200, fit: 'cover' })
    .toFile(thumbnailPath);
};
```

### 6.5 自动保存（防抖）

```typescript
// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 保存笔记
export const saveNote = async (
  noteId: string,
  filePath: string,
  content: string,
  title: string
) => {
  // 写入文件
  await writeNoteFile(filePath, content);
  
  // 更新 SQLite
  updateNoteTitle(noteId, title);
};

// 防抖保存
export const debouncedSave = debounce(saveNote, 500);
```

### 6.6 时间格式化

```typescript
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const formatTime = (timestamp: number): string => {
  return dayjs(timestamp).fromNow();
};
```

---

## 7. 项目结构

```
WNotes/
├── src/
│   ├── main/
│   │   ├── main.ts          # Electron 主进程入口
│   │   ├── preload.ts       # 预加载脚本
│   │   └── database.ts      # SQLite 数据库操作
│   ├── renderer/
│   │   ├── App.vue          # Vue 根组件
│   │   ├── main.ts          # Vue 入口
│   │   ├── components/
│   │   │   ├── NoteList.vue      # 左侧列表组件
│   │   │   ├── NoteEditor.vue    # 右侧编辑器（md-editor-v3）
│   │   │   └── NoteItem.vue      # 列表项组件
│   │   ├── store/
│   │   │   └── index.ts          # Pinia 状态管理
│   │   ├── utils/
│   │   │   ├── file.ts           # 文件操作
│   │   │   ├── image.ts          # 图片处理（Sharp）
│   │   │   └── format.ts         # 时间格式化
│   │   └── types/
│   │       └── index.ts          # TypeScript 类型
│   └── shared/
│       └── types.ts              # 共享类型
├── data/
│   ├── notes/                    # Markdown 文件
│   ├── assets/
│   │   └── images/               # 图片资源
│   └── metadata.db               # SQLite 数据库
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.yml
└── README.md
```

---

## 8. 核心依赖

```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "vue": "^3.4.0",
    "pinia": "^2.1.7",
    "md-editor-v3": "^4.21.0",
    "better-sqlite3": "^9.2.0",
    "sharp": "^0.33.1",
    "ant-design-vue": "^5.12.0",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "electron-builder": "^24.9.0",
    "@types/better-sqlite3": "^7.6.8",
    "@types/sharp": "^0.31.0"
  }
}
```

---

## 9. 开发计划

### 阶段一：项目搭建（1-2 天）
- [ ] 初始化 Electron + Vue 3 + TypeScript 项目
- [ ] 配置 Vite 构建工具
- [ ] 安装核心依赖（md-editor-v3, better-sqlite3, sharp）
- [ ] 创建基础项目结构

### 阶段二：核心功能（2-3 天）
- [ ] 实现 SQLite 数据库操作
- [ ] 实现文件系统读写
- [ ] 实现左侧笔记列表组件
- [ ] 实现右侧 Markdown 编辑器组件
- [ ] 实现标题同步功能

### 阶段三：图片处理（1-2 天）
- [ ] 实现图片拖拽上传
- [ ] 集成 Sharp 图片处理
- [ ] 实现图片压缩和格式转换
- [ ] 实现图片预览

### 阶段四：完善优化（1-2 天）
- [ ] 实现自动保存（防抖）
- [ ] 实现删除确认对话框
- [ ] 界面样式美化
- [ ] 错误处理
- [ ] 打包测试

---

## 10. 验收标准

### 功能验收
- [ ] 可以创建新笔记
- [ ] 可以删除笔记（带确认）
- [ ] 可以编辑标题和内容
- [ ] 标题编辑时左侧列表实时更新
- [ ] 内容修改后自动保存
- [ ] 重启应用后数据不丢失
- [ ] 支持 Markdown 语法
- [ ] 支持插入图片（拖拽和点击）
- [ ] Markdown 实时预览正常
- [ ] 图片显示正常

### 性能验收
- [ ] 列表项点击响应无延迟
- [ ] 标题输入无明显卡顿
- [ ] 保存操作不影响用户体验
- [ ] Markdown 渲染流畅

### 体验验收
- [ ] 界面简洁美观
- [ ] 交互流畅自然
- [ ] 错误提示友好
- [ ] Markdown 预览清晰易读

---

## 11. 不包含的功能

以下功能明确**不包含**在本版本中：

- ❌ 搜索功能
- ❌ 标签/分类功能
- ❌ 云同步
- ❌ 主题切换
- ❌ 导出功能
- ❌ 快捷键系统
- ❌ 笔记加密
- ❌ 版本历史
- ❌ 附件管理（除图片外）
- ❌ 富文本格式化（WYSIWYG）

---

## 12. 文档版本

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03-09 | 初始版本 |
| v1.1 | 2026-03-09 | 增加 Markdown 和图片支持 |
| v2.0 | 2026-03-09 | 精简版：Electron + Vue3 + SQLite + 本地文件 |
