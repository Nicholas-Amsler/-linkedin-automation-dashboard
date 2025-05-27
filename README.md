# 🚀 LinkedIn Automation Dashboard

A professional, AI-powered LinkedIn content automation system built with Next.js, OpenAI, and n8n workflows. Transform your LinkedIn presence with automated content generation, scheduling, and analytics.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🤖 AI-Powered Content Generation
- **OpenAI Integration**: Generate unique, professional LinkedIn posts using GPT-4o-mini
- **Content Pillars**: Educational, Showcase, Social Proof, Tips, and Industry Insights
- **Smart Templates**: 5 different post types with optimized prompts
- **Rate Limiting**: Built-in protection against API abuse

### 📊 Real-Time Analytics Dashboard
- **Live Metrics**: Connected to Google Sheets for real-time data
- **Performance Tracking**: Engagement rates, profile views, website clicks
- **Content Pipeline**: Visual management of scheduled posts
- **Calendar View**: Organized content scheduling interface

### 🔗 Seamless Integrations
- **Google Sheets API**: Bi-directional data sync for content management
- **n8n Workflows**: Compatible with existing automation pipelines
- **LinkedIn API Ready**: Prepared for official LinkedIn integrations
- **Vercel Deployment**: Optimized for professional hosting

### 🛡️ Enterprise Security
- **Environment Variables**: All secrets properly secured
- **Rate Limiting**: 5 requests per minute per IP address
- **Input Validation**: Protected against malicious requests
- **Error Handling**: Graceful fallbacks and comprehensive logging

## 🎯 Use Cases

- **Business Consultants**: Automate thought leadership content
- **Marketing Agencies**: Scale client LinkedIn presence
- **SaaS Companies**: Systematic product promotion
- **Automation Services**: Showcase technical capabilities to prospects
- **Personal Branding**: Consistent, professional content creation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Google Cloud Service Account
- Google Sheets access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-automation-dashboard.git
cd linkedin-automation-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env.local` file:
```env
GOOGLE_SHEETS_PRIVATE_KEY="your_private_key_here"
GOOGLE_SHEETS_CLIENT_EMAIL="your_service_account_email"
GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id"
OPENAI_API_KEY="your_openai_api_key"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

## 📋 Google Sheets Setup

### Required Columns:
- **Post Description**: AI-generated content
- **Instructions**: Detailed posting guidelines
- **Status**: Pending/Scheduled/Posted
- **Image**: Optional image URLs
- **Scheduled For**: Posting timeline
- **CTA**: Call-to-action links
- **Pillar**: Content categorization
- **Hashtags**: Relevant tags
- **Created Date**: Timestamp

### Service Account Permissions:
1. Create Google Cloud Service Account
2. Download JSON credentials
3. Share your Google Sheet with the service account email
4. Grant "Editor" permissions

## 🤖 AI Content Generation

### Content Pillars:
- **Educational**: Business automation tips and insights
- **Showcase**: Behind-the-scenes n8n workflows
- **Social Proof**: Client success stories and case studies
- **Tips**: Quick wins and actionable advice
- **Industry Insights**: Trends and future predictions

### Customization:
Modify content pillars in `app/api/generate-content/route.js` to match your brand voice and industry focus.

## 🔧 n8n Integration

This dashboard is designed to work seamlessly with n8n automation workflows:

1. **Content Creation**: Dashboard generates content → Google Sheets
2. **Processing**: n8n reads from Google Sheets → Processes content
3. **Publishing**: n8n posts to LinkedIn → Updates status
4. **Analytics**: Performance data flows back to dashboard

## 📈 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy with custom domain**

### Manual Deployment

```bash
npm run build
npm start
```

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse (5 requests/minute/IP)
- **Input Validation**: Sanitized user inputs
- **Environment Variables**: No hardcoded secrets
- **Error Boundaries**: Graceful failure handling
- **CORS Protection**: Secure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for powerful content generation capabilities
- **Vercel** for seamless deployment and hosting
- **Google Cloud** for reliable API infrastructure
- **n8n** for inspiration in workflow automation
- **Next.js** for the incredible developer experience

## 📞 Support

For questions about implementation or customization:

- **Website**: [amslerlabs.com](https://amslerlabs.com)
- **LinkedIn**: Connect for automation insights
- **Email**: nick@amslerlabs.com

## 🚀 What's Next?

- [ ] LinkedIn API integration for real analytics
- [ ] Advanced scheduling capabilities
- [ ] Multi-platform content distribution
- [ ] Team collaboration features
- [ ] White-label solutions for agencies

---

**Built with ❤️ by [Amsler Labs](https://amslerlabs.com) - Automating the future, one workflow at a time.**
