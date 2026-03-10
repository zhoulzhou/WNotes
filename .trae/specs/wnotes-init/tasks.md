# 开发任务清单

- [x] **Task 1: 项目初始化和基础架构搭建**
  - [x] 1.1 创建 Electron + Vue3 + TypeScript 项目结构
  - [x] 1.2 配置 Vite 构建工具
  - [x] 1.3 配置 Electron-builder 打包
  - [x] 1.4 安装核心依赖（electron, vue, pinia, md-editor-v3, better-sqlite3, sharp, ant-design-vue, dayjs）
  - [x] 1.5 创建基础目录结构（src/main, src/renderer, src/shared, data）

- [x] **Task 2: Electron 主进程和 IPC 通信**
  - [x] 2.1 创建 main.ts 主进程入口
  - [x] 2.2 创建 preload.ts 预加载脚本
  - [x] 2.3 定义 IPC 通信通道（create-note, delete-note, update-note, get-all-notes, read-file, write-file, save-image）

- [x] **Task 3: SQLite 数据库模块**
  - [x] 3.1 创建 database.ts 数据库操作模块
  - [x] 3.2 实现初始化数据库和创建 notes 表
  - [x] 3.3 实现 getAllNotes 查询
  - [x] 3.4 实现 createNote 创建
  - [x] 3.5 实现 updateNoteTitle 更新
  - [x] 3.6 实现 deleteNote 删除

- [x] **Task 4: 文件系统模块**
  - [x] 4.1 创建 file.ts 文件操作工具
  - [x] 4.2 实现 readNoteFile 读取笔记文件
  - [x] 4.3 实现 writeNoteFile 写入笔记文件
  - [x] 4.4 实现 createNoteFile 创建笔记文件
  - [x] 4.5 实现 deleteNoteFile 删除笔记文件
  - [x] 4.6 实现目录初始化（创建 notes 和 assets/images 目录）

- [x] **Task 5: 图片处理模块**
  - [x] 5.1 创建 image.ts 图片处理工具
  - [x] 5.2 实现 saveImage 保存图片（使用 Sharp 压缩优化）
  - [x] 5.3 实现图片路径生成逻辑

- [x] **Task 6: Pinia 状态管理**
  - [x] 6.1 创建 store/index.ts
  - [x] 6.2 定义 Note 接口和 AppState
  - [x] 6.3 实现 setNotes action
  - [x] 6.4 实现 selectNote action
  - [x] 6.5 实现 updateNoteTitle action
  - [x] 6.6 实现 addNote action
  - [x] 6.7 实现 removeNote action

- [x] **Task 7: 左侧笔记列表组件**
  - [x] 7.1 创建 NoteList.vue 组件
  - [x] 7.2 实现新建笔记按钮
  - [x] 7.3 实现笔记列表渲染（按更新时间倒序）
  - [x] 7.4 创建 NoteItem.vue 列表项组件
  - [x] 7.5 实现删除笔记按钮和确认对话框
  - [x] 7.6 实现点击选中笔记
  - [x] 7.7 集成 dayjs 时间格式化（相对时间）

- [x] **Task 8: 右侧笔记编辑器组件**
  - [x] 8.1 创建 NoteEditor.vue 组件
  - [x] 8.2 实现标题输入框
  - [x] 8.3 集成 md-editor-v3 Markdown 编辑器
  - [x] 8.4 实现标题变化实时更新左侧列表
  - [x] 8.5 实现内容变化自动保存（防抖 500ms）
  - [x] 8.6 实现未选中笔记时的提示界面

- [x] **Task 9: 图片上传功能**
  - [x] 9.1 实现编辑器图片拖拽上传
  - [x] 9.2 实现点击图片插入功能
  - [x] 9.3 集成 Sharp 图片处理
  - [x] 9.4 实现 Markdown 图片语法插入
  - [x] 9.5 实现图片预览

- [x] **Task 10: 应用启动和数据加载**
  - [x] 10.1 实现应用启动时初始化数据库
  - [x] 10.2 实现加载所有笔记数据
  - [x] 10.3 实现读取选中笔记的内容

- [x] **Task 11: 样式美化和用户体验优化**
  - [x] 11.1 实现左右分栏布局样式
  - [x] 11.2 优化列表项样式（标题、时间、删除按钮）
  - [x] 11.3 优化编辑器样式
  - [x] 11.4 添加过渡动画和交互反馈

- [x] **Task 12: 错误处理和边界情况**
  - [x] 12.1 添加文件操作错误处理
  - [x] 12.2 添加数据库操作错误处理
  - [x] 12.3 处理图片上传失败情况
  - [x] 12.4 处理笔记文件不存在的情况

- [x] **Task 13: 测试和验证**
  - [x] 13.1 测试创建笔记功能
  - [x] 13.2 测试删除笔记功能
  - [x] 13.3 测试标题编辑和同步
  - [x] 13.4 测试 Markdown 编辑和预览
  - [x] 13.5 测试图片上传和显示
  - [x] 13.6 测试自动保存功能
  - [x] 13.7 测试应用重启后数据持久化

- [x] **Task 14: 打包和发布准备**
  - [x] 14.1 配置 electron-builder
  - [x] 14.2 测试打包流程
  - [x] 14.3 验证打包后的应用功能

# 任务依赖关系
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 2
- Task 5 依赖 Task 2
- Task 6 依赖 Task 1
- Task 7 依赖 Task 6
- Task 8 依赖 Task 6, Task 7
- Task 9 依赖 Task 5, Task 8
- Task 10 依赖 Task 3, Task 4
- Task 11 依赖 Task 7, Task 8
- Task 12 依赖 Task 3, Task 4, Task 5
- Task 13 依赖 Task 7, Task 8, Task 9, Task 10
- Task 14 依赖 Task 13
