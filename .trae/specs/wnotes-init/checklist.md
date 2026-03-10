# 验收检查清单

## 项目基础架构
- [ ] 项目结构符合 spec 定义的目录结构
- [ ] package.json 包含所有必需的依赖
- [ ] TypeScript 配置正确
- [ ] Vite 配置支持 Electron
- [ ] electron-builder 配置完成

## Electron 主进程
- [ ] main.ts 正确创建窗口和加载页面
- [ ] preload.ts 暴露必要的 IPC 接口
- [ ] IPC 通道定义完整（create-note, delete-note, update-note, get-all-notes, read-file, write-file, save-image）
- [ ] 主进程和渲染进程通信正常

## SQLite 数据库
- [ ] 数据库文件在 data/metadata.db 创建
- [ ] notes 表结构正确（id, title, file_path, updated_at, created_at）
- [ ] getAllNotes 返回按 updated_at 倒序的结果
- [ ] createNote 正确插入记录
- [ ] updateNoteTitle 正确更新标题和时间戳
- [ ] deleteNote 正确删除记录

## 文件系统
- [ ] data/notes 目录自动创建
- [ ] data/assets/images 目录自动创建
- [ ] readNoteFile 正确读取 Markdown 文件
- [ ] writeNoteFile 正确写入内容
- [ ] createNoteFile 创建包含标题的 Markdown 文件
- [ ] deleteNoteFile 正确删除文件

## 图片处理
- [ ] saveImage 使用 Sharp 压缩图片
- [ ] 图片保存到正确的目录（data/assets/images/{noteId}/）
- [ ] 返回正确的相对路径用于 Markdown 语法

## 状态管理（Pinia）
- [ ] notes 状态正确存储笔记列表
- [ ] selectedNoteId 状态正确跟踪选中笔记
- [ ] setNotes action 正确设置笔记列表
- [ ] selectNote action 正确选中笔记
- [ ] updateNoteTitle action 正确更新标题和时间
- [ ] addNote action 正确添加新笔记
- [ ] removeNote action 正确移除笔记

## 笔记列表组件（NoteList）
- [ ] 左侧面板布局正确
- [ ] 新建笔记按钮在顶部
- [ ] 笔记列表按更新时间倒序显示
- [ ] 每个笔记项显示标题和相对时间（如"3 小时前"）
- [ ] 每个笔记项有删除按钮
- [ ] 点击笔记项正确选中
- [ ] 点击新建按钮创建空笔记并自动选中
- [ ] 删除笔记弹出确认对话框
- [ ] 确认后删除笔记并更新 UI

## 笔记编辑器组件（NoteEditor）
- [ ] 右侧面板布局正确
- [ ] 标题输入框为单行
- [ ] md-editor-v3 编辑器正常渲染
- [ ] 编辑标题时左侧列表实时更新
- [ ] 编辑内容后 500ms 自动保存
- [ ] 未选中笔记时显示"请选择或创建笔记"提示
- [ ] Markdown 语法支持正常
- [ ] Markdown 预览正常

## 图片上传功能
- [ ] 支持拖拽图片到编辑器
- [ ] 支持点击图片按钮插入
- [ ] 图片被 Sharp 处理（压缩、转为 JPG）
- [ ] 图片保存到正确的目录
- [ ] Markdown 图片语法正确插入到光标位置
- [ ] 编辑器中图片预览正常显示

## 数据持久化
- [ ] 应用启动时正确加载所有笔记
- [ ] 创建笔记后数据保存到文件和数据库
- [ ] 更新标题后数据库同步更新
- [ ] 更新内容后文件同步更新
- [ ] 删除笔记后文件和数据库记录都删除
- [ ] 重启应用后数据不丢失

## 样式和用户体验
- [ ] 左右分栏布局美观
- [ ] 列表项样式清晰（标题突出，时间次要）
- [ ] 删除按钮位置合理（hover 显示或始终显示）
- [ ] 编辑器样式简洁
- [ ] 交互有适当的过渡动画
- [ ] 错误提示友好

## 错误处理
- [ ] 文件操作失败时有错误处理
- [ ] 数据库操作失败时有错误处理
- [ ] 图片上传失败时有提示
- [ ] 笔记文件不存在时有处理逻辑

## 核心功能验收（对应需求文档）
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

## 性能验收
- [ ] 列表项点击响应无延迟
- [ ] 标题输入无明显卡顿
- [ ] 保存操作不影响用户体验
- [ ] Markdown 渲染流畅

## 打包发布
- [ ] electron-builder 配置正确
- [ ] 打包命令可以执行
- [ ] 打包后的应用可以正常运行
- [ ] 所有功能在打包版本中正常
