// "use client";

// import React, { useState, useEffect, use } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Mail,
//   ArrowLeft,
//   Loader2
// } from "lucide-react";

// export default function LoginPage({ params }) {
//   const [step, setStep] = useState("email"); // "email" or "otp"
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("/profile");
//   const [lang, setLang] = useState("en");
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // Unwrap params Promise
//   const resolvedParams = use(params);

//   useEffect(() => {
//     // Get language from params
//     if (resolvedParams?.lang) {
//       setLang(resolvedParams.lang);
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     // Get redirect URL from query parameters
//     const redirect = searchParams.get('redirect');
//     if (redirect) {
//       setRedirectUrl(redirect);
//     }
//   }, [searchParams]);

//   // Check if user is already authenticated
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch('/api/auth/me', { credentials: 'include' });
//         if (response.ok) {
//           const data = await response.json();
//           if (data.user) {
//             console.log('User already authenticated, redirecting...', { user: data.user, redirectUrl });
//             // User is already authenticated, redirect to appropriate dashboard
//             const userRole = data.user.role;
//             let redirectPath;
            
//             if (userRole === 'admin') {
//               redirectPath = `/${lang}/admin`;
//             } else if (userRole === 'editor') {
//               redirectPath = `/${lang}/editor`;
//             } else {
//               // Ensure redirect URL has proper language prefix
//               redirectPath = redirectUrl.startsWith('/') ? redirectUrl : `/${lang}${redirectUrl}`;
//             }
            
//             console.log('Redirecting to:', redirectPath);
//             router.replace(redirectPath); // Use replace instead of push to avoid back button issues
//           }
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//       }
//     };

//     checkAuth();
//   }, [router, redirectUrl, lang]);

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch('/api/auth/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       // Check if response is ok and content type is JSON
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error('Response is not JSON');
//       }

//       const data = await response.json();

//       if (data.success) {
//         setStep("otp");
//         setMessage("OTP sent to your email. Please check your inbox.");
//       } else {
//         setError(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch('/api/auth/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       // Check if response is ok and content type is JSON
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error('Response is not JSON');
//       }

//       const data = await response.json();

//       if (data.success) {
//         setMessage("Login successful! Redirecting...");
        
//         // Redirect based on user role
//         setTimeout(() => {
//           let redirectPath;
          
//           if (data.user.role === 'admin') {
//             redirectPath = `/${lang}/admin`;
//           } else if (data.user.role === 'editor') {
//             redirectPath = `/${lang}/editor`;
//           } else {
//             // Ensure redirect URL has proper language prefix
//             redirectPath = redirectUrl.startsWith('/') ? redirectUrl : `/${lang}${redirectUrl}`;
//           }
          
//           console.log('Login successful, redirecting to:', redirectPath);
//           router.replace(redirectPath); // Use replace instead of push
//         }, 1000);
//       } else {
//         setError(data.error || "Invalid OTP");
//       }
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToEmail = () => {
//     setStep("email");
//     setOtp("");
//     setError("");
//     setMessage("");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome Back
//           </h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Sign in to your FootballBank account
//           </p>
//         </div>

//         <Card className="shadow-xl">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">
//               {step === "email" ? "Sign In" : "Verify OTP"}
//             </CardTitle>
//             <p className="text-center text-sm text-muted-foreground">
//               {step === "email" 
//                 ? "Enter your email address to receive a verification code"
//                 : "Enter the 6-digit code sent to your email"
//               }
//             </p>
//           </CardHeader>
//           <CardContent>
//             {step === "email" ? (
//               <form onSubmit={handleEmailSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {message && (
//                   <div className="text-sm text-green-600 text-center">
//                     {message}
//                   </div>
//                 )}

//                 {error && (
//                   <div className="text-sm text-red-600 text-center">
//                     {error}
//                   </div>
//                 )}

//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Sending OTP...
//                     </>
//                   ) : (
//                     "Send OTP"
//                   )}
//                 </Button>
//               </form>
//             ) : (
//               <form onSubmit={handleOtpSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="otp">Verification Code</Label>
//                   <Input
//                     id="otp"
//                     type="text"
//                     placeholder="Enter 6-digit code"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     maxLength={6}
//                     className="text-center text-lg tracking-widest"
//                     required
//                   />
//                   <p className="text-sm text-muted-foreground text-center">
//                     Code sent to: <span className="font-medium">{email}</span>
//                   </p>
//                 </div>

//                 {message && (
//                   <div className="text-sm text-green-600 text-center">
//                     {message}
//                   </div>
//                 )}

//                 {error && (
//                   <div className="text-sm text-red-600 text-center">
//                     {error}
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <Button type="submit" className="w-full" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Verifying...
//                       </>
//                     ) : (
//                       "Verify OTP"
//                     )}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     className="w-full" 
//                     onClick={handleBackToEmail}
//                     disabled={loading}
//                   >
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Back to Email
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
// import { signIn } from "next-auth/react"; // Disabled to avoid openid-client issues
import { sendLoginOTP, verifyLoginOTP } from "@/actions/authActions";

import "aos/dist/aos.css";



function LoginPageContent() {
  const [step, setStep] = useState("email"); // "email", "otp", or "password"
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp" or "password"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/profile");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get redirect URL from query parameters
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // User is already authenticated, redirect to appropriate dashboard
            const dashboardUrl = redirectUrl || (data.user.role === 'admin' ? '/admin' : 
                              data.user.role === 'player' ? '/player-profile' : '/profile');
            window.location.href = dashboardUrl;
          }
        }
      } catch (error) {
        // User is not authenticated, continue with login process
        console.log('User not authenticated, showing login form');
      }
    };

    checkAuth();
  }, [redirectUrl]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await sendLoginOTP(email);
      
      if (result.success) {
        setMessage(result.message);
        setStep("otp");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/auth/password-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("🔐 Password login successful for user:", data.user.email);
        setMessage("Login successful! Redirecting...");
        
        setTimeout(() => {
          let dashboardUrl = redirectUrl;
          
          if (!dashboardUrl) {
            if (data.user.role === 'admin') {
              dashboardUrl = '/admin';
            } else if (data.user.role === 'player') {
              dashboardUrl = '/player-profile';
            } else {
              dashboardUrl = '/profile';
            }
          }
          
          console.log("🔐 Redirecting to:", dashboardUrl);
          window.location.href = dashboardUrl;
        }, 1000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await verifyLoginOTP(email, otp);
      
      if (result.success) {
        console.log("🔐 Login successful for user:", result.user.email);
        setMessage("Login successful! Redirecting...");
        // Redirect directly without page reload to avoid redirect loop
        setTimeout(() => {
          let dashboardUrl = redirectUrl;
          
          // If no redirect URL specified, determine based on user role
          if (!dashboardUrl) {
            if (result.user.role === 'admin') {
              dashboardUrl = '/admin';
            } else if (result.user.role === 'player') {
              dashboardUrl = '/player-profile';
            } else {
              dashboardUrl = '/profile';
            }
          }
          
          console.log("🔐 Redirecting to:", dashboardUrl);
          window.location.href = dashboardUrl;
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError(`OAuth authentication is currently disabled. Please use email login instead.`);
    setLoading(false);
  };

  const resendOTP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await sendLoginOTP(email);
      
      if (result.success) {
        setMessage("New code sent to your email");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // No need for loading states - server-side layout handles authentication

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
         
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Welcome Back
          </h1>
          <p className="text-primary-muted">
            {step === "email" 
              ? "Enter your email to receive a login code"
              : "Enter the 6-digit code sent to your email"
            }
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === "email" ? "Sign In" : "Verify Code"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Messages */}
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                {/* Login Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose Login Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod("otp")}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        loginMethod === "otp"
                          ? "border-accent-red bg-red-50 text-accent-red"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <Mail className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">OTP</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod("password")}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        loginMethod === "password"
                          ? "border-accent-red bg-red-50 text-accent-red"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <Lock className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">Password</div>
                      </div>
                    </button>
                  </div>
                </div>

                <form onSubmit={loginMethod === "otp" ? handleSendOTP : handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium mb-4">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {loginMethod === "password" && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-accent-red hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    {loginMethod === "otp" ? "Send Login Code" : "Login with Password"}
                  </Button>
                </form>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium mb-2">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="pl-10 text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-primary-muted">
                    Code sent to {email}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-red hover:bg-red-700"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Verify & Login
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={loading}
                    className="text-sm text-accent-red hover:text-red-700 disabled:opacity-50"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* OAuth Section */}
            {step === "email" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-divider" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-primary-muted">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    // variant="outline"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={loading}
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    // variant="outline"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={loading}
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>
              </>
            )}

            {/* Back to Email */}
            {step === "otp" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-primary-muted hover:text-primary-text"
                >
                  ← Back to email
                </button>
              </div>
            )}

            {/* Forgot Password Link */}
            {step === "email" && (
              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-primary-muted hover:text-primary-text">
                  Forgot your password?
                </Link>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-divider">
              <p className="text-sm text-primary-muted">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-accent-red hover:text-red-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 flex items-center justify-center px-4 pt-4 pb-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-text mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}