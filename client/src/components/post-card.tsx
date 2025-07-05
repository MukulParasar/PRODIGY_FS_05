import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import type { PostWithAuthor, CommentWithAuthor } from "@shared/schema";

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: comments } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", post.id, "comments"],
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/comments`, { content });
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post.id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {post.author.profileImageUrl ? (
            <img 
              src={post.author.profileImageUrl} 
              alt={`${post.author.firstName || 'User'} Avatar`} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
              <i className="fas fa-user"></i>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-secondary">
                {post.author.firstName && post.author.lastName 
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author.email?.split('@')[0] || 'User'
                }
              </h4>
              <span className="text-neutral-600 text-sm">
                {formatTimeAgo(post.createdAt!)}
              </span>
            </div>
            
            <p className="text-secondary mb-4 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className={`flex items-center space-x-2 transition-colors group ${
                    post.isLiked 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-neutral-600 hover:text-red-500"
                  }`}
                >
                  <i className={`${post.isLiked ? "fas" : "far"} fa-heart group-hover:scale-110 transition-transform`}></i>
                  <span className="text-sm">{post.likeCount} like{post.likeCount === 1 ? "" : "s"}</span>
                </button>
                
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary transition-colors"
                >
                  <i className="far fa-comment"></i>
                  <span className="text-sm">{post.commentCount} comment{post.commentCount === 1 ? "" : "s"}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-green-500 transition-colors">
                  <i className="fas fa-share"></i>
                  <span className="text-sm">Share</span>
                </button>
              </div>
              
              <button className="text-neutral-600 hover:text-secondary transition-colors">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showComments && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                {comment.user.profileImageUrl ? (
                  <img 
                    src={comment.user.profileImageUrl} 
                    alt={`${comment.user.firstName || 'User'} Avatar`} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-secondary">
                        {comment.user.firstName && comment.user.lastName 
                          ? `${comment.user.firstName} ${comment.user.lastName}`
                          : comment.user.email?.split('@')[0] || 'User'
                        }
                      </span>
                      <span className="text-xs text-neutral-600">
                        {formatTimeAgo(comment.createdAt!)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleComment} className="mt-4 flex items-start space-x-3">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Your Avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                <i className="fas fa-user"></i>
              </div>
            )}
            <div className="flex-1 flex space-x-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 bg-white rounded-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
              <Button
                type="submit"
                disabled={commentMutation.isPending || !newComment.trim()}
                size="sm"
                className="rounded-full"
              >
                {commentMutation.isPending ? "..." : "Post"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
