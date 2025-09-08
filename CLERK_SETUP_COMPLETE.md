# Complete Clerk Authentication Setup Guide

## 🚀 **Step 1: Create Clerk Account**

1. **Go to Clerk Dashboard:**
   - Visit [clerk.com](https://clerk.com)
   - Click "Sign up" or "Get started"
   - Create your account

2. **Create New Application:**
   - Click "Add application"
   - Choose "Next.js" as framework
   - Name: `VideoLang Pro`
   - Click "Create application"

## 🔧 **Step 2: Configure Authentication Methods**

### **Email/Password Authentication:**
1. Go to "User & Authentication" → "Email, Phone, Username"
2. Enable "Email address" 
3. Enable "Password"
4. Configure password requirements (optional)

### **Social Authentication (Google):**
1. Go to "User & Authentication" → "Social Connections"
2. Click "Google"
3. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
   - Copy Client ID and Client Secret

4. **Add to Clerk:**
   - Paste Client ID and Client Secret in Clerk Google settings
   - Save configuration

### **Social Authentication (Facebook):**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app → "Consumer" → "Next"
3. Add Facebook Login product
4. Go to "Facebook Login" → "Settings"
5. Add Valid OAuth Redirect URIs: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
6. Copy App ID and App Secret
7. Add to Clerk Facebook settings

## 🔑 **Step 3: Get API Keys**

1. **Go to "API Keys" section in Clerk**
2. **Copy these keys:**
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## 🌐 **Step 4: Configure Domains**

### **For Development:**
1. Go to "Domains" in Clerk
2. Add to "Allowed origins":
   ```
   http://localhost:3000
   ```

### **For Production (AWS Amplify):**
1. Add your Amplify URL:
   ```
   https://main.d1234567890.amplifyapp.com
   ```
2. Add your custom domain (if you have one):
   ```
   https://yourdomain.com
   ```

## 📝 **Step 5: Set Up Environment Variables**

### **For Local Development (.env.local):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### **For AWS Amplify:**
1. Go to AWS Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add these variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

## 🎨 **Step 6: Customize Appearance (Optional)**

1. **Go to "Customization" in Clerk**
2. **Branding:**
   - Upload your logo
   - Set brand colors
   - Customize fonts

3. **Sign-in/Sign-up Pages:**
   - Customize the appearance
   - Add your branding
   - Configure fields

## 🔒 **Step 7: Configure Security Settings**

1. **Go to "Security" in Clerk**
2. **Session Settings:**
   - Set session timeout
   - Configure refresh token settings

3. **Password Settings:**
   - Set minimum password requirements
   - Enable password strength indicator

## 🧪 **Step 8: Test Authentication**

### **Local Testing:**
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Go to `http://localhost:3000`
3. Click "Get Started" button
4. Test sign-up with email
5. Test Google/Facebook login

### **Production Testing:**
1. Deploy to AWS Amplify
2. Test all authentication flows
3. Verify redirects work correctly

## 📋 **Complete Environment Variables Checklist**

Make sure you have ALL these variables set:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 🚨 **Common Issues & Solutions**

### **"Missing publishableKey" Error:**
- ✅ Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- ✅ Check the key starts with `pk_test_` or `pk_live_`
- ✅ No extra spaces or characters

### **"Invalid publishableKey" Error:**
- ✅ Verify the key is correct in Clerk dashboard
- ✅ Make sure you're using the right environment (test vs live)

### **Social Login Not Working:**
- ✅ Check OAuth redirect URIs are correct
- ✅ Verify Client ID/Secret are correct
- ✅ Make sure the social app is approved (if required)

### **Redirect Issues:**
- ✅ Check allowed origins in Clerk
- ✅ Verify afterSignOutUrl is correct
- ✅ Test redirect URLs

## 🎯 **Deployment Checklist**

Before deploying to production:

- [ ] Clerk account created and configured
- [ ] Social providers set up (Google, Facebook)
- [ ] API keys obtained
- [ ] Environment variables set in Amplify
- [ ] Domains configured in Clerk
- [ ] Authentication tested locally
- [ ] All redirect URLs working
- [ ] Custom branding applied (optional)

## 📞 **Support Resources**

- **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
- **Clerk Support**: Available in dashboard
- **Google OAuth Setup**: [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)
- **Facebook Login Setup**: [developers.facebook.com/docs/facebook-login](https://developers.facebook.com/docs/facebook-login)

## 🎉 **You're Ready!**

Once you complete these steps, your VideoLang Pro app will have:
- ✅ Professional authentication system
- ✅ Social login (Google, Facebook)
- ✅ Secure user management
- ✅ Protected routes
- ✅ User profiles and settings

**Your SaaS is ready for customers!** 🚀
