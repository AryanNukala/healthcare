import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Edit, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
        role: string;
    };
    tags?: string[];
    upvotes: string[];
    downvotes: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt?: string;
    isEdited?: boolean;
}

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        role: string;
    };
    parentComment?: string;
    upvotes: string[];
    downvotes: string[];
    createdAt: string;
}

const GroupDiscussionPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
    const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId?: string } | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingPost, setEditingPost] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [groupId, sortBy]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/posts?sort=${sortBy}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });

            if (!response.ok) throw new Error('Failed to create post');

            toast.success('Post created successfully');
            setShowPostModal(false);
            setNewPost({ title: '', content: '', tags: [] });
            fetchPosts();
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    const handleEditPost = async (postId: string, updatedContent: { title?: string; content: string }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedContent)
            });

            if (!response.ok) throw new Error('Failed to update post');

            toast.success('Post updated successfully');
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            toast.error('Failed to update post');
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete post');

            toast.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleReply = async () => {
        if (!replyingTo || !replyContent.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/groups/${groupId}/posts/${replyingTo.postId}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: replyContent,
                        parentCommentId: replyingTo.commentId
                    })
                }
            );

            if (!response.ok) throw new Error('Failed to add comment');

            toast.success('Reply added successfully');
            setReplyingTo(null);
            setReplyContent('');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to add reply');
        }
    };

    const handleVote = async (postId: string, voteType: 'up' | 'down') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/groups/${groupId}/posts/${postId}/vote`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ voteType })
                }
            );

            if (!response.ok) throw new Error('Failed to vote');

            fetchPosts();
        } catch (error) {
            toast.error('Failed to record vote');
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!newPost.tags.includes(tagInput.trim())) {
                setNewPost({
                    ...newPost,
                    tags: [...newPost.tags, tagInput.trim()]
                });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setNewPost({
            ...newPost,
            tags: newPost.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const canEditPost = (post: Post) => {
        return post.author._id === user?.id || user?.role === 'admin';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Group Discussion</h1>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                    </select>
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Ask Question
                    </button>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                {editingPost === post._id ? (
                                    <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) => {
                                            const updatedPosts = posts.map(p =>
                                                p._id === post._id ? { ...p, title: e.target.value } : p
                                            );
                                            setPosts(updatedPosts);
                                        }}
                                        className="text-xl font-medium text-gray-900 w-full border-b border-gray-300 focus:border-indigo-500 focus:ring-0"
                                    />
                                ) : (
                                    <h2 className="text-xl font-medium text-gray-900">{post.title}</h2>
                                )}
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleVote(post._id, 'up')}
                                        className={`flex items-center ${post.upvotes.includes(user?.id || '')
                                            ? 'text-green-600'
                                            : 'text-gray-400 hover:text-green-600'
                                            }`}
                                    >
                                        <ThumbsUp className="h-5 w-5 mr-1" />
                                        {post.upvotes.length}
                                    </button>
                                    <button
                                        onClick={() => handleVote(post._id, 'down')}
                                        className={`flex items-center ${post.downvotes.includes(user?.id || '')
                                            ? 'text-red-600'
                                            : 'text-gray-400 hover:text-red-600'
                                            }`}
                                    >
                                        <ThumbsDown className="h-5 w-5 mr-1" />
                                        {post.downvotes.length}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <p className="text-sm text-gray-500">
                                    Posted by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                {post.isEdited && (
                                    <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-sm text-gray-500 italic">edited</span>
                                    </>
                                )}
                                <span className="text-gray-500">•</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${post.author.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {post.author.role}
                                </span>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {editingPost === post._id ? (
                                <div className="mt-4">
                                    <textarea
                                        value={post.content}
                                        onChange={(e) => {
                                            const updatedPosts = posts.map(p =>
                                                p._id === post._id ? { ...p, content: e.target.value } : p
                                            );
                                            setPosts(updatedPosts);
                                        }}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={4}
                                    />
                                    <div className="mt-2 flex justify-end space-x-2">
                                        <button
                                            onClick={() => setEditingPost(null)}
                                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 border rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleEditPost(post._id, {
                                                title: post.title,
                                                content: post.content
                                            })}
                                            className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-900">{post.content}</p>
                            )}

                            {canEditPost(post) && !editingPost && (
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => setEditingPost(post._id)}
                                        className="text-gray-600 hover:text-indigo-600 flex items-center text-sm"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        className="text-gray-600 hover:text-red-600 flex items-center text-sm"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 space-y-4">
                                {post.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className={`pl-4 border-l-2 ${comment.parentComment ? 'ml-8 border-gray-200' : 'border-indigo-200'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm text-gray-500">
                                                    {comment.author.name} • {new Date(comment.createdAt).toLocaleDateString()}
                                                </p>
                                                <span className={`px-2 py-1 text-xs rounded-full ${comment.author.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {comment.author.role}
                                                </span>
                                            </div>
                                            {user?.role === 'doctor' && (
                                                <button
                                                    onClick={() => setReplyingTo({ postId: post._id, commentId: comment._id })}
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                                                >
                                                    <Reply className="h-4 w-4 mr-1" />
                                                    Reply
                                                </button>
                                            )}
                                        </div>
                                        {editingComment === comment._id ? (
                                            <div className="mt-2">
                                                <textarea
                                                    value={comment.content}
                                                    onChange={(e) => {
                                                        const updatedPosts = posts.map(p => ({
                                                            ...p,
                                                            comments: p.comments.map(c =>
                                                                c._id === comment._id ? { ...c, content: e.target.value } : c
                                                            )
                                                        }));
                                                        setPosts(updatedPosts);
                                                    }}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows={3}
                                                />
                                                <div className="mt-2 flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => setEditingComment(null)}
                                                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 border rounded-md"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Handle save comment
                                                            setEditingComment(null);
                                                        }}
                                                        className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-gray-900">{comment.content}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {user?.role === 'doctor' && !replyingTo && (
                                <button
                                    onClick={() => setReplyingTo({ postId: post._id })}
                                    className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                                >
                                    <Reply className="h-4 w-4 mr-1" />
                                    Answer Question
                                </button>
                            )}

                            {replyingTo?.postId === post._id && (
                                <div className="mt-4">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder={user?.role === 'doctor' ? "Write your answer..." : "Write your reply..."}
                                    />
                                    <div className="mt-2 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                setReplyingTo(null);
                                                setReplyContent('');
                                            }}
                                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 border rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReply}
                                            className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ask a Question</h3>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Press Enter to add tags"
                                    />
                                    {newPost.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {newPost.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                >
                                    Post Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDiscussionPage;