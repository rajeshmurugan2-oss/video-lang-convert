# VideoLang Pro - AI Video Language Converter

A professional AI-powered video language conversion platform that transforms videos into different languages with perfect voice matching and multi-speaker support.

## 🚀 Features

### Core Functionality
- **Multi-Language Support**: Convert videos to 20+ languages
- **Multi-Speaker Detection**: Automatically identify and separate different speakers
- **Gender-Matched Voices**: AI voices that match the original speaker's gender
- **High-Quality Audio**: Professional-grade voice synthesis
- **Smart File Organization**: ZIP downloads with organized file structure

### User Experience
- **Audio Preview**: Play button for each speaker segment
- **Batch Downloads**: Download all speaker audio as organized ZIP files
- **Excel Export**: Download speaker breakdown as CSV/Excel
- **Real-time Processing**: Fast conversion with progress tracking
- **Professional UI**: Clean, modern interface

### Business Features
- **Authentication**: Secure user registration and login
- **Subscription Plans**: Free, Monthly ($5), and Yearly ($50) options
- **Payment Processing**: Stripe integration with $1 authorization
- **30-Day Money-Back Guarantee**: Risk-free trial
- **Usage Tracking**: Monitor conversion limits and usage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Clerk (Google, Facebook, Email)
- **Payments**: Stripe
- **AI Services**: OpenAI (Whisper, GPT, TTS)
- **Database**: Supabase
- **UI Components**: Lucide React, Sonner (toasts)
- **File Processing**: JSZip for organized downloads

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Clerk account for authentication
- Stripe account for payments
- Supabase account for database

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd video-lang-convert
npm install
```

### 2. Environment Setup
Copy the environment template:
```bash
cp env.example .env.local
```

Fill in your API keys:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🔧 Service Setup

### Clerk Authentication
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Configure social providers (Google, Facebook)
4. Copy publishable and secret keys to `.env.local`

### Stripe Payments
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from dashboard
3. Set up webhook endpoints for subscription events
4. Configure products and prices for your plans

### Supabase Database
1. Create project at [supabase.com](https://supabase.com)
2. Create tables for user data and usage tracking
3. Set up Row Level Security (RLS)
4. Copy URL and anon key to `.env.local`

### OpenAI API
1. Create account at [platform.openai.com](https://platform.openai.com)
2. Generate API key
3. Add billing information
4. Copy API key to `.env.local`

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Authenticated user dashboard
│   ├── pricing/           # Subscription plans page
│   ├── api/
│   │   └── convert-video/ # Video conversion API
│   ├── layout.tsx         # Root layout with Clerk
│   └── page.tsx          # Landing page
├── components/
│   ├── video-language-interface.tsx
│   ├── video-upload.tsx
│   ├── language-selector.tsx
│   └── conversion-results.tsx
└── lib/                   # Utility functions
```

## 💰 Pricing Plans

### Free Plan
- 2 video conversions per month
- Basic language support (5 languages)
- Standard quality audio
- Community support

### Monthly Plan - $5/month
- Unlimited video conversions
- All 20+ languages
- Multi-speaker detection
- High quality audio
- Gender-matched voices
- ZIP download feature
- Priority email support

### Yearly Plan - $50/year (Save 17%)
- Everything in Monthly plan
- Premium quality audio
- API access (coming soon)
- Bulk processing tools
- Priority support

## 🔒 Security & Privacy

- **Secure Authentication**: Clerk handles all user authentication
- **Encrypted Payments**: Stripe processes all payments securely
- **Data Privacy**: User data is encrypted and stored securely
- **API Security**: All API routes are protected and rate-limited
- **File Security**: Uploaded files are processed securely and not stored

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### AWS Amplify
1. Connect repository to AWS Amplify
2. Configure build settings
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Analytics & Monitoring

- **Usage Tracking**: Monitor user conversions and limits
- **Error Monitoring**: Track and fix issues quickly
- **Performance Metrics**: Monitor API response times
- **User Analytics**: Track user behavior and engagement

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@videolangpro.com
- **Documentation**: [docs.videolangpro.com](https://docs.videolangpro.com)
- **Status Page**: [status.videolangpro.com](https://status.videolangpro.com)

## 🎯 Roadmap

- [ ] API access for developers
- [ ] Bulk processing tools
- [ ] Advanced voice customization
- [ ] Video subtitle generation
- [ ] Mobile app
- [ ] Enterprise features

---

Built with ❤️ by the VideoLang Pro team