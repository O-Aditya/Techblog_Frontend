import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import {
  Bold,
  Italic,
  Undo,
  Redo,
  List,
  ListOrdered,
  ChevronDown,
  Terminal,
  Type,
  Save,
  ArrowLeft,
  FolderOpen,
  Hash,
  Globe,
  FileText,
  FileCode
} from 'lucide-react';
import { Post, Category, Tag, PostStatus } from '../services/apiService';

interface PostFormProps {
  initialPost?: Post | null;
  onSubmit: (postData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
    status: PostStatus;
  }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  availableTags: Tag[];
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  initialPost,
  onSubmit,
  onCancel,
  categories,
  availableTags,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialPost?.tags || []);
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status || PostStatus.DRAFT
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList.configure({ keepMarks: true, keepAttributes: false }),
      OrderedList.configure({ keepMarks: true, keepAttributes: false }),
      ListItem,
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class: 'app-prose max-w-none focus:outline-none min-h-[60vh] px-8 py-6 font-sans',
      },
    },
  });

  useEffect(() => {
    if (initialPost && editor) {
      setTitle(initialPost.title);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags || []);
      setStatus(initialPost.status || PostStatus.DRAFT);
    }
  }, [initialPost, editor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!editor?.getHTML() || editor?.getHTML() === '<p></p>') newErrors.content = 'Content is required';
    if (!categoryId) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit({
      title: title.trim(),
      content: editor?.getHTML() || '',
      categoryId: categoryId,
      tagIds: selectedTags.map(tag => tag.id),
      status,
    });
  };

  const handleTagToggle = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleHeadingSelect = (level: number) => {
    editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [markdownInput, setMarkdownInput] = useState('');

  const handleMarkdownImport = async () => {
    if (!markdownInput.trim()) return;
    try {
      const html = await marked.parse(markdownInput);
      editor?.commands.setContent(html);
      onOpenChange(); // Close modal
      setMarkdownInput('');
    } catch (e) {
      console.error("Markdown parsing error:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto animate-in fade-in duration-500">

      {/* Markdown Import Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Import Markdown</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground mb-2">
                  Paste your raw Markdown content here. It will be converted to rich text.
                  <br />
                  <span className="text-xs text-warning">Warning: This will replace current editor content.</span>
                </p>
                <Textarea
                  placeholder="# My Awesome Post\n\nWrite something..."
                  minRows={10}
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  className="font-mono text-sm"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleMarkdownImport} startContent={<FileCode size={16} />}>
                  Import Content
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border/40 pb-4 sticky top-0 bg-background/95 backdrop-blur-sm z-50 pt-4">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="ghost" onClick={onCancel} className="text-muted-foreground">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {initialPost ? 'Editing Mode' : 'Creation Mode'}
            </span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === PostStatus.PUBLISHED ? 'bg-success' : 'bg-warning'}`} />
              <span className="text-sm font-medium">{status === PostStatus.PUBLISHED ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            aria-label="Status"
            selectedKeys={[status]}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="w-32"
            size="sm"
            variant="bordered"
            classNames={{
              trigger: "border-border",
              value: "text-small"
            }}
            startContent={status === PostStatus.PUBLISHED ? <Globe size={14} /> : <FileText size={14} />}
          >
            <SelectItem key={PostStatus.DRAFT} value={PostStatus.DRAFT}>Draft</SelectItem>
            <SelectItem key={PostStatus.PUBLISHED} value={PostStatus.PUBLISHED}>Public</SelectItem>
          </Select>

          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            className="font-semibold bg-accent text-white shadow-lg shadow-accent/20"
            startContent={<Save size={18} />}
          >
            {initialPost ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="space-y-6 px-2">
        {/* Title Input */}
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            placeholder="Enter post title..."
            variant="flat"
            classNames={{
              input: "text-4xl md:text-5xl font-bold font-sans bg-transparent",
              inputWrapper: "bg-transparent shadow-none hover:bg-transparent px-0 border-b border-border/30 rounded-none h-auto py-2",
            }}
          />
        </div>

        {/* Meta Controls (Category & Tags) */}
        <div className="flex flex-wrap gap-4 items-center mb-8">
          {/* Category Select */}
          <div className="w-full sm:w-64">
            <Select
              aria-label="Category"
              placeholder="Select Category"
              selectedKeys={categoryId ? [categoryId] : []}
              onChange={(e) => setCategoryId(e.target.value)}
              isInvalid={!!errors.category}
              errorMessage={errors.category}
              startContent={<FolderOpen size={16} className="text-muted-foreground" />}
              variant="bordered"
              classNames={{
                trigger: "bg-background border-border",
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Tags Popover */}
          <Popover placement="bottom" showArrow offset={10}>
            <PopoverTrigger>
              <Button
                variant="bordered"
                className="border-border bg-background border-dashed text-muted-foreground hover:text-foreground"
                startContent={<Hash size={16} />}
              >
                {selectedTags.length > 0 ? `${selectedTags.length} Tags Selected` : 'Add Tags'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Select Tags</h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      variant={selectedTags.some(t => t.id === tag.id) ? "solid" : "bordered"}
                      color={selectedTags.some(t => t.id === tag.id) ? "primary" : "default"}
                      className="cursor-pointer transition-all"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag.name}
                    </Chip>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Chip key={tag.id} onClose={() => handleTagToggle(tag)} variant="flat" size="sm" className="bg-accent/10 text-accent">
                #{tag.name}
              </Chip>
            ))}
          </div>
        </div>

        {/* Editor Container */}
        <div className="min-h-[60vh] border border-border/50 rounded-xl overflow-hidden bg-background/50 shadow-sm">
          {/* Editor Toolbar */}
          <div className="bg-muted/30 border-b border-border/50 p-2 flex gap-1 flex-wrap items-center sticky top-0 z-10 backdrop-blur-md">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" size="sm" isIconOnly className="w-auto px-2 min-w-0">
                  <Type size={18} /> <ChevronDown size={14} className="ml-1 opacity-50" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => handleHeadingSelect(Number(key))}>
                <DropdownItem key="1" className={editor?.isActive('heading', { level: 1 }) ? 'bg-default-200' : ''}>Heading 1</DropdownItem>
                <DropdownItem key="2" className={editor?.isActive('heading', { level: 2 }) ? 'bg-default-200' : ''}>Heading 2</DropdownItem>
                <DropdownItem key="3" className={editor?.isActive('heading', { level: 3 }) ? 'bg-default-200' : ''}>Heading 3</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div className="w-px h-5 bg-border mx-1" />

            <Tooltip content="Bold">
              <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-default-200' : ''}>
                <Bold size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Italic">
              <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-default-200' : ''}>
                <Italic size={18} />
              </Button>
            </Tooltip>

            <div className="w-px h-5 bg-border mx-1" />

            <Tooltip content="Bullet List">
              <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-default-200' : ''}>
                <List size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Ordered List">
              <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'bg-default-200' : ''}>
                <ListOrdered size={18} />
              </Button>
            </Tooltip>

            <div className="w-px h-5 bg-border mx-1" />

            <Tooltip content="Code Block">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`font-mono text-xs ${editor?.isActive('codeBlock') ? 'bg-accent text-white' : ''}`}
              >
                <Terminal size={18} />
              </Button>
            </Tooltip>

            <div className="w-px h-5 bg-border mx-1" />

            <Tooltip content="Import Markdown">
              <Button size="sm" isIconOnly variant="light" onClick={onOpen} className="text-accent">
                <FileCode size={18} />
              </Button>
            </Tooltip>

            <div className="ml-auto flex items-center gap-1">
              <Tooltip content="Undo">
                <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().undo().run()} isDisabled={!editor?.can().undo()}><Undo size={16} /></Button>
              </Tooltip>
              <Tooltip content="Redo">
                <Button size="sm" isIconOnly variant="light" onClick={() => editor?.chain().focus().redo().run()} isDisabled={!editor?.can().redo()}><Redo size={16} /></Button>
              </Tooltip>
            </div>
          </div>

          <EditorContent editor={editor} />
        </div>

        {errors.content && <div className="text-danger text-sm font-mono">{errors.content}</div>}
      </div>
    </form>
  );
};

export default PostForm;