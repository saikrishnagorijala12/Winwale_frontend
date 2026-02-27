import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
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
        ${active
            ? 'bg-blue-100 text-blue-600 shadow-inner'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
    `;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 sticky top-0 z-10">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
                <Bold size={18} />
            </button>

            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
                <Italic size={18} />
            </button>

            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>
                <UnderlineIcon size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>
                <Heading1 size={18} />
            </button>

            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
                <List size={18} />
            </button>

            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                <RotateCcw size={18} />
            </button>

            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30">
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
            Link.configure({ openOnClick: false }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
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

    // Sync editable mode
    React.useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    // Force inline styles on images for consistent sizing
    React.useEffect(() => {
        if (!editor) return;

        const applyImportantStyles = () => {
            const images = document.querySelectorAll<HTMLImageElement>('.tiptap-editor .absolute img, .tiptap-editor .editor-image');

            images.forEach((img) => {
                img.style.setProperty('height', '100px', 'important');
                img.style.setProperty('width', 'auto', 'important');
                img.style.setProperty('max-width', '200px', 'important');
                img.style.setProperty('object-fit', 'contain', 'important');
            });
        };

        applyImportantStyles();

        editor.on('update', applyImportantStyles);

        return () => {
            editor.off('update', applyImportantStyles);
        };
    }, [editor]);

    return (
        <div className="w-full overflow-hidden transition-shadow duration-300">

            <style>{`
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

                .tiptap-editor {
                    position: relative !important;
                }

                .tiptap-editor img {
                    display: block;
                    height: 100px !important;
                    width: auto !important;
                    max-width: 200px !important;
                    object-fit: contain !important;
                    margin-left: auto !important;
                    margin-bottom: 1em !important;
                }

                .tiptap-editor .absolute {
                    position: absolute !important;
                    z-index: 5;
                }

                .tiptap-editor .top-8 { top: 2rem !important; }
                .tiptap-editor .right-10 { right: 2.5rem !important; }
            `}</style>

            {editable && <MenuBar editor={editor} />}

            <div className="p-4 bg-white min-h-200 flex justify-center overflow-y-auto">
                <div className="bg-white border border-slate-200 shadow-md w-full max-w-212.5 min-h-275 ring-1 ring-slate-900/5">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};