# WNotes 笔记应用开发规范

## Why

基于需求文档，需要构建一个 Electron + Vue3 + SQLite + 本地文件的 Windows 桌面笔记应用，提供简洁高效的笔记管理功能。

## What Changes

* 创建完整的 Electron + Vue3 + TypeScript 项目架构

* 实现 SQLite 数据库存储笔记元数据

* 实现本地文件系统存储 Markdown 内容和图片

* 实现左右分栏的笔记列表和编辑器界面

* 集成 md-editor-v3 Markdown 编辑器

* 集成 Sharp 图片处理

* 实现自动保存和图片上传功能

## Impact

* 受影响的功能模块：

  * Electron 主进程和预加载脚本

  * Vue3 前端界面组件

  * SQLite 数据库操作

  * 文件系统操作

  * 图片处理和存储

* 核心文件：

  * `src/main/` - Electron 主进程

  * `src/renderer/` - Vue3 渲染进程

  * `data/` - 数据存储目录

## ADDED Requirements

### Requirement: 项目基础架构

系统 SHALL 提供：

* Electron + Vue3 + TypeScript 项目结构

* Vite 构建配置

* Electron-builder 打包配置

* 核心依赖安装（md-editor-v3, better-sqlite3, sharp, pinia, dayjs）

#### Scenario: 项目初始化成功

* **WHEN** 执行 npm install

* **THEN** 所有依赖正确安装，项目可以启动

### Requirement: 笔记列表功能

系统 SHALL 提供：

* 左侧笔记列表面板

* 新建笔记按钮

* 删除笔记按钮（带确认）

* 笔记项显示标题和更新时间

* 按更新时间倒序排列

* 点击选中笔记

#### Scenario: 创建笔记

* **WHEN** 用户点击新建按钮

* **THEN** 创建空笔记，自动选中，右侧编辑器显示并聚焦标题

#### Scenario: 删除笔记

* **WHEN** 用户点击删除按钮并确认

* **THEN** 删除笔记文件和数据库记录，更新选中状态

### Requirement: 笔记编辑功能

系统 SHALL 提供：

* 右侧编辑器面板

* 标题输入框（单行）

* Markdown 编辑器（md-editor-v3）

* 标题实时更新左侧列表

* 内容自动保存（防抖 500ms）

* 未选中笔记时显示提示

#### Scenario: 编辑标题

* **WHEN** 用户编辑标题

* **THEN** 左侧列表实时更新，500ms 后自动保存

#### Scenario: 编辑内容

* **WHEN** 用户编辑 Markdown 内容

* **THEN** 实时渲染预览，500ms 后自动保存

### Requirement: 图片处理功能

系统 SHALL 提供：

* 拖拽图片到编辑器

* 点击图片插入

* Sharp 图片处理（压缩、格式转换）

* 图片存储在 `data/assets/images/{noteId}/`

* 生成 Markdown 图片语法

* 图片预览

#### Scenario: 插入图片

* **WHEN** 用户拖拽图片到编辑器

* **THEN** 图片被处理并保存，Markdown 语法插入到光标位置

### Requirement: 数据持久化

系统 SHALL 提供：

* SQLite 存储笔记元数据（id, title, file\_path, updated\_at, created\_at）

* .md 文件存储笔记内容

* 本地目录存储图片

* 应用启动时加载已有数据

* 修改后自动保存

#### Scenario: 应用启动

* **WHEN** 应用启动

* **THEN** 加载数据库中的所有笔记，渲染列表

#### Scenario: 自动保存

* **WHEN** 内容或标题变化

* **THEN** 500ms 后保存到文件和数据库

## 数据结构

### SQLite notes 表

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
)
```

### 文件存储结构

```
data/
├── notes/                    # Markdown 文件目录
│   ├── {noteId}.md
├── assets/
│   └── images/               # 图片资源目录
│       └── {noteId}/
│           └── {timestamp}.jpg
└── metadata.db               # SQLite 数据库
```

### Pinia Store 状态

```typescript
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
```

