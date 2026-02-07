import React from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Clock, Tag, User, FolderOpen

} from 'lucide-react';
import { Post } from '../services/apiService';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Extract plain text excerpt from HTML content
    const getExcerpt = (content: string, maxLength: number = 150) => {
        const text = content.replace(/<[^>]+>/g, '');
        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    };

    return (
        <article className="border-b border-border pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0 group">
            <Link to={`/posts/${post.id}`} className="no-underline">
                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                </h2>
            </Link>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4" />
                    {post.category?.name}
                </span>
                {post.readingTime && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} min read
                    </span>
                )}
                {post.author && (
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {post.author.name}
                    </span>
                )}
            </div>

            {/* Excerpt */}
            <p className="text-foreground leading-relaxed mb-4 opacity-80">
                {getExcerpt(post.content)}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
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
        </article>
    );
};

export default PostCard;
