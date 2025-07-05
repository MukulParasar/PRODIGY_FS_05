import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { PostWithAuthor } from "@shared/schema";

export default function Sidebar() {
  const { user } = useAuth();
  
  const { data: posts } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  const userPostCount = posts?.filter(post => post.authorId === user?.id).length || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="text-center">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="User Profile" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary text-white flex items-center justify-center text-2xl">
              <i className="fas fa-user"></i>
            </div>
          )}
          <h3 className="font-semibold text-lg text-secondary">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.email?.split('@')[0] || 'User'
            }
          </h3>
          <p className="text-neutral-600 text-sm">{user?.email}</p>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Posts</span>
            <span className="font-semibold text-secondary">{userPostCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Followers</span>
            <span className="font-semibold text-secondary">248</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Following</span>
            <span className="font-semibold text-secondary">156</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h4 className="font-semibold text-secondary mb-4">Quick Actions</h4>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
            <i className="fas fa-camera text-primary"></i>
            <span>Upload Photo</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
            <i className="fas fa-users text-accent"></i>
            <span>Find Friends</span>
          </button>
          <button 
            onClick={() => window.location.href = '/api/logout'}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <i className="fas fa-sign-out-alt text-neutral-600"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
