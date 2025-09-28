# Authentication System Setup Guide

## Overview
This application now includes a comprehensive OTP-based authentication system with OAuth integration using the best free email service (Resend).

## Features
- ✅ OTP-based login and signup
- ✅ OAuth integration (Google, GitHub)
- ✅ Email verification with Resend
- ✅ Session management
- ✅ Password reset functionality
- ✅ Secure middleware protection

## Environment Variables Setup

Add these variables to your `.env.local` file:

```env
# Database
DATABASE_URL="your-mongodb-connection-string"

# JWT Secret for OTP authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
```

## Setup Instructions

### 1. Database Migration
Run the database migration to add OTP and Session tables:

```bash
npx prisma db push
```

### 2. Resend Email Service Setup
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Get your API key from the dashboard
4. Add it to your environment variables

### 3. OAuth Provider Setup

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to environment variables

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to environment variables

### 4. Update Application Layout

Replace the old Kinde provider with the new authentication system in your `layout.js`:

```jsx
import { SessionProvider } from "next-auth/react";
import { NewAuthProvider } from "@/context/NewAuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NewAuthProvider>
            {children}
          </NewAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Authentication Flow

### OTP Authentication:
1. User enters email on login/signup page
2. System generates 6-digit OTP
3. OTP sent via Resend email service
4. User enters OTP to verify
5. Session created and user logged in

### OAuth Authentication:
1. User clicks Google/GitHub button
2. Redirected to provider for authentication
3. Provider redirects back with user data
4. User account created/updated in database
5. Session established

## API Endpoints

### Authentication:
- `POST /api/auth/send-login-otp` - Send login OTP
- `POST /api/auth/verify-login-otp` - Verify login OTP
- `POST /api/auth/send-signup-otp` - Send signup OTP
- `POST /api/auth/verify-signup-otp` - Verify signup OTP
- `POST /api/auth/logout` - Logout user

### OAuth:
- `GET /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

## Security Features

- ✅ JWT-based session tokens
- ✅ OTP expiration (10 minutes)
- ✅ Session expiration (30 days)
- ✅ Secure HTTP-only cookies
- ✅ CSRF protection
- ✅ Rate limiting on OTP requests
- ✅ Email verification required

## Usage Examples

### Login Page:
```jsx
import { sendLoginOTP, verifyLoginOTP } from "@/actions/authActions";

// Send OTP
const result = await sendLoginOTP(email);

// Verify OTP
const user = await verifyLoginOTP(email, otp);
```

### OAuth Login:
```jsx
import { signIn } from "next-auth/react";

// Google login
await signIn("google", { callbackUrl: "/profile" });

// GitHub login
await signIn("github", { callbackUrl: "/profile" });
```

### Check Authentication:
```jsx
import { useAuth } from "@/context/NewAuthContext";

const { user, isAuthenticated, logout } = useAuth();
```

## Email Templates

The system includes beautiful HTML email templates for:
- Login verification
- Account creation
- Password reset
- Email verification

Templates are automatically generated with your branding and include security notices.

## Migration from Kinde

If migrating from Kinde:
1. Keep existing Kinde environment variables for backward compatibility
2. Update components to use new authentication context
3. Test both OTP and OAuth flows
4. Update middleware configuration

## Troubleshooting

### Common Issues:
1. **OTP not received**: Check Resend API key and email configuration
2. **OAuth not working**: Verify client IDs and redirect URIs
3. **Session issues**: Check JWT_SECRET configuration
4. **Database errors**: Run `npx prisma db push` to update schema

### Debug Mode:
Set `NODE_ENV=development` to see detailed error logs.

## Production Deployment

1. Update environment variables with production values
2. Set secure cookie settings for HTTPS
3. Configure proper redirect URIs for production domain
4. Set up email domain verification in Resend
5. Test all authentication flows before going live

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test with a fresh database migration
4. Ensure all dependencies are installed correctly
