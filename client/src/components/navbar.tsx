import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-secondary">
              <i className="fas fa-users text-primary mr-2"></i>SocialConnect
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-primary transition-colors">
              <i className="fas fa-home"></i>
              <span className="font-medium">Home</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              className="hidden md:flex"
            >
              Logout
            </Button>
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
