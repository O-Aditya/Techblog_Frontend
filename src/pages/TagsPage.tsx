import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, Tag } from "../services/apiService";
import { useAuth } from "../components/AuthContext";
import { Plus, X } from "lucide-react";
import { Button, Input } from "@nextui-org/react";

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      setTags(response);
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      await apiService.createTags([newTagName.trim()]);
      setNewTagName("");
      await fetchTags();
    } catch (err) {
      console.error("Failed to create tag:", err);
      alert("Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      await apiService.deleteTag(tagId);
      await fetchTags();
    } catch (err) {
      console.error("Failed to delete tag:", err);
      alert("Failed to delete tag");
    }
  };

  const handleTagClick = (tagId: string) => {
    navigate(`/?tag=${tagId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 opacity-80 font-mono">
        <a href="/" className="hover:text-accent transition-colors">~/home</a>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-accent">tags</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <span className="text-accent">#</span> Tags
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            // Categorize by topic
          </p>
        </header>

        {/* Admin Create Interface */}
        {isAuthenticated && (
          <form onSubmit={handleCreateTag} className="flex gap-2 w-full md:w-auto">
            <Input
              size="sm"
              placeholder="New tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="max-w-[200px]"
              classNames={{
                input: "font-mono",
                inputWrapper: "h-9 bg-background border border-border"
              }}
            />
            <Button
              type="submit"
              size="sm"
              isIconOnly
              color="primary"
              variant="flat"
              isLoading={isCreating}
              isDisabled={!newTagName.trim()}
              className="h-9 w-9 bg-accent text-background min-w-0"
            >
              <Plus size={18} />
            </Button>
          </form>
        )}
      </div>

      {/* Tags Grid */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground font-mono">
          <span className="animate-pulse">Loading tags...</span>
        </div>
      ) : tags.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground font-mono border border-dashed border-border rounded-lg">
          No tags found.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group relative inline-flex items-center"
            >
              <button
                onClick={() => handleTagClick(tag.id)}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono border transition-all
                  ${isAuthenticated ? 'pr-8' : ''}
                  border-border hover:border-accent hover:text-accent bg-background hover:bg-accent/5
                `}
              >
                <span className="opacity-50">#</span>
                {tag.name}
                {tag.postCount !== undefined && (
                  <span className="ml-1 text-xs opacity-70">({tag.postCount})</span>
                )}
              </button>

              {isAuthenticated && (
                <button
                  onClick={(e) => handleDeleteTag(tag.id, e)}
                  className="absolute right-1 p-1 rounded-sm text-muted-foreground hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete tag"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsPage;
