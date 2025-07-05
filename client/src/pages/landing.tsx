import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">
              <i className="fas fa-users text-primary mr-2"></i>SocialConnect
            </h1>
            <p className="text-neutral-600">Connect with friends and share your moments</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Sign In
            </Button>
            
            <p className="text-center text-neutral-600 text-sm">
              Join thousands of users sharing their experiences
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
