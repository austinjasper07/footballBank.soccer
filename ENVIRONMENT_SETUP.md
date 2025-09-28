# Environment Variables Setup Guide

## Required Environment Variables

Add these variables to your `.env.local` file:

```env
# Database Connection
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/footballbank?retryWrites=true&w=majority"

# JWT Secret for OTP Authentication (Generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here-also-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id-from-google-cloud-console"
GOOGLE_CLIENT_SECRET="your-google-client-secret-from-google-cloud-console"

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID="your-github-client-id-from-github-settings"
GITHUB_CLIENT_SECRET="your-github-client-secret-from-github-settings"

# Email Service (Resend - Free 100 emails/day)
RESEND_API_KEY="your-resend-api-key-from-resend-dashboard"
```

## Setup Instructions

### 1. Database Setup
Your MongoDB connection string should be in the format:
```
mongodb+srv://username:password@cluster.mongodb.net/footballbank?retryWrites=true&w=majority
```

### 2. JWT Secret Generation
Generate a secure JWT secret:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

### 3. NextAuth Secret
Generate a NextAuth secret (same process as JWT secret):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Resend Email Service Setup
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Go to API Keys in the dashboard
5. Create a new API key
6. Copy the API key to your environment variables

**Resend Free Tier:**
- 100 emails per day
- No credit card required
- High deliverability
- Professional email templates

### 5. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Secret to environment variables

### 6. GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the form:
   - Application name: "FootballBank.soccer"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID and Secret to environment variables

## Testing the Setup

### 1. Test Database Connection
```bash
npx prisma db push
```

### 2. Test Email Service
Visit: `http://localhost:3000/auth/test`

### 3. Test OAuth
Visit: `http://localhost:3000/auth/login`

## Production Environment Variables

For production deployment, update these variables:

```env
# Production URLs
NEXTAUTH_URL="https://yourdomain.com"

# Production OAuth Redirect URIs
# Google: https://yourdomain.com/api/auth/callback/google
# GitHub: https://yourdomain.com/api/auth/callback/github

# Production Database
DATABASE_URL="your-production-mongodb-connection-string"
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use strong, unique secrets for JWT_SECRET and NEXTAUTH_SECRET**
3. **Rotate secrets regularly in production**
4. **Use environment-specific configuration**
5. **Monitor API usage and set up alerts**

## Troubleshooting

### Common Issues:

1. **"Module not found" errors**: Run `npm install` to install dependencies
2. **Database connection errors**: Check your MongoDB connection string
3. **Email not sending**: Verify your Resend API key
4. **OAuth not working**: Check client IDs and redirect URIs
5. **JWT errors**: Ensure JWT_SECRET is set and consistent

### Debug Mode:
Set `NODE_ENV=development` to see detailed error logs.

## Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Test each service individually (database, email, OAuth)
4. Ensure all dependencies are installed correctly

## Next Steps

After setting up environment variables:
1. Run `npx prisma db push` to update database schema
2. Test the authentication system at `/auth/test`
3. Try both OTP and OAuth authentication flows
4. Deploy to production with production environment variables
