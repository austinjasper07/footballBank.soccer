"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function BasicTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing your blog post...',
  className = '',
  showPreview = true,
  onSave,
  isSaving = false
}) {
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [text, setText] = useState(content);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };

  const formatText = (format) => {
    const textarea = document.getElementById('blog-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
      default:
        formattedText = selectedText;
    }
    
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    onChange(newText);
  };

  const renderPreview = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('strikethrough')}
            className="h-8 w-8 p-0"
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('code')}
            className="h-8 w-8 p-0"
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('h1')}
            className="h-8 w-8 p-0"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('h2')}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('h3')}
            className="h-8 w-8 p-0"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('link')}
            className="h-8 w-8 p-0"
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {showPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewMode(!showPreviewMode)}
              className="h-8 w-8 p-0"
              title={showPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {showPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          
          {onSave && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="ml-2"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {showPreviewMode ? (
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4 min-h-[400px]"
            dangerouslySetInnerHTML={{ __html: renderPreview(text) }}
          />
        ) : (
          <Textarea
            id="blog-editor"
            value={text}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="min-h-[400px] border-0 focus:ring-0 resize-none"
          />
        )}
      </div>
    </div>
  );
}
