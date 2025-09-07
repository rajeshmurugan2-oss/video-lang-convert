# VideoLang Pro - Deployment Guide

This guide will help you deploy VideoLang Pro to production with all the necessary services configured.

## 🚀 Quick Deployment Checklist

- [ ] Set up Clerk authentication
- [ ] Configure Stripe payments
- [ ] Set up Supabase database
- [ ] Configure OpenAI API
- [ ] Deploy to hosting platform
- [ ] Set up monitoring and analytics

## 🔐 Service Configuration

### 1. Clerk Authentication Setup

1. **Create Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up for a free account
   - Create a new application

2. **Configure Social Providers**
   - Go to "User & Authentication" → "Social Connections"
   - Enable Google OAuth
   - Enable Facebook OAuth
   - Configure redirect URLs

3. **Get API Keys**
   - Go to "API Keys" section
   - Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy `CLERK_SECRET_KEY`

4. **Configure JWT Templates** (Optional)
   - Set up custom JWT claims for user data
   - Configure session management

### 2. Stripe Payments Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Complete account verification
   - Enable test mode for development

2. **Create Products and Prices**
   ```bash
   # Monthly Plan
   stripe products create --name "VideoLang Pro Monthly" --description "Monthly subscription for unlimited video conversions"
   stripe prices create --product prod_xxx --unit-amount 500 --currency usd --recurring interval=month

   # Yearly Plan  
   stripe products create --name "VideoLang Pro Yearly" --description "Yearly subscription for unlimited video conversions"
   stripe prices create --product prod_xxx --unit-amount 5000 --currency usd --recurring interval=year
   ```

3. **Set up Webhooks**
   - Go to "Developers" → "Webhooks"
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. **Get API Keys**
   - Copy `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy `STRIPE_SECRET_KEY`
   - Copy webhook secret

### 3. Supabase Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to be ready

2. **Create Database Schema**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     clerk_id TEXT UNIQUE NOT NULL,
     email TEXT NOT NULL,
     subscription_status TEXT DEFAULT 'free',
     subscription_plan TEXT DEFAULT 'free',
     usage_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Usage tracking
   CREATE TABLE usage_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     conversion_type TEXT NOT NULL,
     file_size INTEGER,
     duration_seconds INTEGER,
     language_from TEXT,
     language_to TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub');
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub');
   ```

3. **Get API Keys**
   - Go to "Settings" → "API"
   - Copy `Project URL`
   - Copy `anon public` key

### 4. OpenAI API Setup

1. **Create OpenAI Account**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up and verify email
   - Add billing information

2. **Generate API Key**
   - Go to "API Keys" section
   - Create new secret key
   - Copy the key (starts with `sk-proj-`)

3. **Set Usage Limits**
   - Go to "Usage" section
   - Set monthly spending limits
   - Monitor usage regularly

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add all variables from `.env.local`

3. **Configure Domains**
   - Add custom domain in Vercel dashboard
   - Update Clerk redirect URLs
   - Update Stripe webhook URLs

### Option 2: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify console
   - Connect GitHub repository
   - Select branch and build settings

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

3. **Add Environment Variables**
   - Go to "Environment variables" section
   - Add all required variables

### Option 3: Manual Server Deployment

1. **Prepare Server**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd video-lang-convert
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "videolang-pro" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx** (Optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Service URLs

After deployment, update these URLs in your service configurations:

**Clerk:**
- Add production domain to allowed origins
- Update redirect URLs

**Stripe:**
- Update webhook endpoint URL
- Test webhook events

**Supabase:**
- Update RLS policies if needed
- Configure backup schedules

### 2. Set up Monitoring

1. **Error Tracking**
   - Set up Sentry or similar service
   - Monitor API errors and user issues

2. **Analytics**
   - Add Google Analytics or Mixpanel
   - Track user behavior and conversions

3. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor API endpoints

### 3. Security Checklist

- [ ] Enable HTTPS (automatic with Vercel/Amplify)
- [ ] Set up CORS policies
- [ ] Configure rate limiting
- [ ] Set up DDoS protection
- [ ] Enable security headers
- [ ] Regular security audits

## 📊 Production Monitoring

### Key Metrics to Monitor

1. **Performance**
   - API response times
   - Conversion success rates
   - Error rates

2. **Business**
   - User registrations
   - Subscription conversions
   - Revenue metrics

3. **Technical**
   - Server uptime
   - Database performance
   - API usage limits

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Uptime**: UptimeRobot
- **Logs**: LogRocket, DataDog
- **Performance**: New Relic, AppDynamics

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Clerk configuration
   - Verify API keys
   - Check redirect URLs

2. **Payment Issues**
   - Verify Stripe webhook configuration
   - Check API keys
   - Test with Stripe test cards

3. **Database Connection**
   - Verify Supabase credentials
   - Check RLS policies
   - Monitor connection limits

4. **API Rate Limits**
   - Monitor OpenAI usage
   - Implement proper error handling
   - Set up usage alerts

### Support Resources

- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

## 🎯 Launch Checklist

- [ ] All services configured and tested
- [ ] Environment variables set correctly
- [ ] Domain configured and SSL enabled
- [ ] Payment processing tested
- [ ] Authentication flow tested
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] Error tracking configured
- [ ] Analytics implemented
- [ ] Legal pages created (Privacy Policy, Terms of Service)
- [ ] Support system in place
- [ ] Launch announcement prepared

---

Your VideoLang Pro application is now ready for production! 🚀