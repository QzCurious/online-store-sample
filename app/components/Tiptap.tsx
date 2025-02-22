import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { cn } from '~/lib/utils'
import { Button } from './ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  ImageIcon,
} from 'lucide-react'
import { useRef } from 'react'
import React from 'react'

interface TiptapProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return (
      <div className="border-b p-2 flex gap-1 flex-wrap" role="toolbar" aria-label="Text editor toolbar">
        {/* Render disabled buttons when editor is not ready */}
        {['Bold', 'Italic', 'Strike', 'BulletList', 'OrderedList', 'Blockquote', 'Undo', 'Redo', 'Image'].map((tool) => (
          <Button
            key={tool}
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="opacity-50"
          >
            <span className="h-4 w-4" />
          </Button>
        ))}
      </div>
    )
  }

  // Ensure editor commands are available
  const handleCommand = (command: () => boolean) => {
    if (editor && editor.isEditable) {
      command()
    }
  }

  const addImage = async (file: File) => {
    if (!editor || !editor.isEditable) return;
    
    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      console.error('File size exceeds 5MB limit');
      return;
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      const { url } = await response.json()
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Failed to upload image:', error)
      // You might want to show a toast notification here
    }
  }

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      addImage(file)
    }
  }

  return (
    <div className="border-b p-2 flex gap-1 flex-wrap" role="toolbar" aria-label="Text editor toolbar">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleBold().run())}
        data-active={editor.isActive('bold')}
        className={cn(editor.isActive('bold') && 'bg-secondary')}
        aria-label="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleItalic().run())}
        data-active={editor.isActive('italic')}
        className={cn(editor.isActive('italic') && 'bg-secondary')}
        aria-label="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleStrike().run())}
        data-active={editor.isActive('strike')}
        className={cn(editor.isActive('strike') && 'bg-secondary')}
        aria-label="Strikethrough"
        aria-pressed={editor.isActive('strike')}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleBulletList().run())}
        data-active={editor.isActive('bulletList')}
        className={cn(editor.isActive('bulletList') && 'bg-secondary')}
        aria-label="Bullet list"
        aria-pressed={editor.isActive('bulletList')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleOrderedList().run())}
        data-active={editor.isActive('orderedList')}
        className={cn(editor.isActive('orderedList') && 'bg-secondary')}
        aria-label="Numbered list"
        aria-pressed={editor.isActive('orderedList')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().toggleBlockquote().run())}
        data-active={editor.isActive('blockquote')}
        className={cn(editor.isActive('blockquote') && 'bg-secondary')}
        aria-label="Block quote"
        aria-pressed={editor.isActive('blockquote')}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().undo().run())}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleCommand(() => editor.chain().focus().redo().run())}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleImageClick}
        aria-label="Insert image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}

export default function Tiptap({
  content,
  onChange,
  className,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure with empty objects to enable features
        history: {},
        dropcursor: {},
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Only call onChange when editor is ready
      if (editor && editor.isEditable) {
        onChange(editor.getHTML())
      }
    },
    autofocus: true,
    editable: true,
    injectCSS: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4',
      },
    },
  })

  // Cleanup editor on unmount
  React.useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  return (
    <div className={cn('border rounded-md', className)}>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
      />
    </div>
  )
} 