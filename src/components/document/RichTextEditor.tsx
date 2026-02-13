import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    RotateCcw,
    RotateCw,
    Heading1,
    Heading2
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (json: any, html: string) => void;
    editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const btnClass = (active: boolean) => `
    p-2 rounded-lg transition-all
    ${active ? 'bg-blue-100 text-blue-600 shadow-inner' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
  `;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 sticky top-0 z-10 transition-shadow duration-300">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={btnClass(editor.isActive('underline'))}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btnClass(editor.isActive('heading', { level: 1 }))}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btnClass(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                title="Undo"
            >
                <RotateCcw size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                title="Redo"
            >
                <RotateCw size={18} />
            </button>
        </div>
    );
};

export const RichTextEditor = ({ content, onChange, editable = true }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON(), editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[700px] p-16 text-slate-800 leading-normal tiptap-editor',
                style: "font-family: 'Times New Roman', serif; font-size: 11pt;",
            },
        },
    });

    React.useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    return (
        <div className="w-full overflow-hidden transition-shadow duration-300">
            <style>
                {`
                .tiptap-editor p {
                    margin-top: 0 !important;
                    margin-bottom: 1.25em !important;
                    line-height: 1.6 !important;
                }
                .tiptap-editor ul {
                    list-style-type: disc !important;
                    margin-bottom: 1.25em !important;
                    padding-left: 1.5em !important;
                }
                .tiptap-editor ol {
                    list-style-type: lower-alpha !important;
                    margin-bottom: 1.25em !important;
                    padding-left: 1.5em !important;
                }
                .tiptap-editor li p {
                    margin-bottom: 0.5em !important;
                }
                .tiptap-editor h1 { margin-bottom: 0.5em !important; }
                .tiptap-editor h2 { margin-bottom: 0.5em !important; }
                `}
            </style>
            {editable && <MenuBar editor={editor} />}
            <div className="p-4 bg-white min-h-200 flex justify-center overflow-y-auto">
                <div className="bg-white border  border-slate-200 shadow-md w-full max-w-212.5 min-h-275 animate-fade-in ring-1 ring-slate-900/5">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};
