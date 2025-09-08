# Clerk Authentication Setup for AWS Amplify

## 🚀 Quick Setup Steps

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Configure Social Providers
1. Go to "User & Authentication" → "Social Connections"
2. Enable Google OAuth:
   - Click "Google"
   - Follow the setup instructions
   - Add your domain to authorized origins
3. Enable Facebook OAuth (optional):
   - Click "Facebook"
   - Follow the setup instructions

### 3. Get API Keys
1. Go to "API Keys" section
2. Copy the **Publishable Key** (starts with `pk_test_`)
3. Copy the **Secret Key** (starts with `sk_test_`)

### 4. Add to AWS Amplify
1. Go to your AWS Amplify app
2. Go to "Environment variables"
3. Add these variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### 5. Configure Allowed Origins
1. In Clerk dashboard, go to "Domains"
2. Add your Amplify URL to "Allowed origins":
   ```
   https://main.d1234567890.amplifyapp.com
   ```
3. Add your custom domain (if you have one)

## 🔧 Environment Variables Checklist

Make sure you have ALL these variables in AWS Amplify:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Stripe (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Supabase (optional for now)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 🚨 Common Issues

### "Missing publishableKey" Error
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in Amplify
- Check the key starts with `pk_test_` or `pk_live_`

### "Invalid publishableKey" Error
- Verify the key is correct in Clerk dashboard
- Make sure there are no extra spaces or characters

### Authentication Not Working
- Check allowed origins in Clerk dashboard
- Make sure your domain is added correctly

## 📞 Need Help?

- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Clerk Support**: Available in their dashboard
- **AWS Amplify Docs**: [docs.amplify.aws](https://docs.amplify.aws)
