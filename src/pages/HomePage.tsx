import React, { useEffect, useState } from 'react';
import { apiService, Post, Category, Tag, Page } from '../services/apiService';
import PostCard from '../components/PostCard';
import PaginationControls from '../components/PaginationControls';
import { Tag as TagIcon, Folder, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const [postsPage, setPostsPage] = useState<Page<Post> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 6;

  useEffect(() => {
    // Reset to page 0 when filters change
    setCurrentPage(0);
  }, [selectedCategory, selectedTag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getPosts({
            categoryId: selectedCategory,
            tagId: selectedTag,
            page: currentPage,
            size: PAGE_SIZE
          }),
          apiService.getCategories(),
          apiService.getTags()
        ]);

        setPostsPage(postsResponse);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
        setError(null);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, currentPage]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? undefined : categoryId);
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTag(prev => prev === tagId ? undefined : tagId);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !postsPage) {
    return (
      <div className="app-layout py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-muted">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout py-16">
        <div className="border border-border p-8 rounded text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout py-8">
      {/* Hero Section */}
      <section className="mb-12 border-b border-border/40 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-mono">
          <span className="text-accent mr-2">&gt;</span>Hello, World! <span className="animate-pulse">_</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl font-mono">
          // Exploring code, systems, and the web.
        </p>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* Main Content Area */}
        <div>
          {/* Active Filters */}
          {(selectedCategory || selectedTag) && (
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 border border-border rounded">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted">Filtering by:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-background border border-border rounded">
                    <Folder className="w-3 h-3" />
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-background border border-border rounded">
                    <TagIcon className="w-3 h-3" />
                    {tags.find(t => t.id === selectedTag)?.name}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent hover:underline ml-auto flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Posts Section */}
          {postsPage && postsPage.content.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {selectedCategory || selectedTag ? 'Filtered Posts' : 'All Posts'}
                </h2>
                <span className="text-xs text-muted font-mono bg-muted/20 px-2 py-1 rounded">
                  {postsPage.totalElements} posts found
                </span>
              </div>

              <div className="space-y-6">
                {postsPage.content.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={postsPage.totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </div>
          ) : (
            <div className="border border-border p-12 rounded text-center">
              <p className="text-muted text-lg mb-4">No posts found.</p>
              {(selectedCategory || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-accent text-background rounded hover:opacity-90"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 sticky top-24 self-start">
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedCategory === category.id
                      ? 'bg-accent text-background'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground'
                      }`}
                  >
                    <span>{category.name}</span>
                    {category.postCount !== undefined && (
                      <span className="float-right text-muted">
                        {category.postCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs border rounded transition-colors ${selectedTag === tag.id
                      ? 'bg-accent text-background border-accent'
                      : 'border-border text-foreground hover:border-accent hover:text-accent'
                      }`}
                  >
                    {tag.name}
                    {tag.postCount !== undefined && ` (${tag.postCount})`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default HomePage;