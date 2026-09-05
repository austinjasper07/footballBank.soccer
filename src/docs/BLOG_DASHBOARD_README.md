# Blog Dashboard with Advanced Text Editor

A comprehensive blog management system with an advanced rich text editor built for the FootballBank application.

## Features

### 🎨 Advanced Text Editor
- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1, H2, H3 support
- **Lists**: Bullet and numbered lists
- **Text Alignment**: Left, center, right, justify
- **Colors**: Text color and highlight color picker
- **Links**: Easy link insertion with URL validation
- **Images**: Direct image insertion with media library
- **Tables**: Insert and format tables
- **Code Blocks**: Syntax-highlighted code blocks
- **Undo/Redo**: Full history support
- **Preview Mode**: Live preview of formatted content

### 📝 Blog Management Dashboard
- **Enhanced UI**: Modern grid and list views
- **Advanced Filtering**: Search, status, and sorting options
- **Statistics**: Total posts, published, drafts, and views
- **Quick Actions**: Edit, delete, and publish posts
- **Media Management**: Upload and organize images and files
- **Auto-save**: Automatic draft saving every 30 seconds
- **SEO Preview**: Live preview of how posts will appear in search results

### 🖼️ Media Management
- **File Upload**: Drag and drop or click to upload
- **Image Gallery**: Grid and list views
- **File Organization**: Categorize by type (images, documents)
- **Search**: Find files quickly
- **Preview**: Thumbnail previews for images
- **Delete**: Remove unwanted files

### 💾 Auto-save System
- **Automatic Saving**: Saves drafts every 30 seconds
- **Change Detection**: Only saves when content changes
- **Visual Indicators**: Shows save status and unsaved changes
- **Manual Save**: Force save option
- **Error Handling**: Graceful error recovery

## Components

### AdvancedTextEditor
Location: `src/components/admin/AdvancedTextEditor.jsx`

A feature-rich text editor built with Tiptap.js featuring:
- Comprehensive toolbar with formatting options
- Color pickers for text and highlights
- Media library integration
- Preview mode toggle
- Auto-save integration

### BlogView (Enhanced)
Location: `src/components/admin/views/BlogView.jsx`

Enhanced blog management dashboard with:
- Grid and list view modes
- Advanced filtering and search
- Statistics cards
- Quick post creation
- Advanced editor integration

### Blog Editor Page
Location: `src/app/[lang]/admin/blog-editor/page.jsx`

Full-screen blog editor with:
- Side-by-side editing and settings
- Real-time preview
- Auto-save functionality
- SEO preview
- Media management

### MediaManager
Location: `src/components/admin/MediaManager.jsx`

Media library component featuring:
- File upload with progress
- Grid and list views
- Search and filtering
- File type categorization
- Preview and selection

### Auto-save Hook
Location: `src/hooks/useAutoSave.js`

Custom React hook for automatic saving:
- Configurable intervals
- Change detection
- Error handling
- Manual save triggers
- Page unload protection

## Installation

The required dependencies have been installed:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-highlight @tiptap/extension-code-block-lowlight @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-placeholder lowlight --legacy-peer-deps
```

## Usage

### Accessing the Blog Dashboard
1. Navigate to `/admin` (requires admin role)
2. Click on "Blog" in the sidebar
3. Use "Advanced Editor" for full-screen editing

### Creating a New Post
1. Click "Advanced Editor" button
2. Enter title and content
3. Configure settings in the sidebar
4. Use the rich text editor for formatting
5. Save as draft or publish

### Using the Media Library
1. Click the image icon in the editor toolbar
2. Upload new files or select from existing
3. Files are automatically inserted into the editor

### Auto-save Features
- Drafts are automatically saved every 30 seconds
- Visual indicators show save status
- Unsaved changes are highlighted
- Page unload protection prevents data loss

## File Structure

```
src/
├── components/admin/
│   ├── AdvancedTextEditor.jsx      # Rich text editor component
│   ├── MediaManager.jsx           # Media library component
│   └── views/
│       └── BlogView.jsx           # Enhanced blog dashboard
├── app/[lang]/admin/
│   └── blog-editor/
│       └── page.jsx               # Full-screen editor page
└── hooks/
    └── useAutoSave.js             # Auto-save functionality
```

## Configuration

### Auto-save Settings
The auto-save system can be configured in the `useAutoSave` hook:

```javascript
const { manualSave, hasUnsavedChanges, isSaving } = useAutoSave(
  postData,
  autoSaveFunction,
  {
    interval: 30000, // 30 seconds
    enabled: postData.title && postData.content,
    onSave: () => { /* success callback */ },
    onError: (error) => { /* error callback */ }
  }
);
```

### Editor Configuration
The text editor can be customized by modifying the extensions in `AdvancedTextEditor.jsx`:

```javascript
const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    TextAlign,
    // ... other extensions
  ],
  // ... other options
});
```

## Features in Detail

### Rich Text Formatting
- **Bold, Italic, Underline**: Standard text formatting
- **Headings**: H1, H2, H3 for content structure
- **Lists**: Bullet and numbered lists
- **Text Alignment**: Four alignment options
- **Colors**: Text and highlight color pickers
- **Links**: Easy link insertion with validation
- **Images**: Direct insertion from media library
- **Tables**: Full table support with headers
- **Code**: Inline code and code blocks

### Media Management
- **Upload**: Drag and drop or click to upload
- **Organization**: Files categorized by type
- **Search**: Quick file finding
- **Preview**: Image thumbnails
- **Management**: Delete unwanted files

### Auto-save System
- **Intelligent Saving**: Only saves when content changes
- **Visual Feedback**: Clear save status indicators
- **Error Recovery**: Graceful handling of save failures
- **Page Protection**: Warns before leaving with unsaved changes

## Security

- Admin role required for access
- File upload validation
- XSS protection in rich text content
- Secure file handling

## Performance

- Lazy loading of editor components
- Efficient change detection
- Optimized re-renders
- Debounced auto-save

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Touch-friendly interface

## Future Enhancements

- Collaborative editing
- Version history
- Advanced media processing
- Plugin system
- Export options (PDF, Word)
- Advanced SEO tools
- Analytics integration

## Troubleshooting

### Common Issues

1. **Editor not loading**: Check if all Tiptap dependencies are installed
2. **Auto-save not working**: Verify the save function is properly configured
3. **Media upload failing**: Check file size limits and permissions
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Support

For issues or questions regarding the blog dashboard system, please check:
1. Console for error messages
2. Network tab for failed requests
3. Browser compatibility
4. File permissions for uploads
