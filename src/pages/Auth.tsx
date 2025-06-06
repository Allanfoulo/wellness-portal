import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { demoCredentials } from '@/lib/supabase';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast.error(error);
    } else {
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    
    if (error) {
      toast.error(error);
    } else {
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (type: 'admin' | 'user') => {
    const credentials = demoCredentials[type];
    setSignInData({
      email: credentials.email,
      password: credentials.password,
    });
    toast.success(`Demo ${type} credentials filled`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center section-padding">
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-lavender-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-playfair text-xl font-semibold text-charcoal-800">
              Elysian Wellness
            </span>
          </Link>
          <h1 className="text-2xl font-playfair font-bold text-charcoal-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-charcoal-600">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Demo Credentials */}
        <Card className="luxury-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-playfair">Demo Credentials</CardTitle>
            <CardDescription>
              Use these credentials to explore the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal-700">Admin Account:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  className="h-7 px-2"
                >
                  Auto-fill
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-xs text-charcoal-600">
                <span>{demoCredentials.admin.email}</span>
                <button
                  onClick={() => copyToClipboard(demoCredentials.admin.email, 'Admin email')}
                  className="text-lavender-600 hover:text-lavender-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal-700">User Account:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('user')}
                  className="h-7 px-2"
                >
                  Auto-fill
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-xs text-charcoal-600">
                <span>{demoCredentials.user.email}</span>
                <button
                  onClick={() => copyToClipboard(demoCredentials.user.email, 'User email')}
                  className="text-lavender-600 hover:text-lavender-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Tabs */}
        <Card className="luxury-card">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-lavender-50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <CardHeader>
                <CardTitle className="font-playfair">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="luxury-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="luxury-input pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-charcoal-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-charcoal-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full luxury-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="font-playfair">Create Account</CardTitle>
                <CardDescription>
                  Join Elysian Wellness and start your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      className="luxury-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="luxury-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="luxury-input pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-charcoal-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-charcoal-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full luxury-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-charcoal-600 hover:text-lavender-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
