export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        <button className="flex flex-col items-center p-3 text-primary">
          <i className="fas fa-home text-xl"></i>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center p-3 text-neutral-600">
          <i className="fas fa-search text-xl"></i>
          <span className="text-xs mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center p-3 text-neutral-600">
          <i className="fas fa-plus-circle text-xl"></i>
          <span className="text-xs mt-1">Create</span>
        </button>
        <button className="flex flex-col items-center p-3 text-neutral-600">
          <i className="fas fa-heart text-xl"></i>
          <span className="text-xs mt-1">Activity</span>
        </button>
        <button 
          onClick={() => window.location.href = '/api/logout'}
          className="flex flex-col items-center p-3 text-neutral-600"
        >
          <i className="fas fa-sign-out-alt text-xl"></i>
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
}
