import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Share,
  User as UserIcon
} from 'lucide-react';
import { apiService, Post } from '../services/apiService';

interface PostPageProps {
  isAuthenticated?: boolean;
}

const PostPage: React.FC<PostPageProps> = ({ isAuthenticated }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Post ID is required');
        const fetchedPost = await apiService.getPost(id);
        console.log('Fetched Post:', fetchedPost);
        console.log('Tags:', fetchedPost.tags);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const createSanitizedHTML = (content: string) => {
    return {
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'code', 'pre', 'blockquote'],
        ALLOWED_ATTR: ['href', 'target']
      })
    };
  };

  if (loading) {
    return (
      <div className="app-layout py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-muted">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="app-layout py-16">
        <div className="border border-border p-12 rounded text-center">
          <p className="text-red-500 mb-6">{error || 'Post not found'}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background rounded hover:opacity-90 no-underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent mb-8 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back
      </Link>

      {/* Article */}
      <article className="max-w-app mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4" />
              {post.author.name}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/?tagId=${tag.id}`}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-foreground border border-border rounded hover:border-accent hover:text-accent no-underline transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="app-prose"
          dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
        />

        {/* Actions (Auth users) */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border">
            <Link
              to={`/posts/${post.id}/edit`}
              className="px-3 py-1.5 text-sm border border-border rounded hover:border-accent hover:text-accent no-underline transition-colors"
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm border border-border rounded hover:border-red-500 hover:text-red-500 transition-colors"
            >
              <Trash className="w-4 h-4 inline mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 text-sm border border-border rounded hover:border-accent hover:text-accent transition-colors ml-auto"
            >
              <Share className="w-4 h-4 inline mr-2" />
              Share
            </button>
          </div>
        )}

        {/* Share button for non-auth users */}
        {!isAuthenticated && (
          <div className="mt-12 pt-8 border-t border-border">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-accent text-background rounded hover:opacity-90"
            >
              <Share className="w-4 h-4 inline mr-2" />
              Share this post
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostPage;