import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, Category } from "../services/apiService";
import { useAuth } from "../components/AuthContext";
import { Plus, X, Folder, FolderOpen } from "lucide-react";
import { Button, Input } from "@nextui-org/react";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreating(true);
      await apiService.createCategory(newCategoryName.trim());
      setNewCategoryName("");
      await fetchCategories();
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await apiService.deleteCategory(categoryId);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/?category=${categoryId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 opacity-80 font-mono">
        <a href="/" className="hover:text-accent transition-colors">~/home</a>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-accent">categories</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <FolderOpen className="text-accent" /> Categories
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            // Organize your content
          </p>
        </header>

        {/* Admin Create Interface */}
        {isAuthenticated && (
          <form onSubmit={handleCreateCategory} className="flex gap-2 w-full md:w-auto">
            <Input
              size="sm"
              placeholder="New category..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
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
              isDisabled={!newCategoryName.trim()}
              className="h-9 w-9 bg-accent text-background min-w-0"
            >
              <Plus size={18} />
            </Button>
          </form>
        )}
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground font-mono">
          <span className="animate-pulse">Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground font-mono border border-dashed border-border rounded-lg">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative"
            >
              {/* Category Button */}
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  w-full text-left flex items-center justify-between gap-3 p-4 pr-12 rounded-lg border transition-all
                  bg-background border-border hover:border-accent hover:shadow-sm
                `}        >
                <div className="flex items-center gap-3">
                  <Folder className="text-accent w-5 h-5" />
                  <span className="font-mono text-lg">{category.name}</span>
                </div>

                {category.postCount !== undefined && (
                  <span className="text-sm text-muted-foreground bg-muted/10 px-2 py-0.5 rounded">
                    {category.postCount} posts
                  </span>
                )}
              </button>

              {/* Delete Button */}
              {isAuthenticated && (
                <button
                  onClick={(e) => handleDeleteCategory(category.id, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                  title="Delete category"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
