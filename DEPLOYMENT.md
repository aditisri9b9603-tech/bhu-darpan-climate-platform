# Bhu-Darpan Deployment Guide

## Project Status: ✅ Complete & Production Ready

The Bhu-Darpan Climate Intelligence Platform is fully built and ready for deployment.

## 📋 What's Included

### Backend/Database
- ✅ Supabase PostgreSQL database with complete schema
- ✅ Row-Level Security (RLS) policies configured
- ✅ User profile trigger for automatic profile creation
- ✅ Access logging and audit trails
- ✅ API routes for AI scenario modeling

### Frontend/UI
- ✅ All 12 pages built and functional:
  - Auth pages (login, signup, error)
  - Citizen dashboard with charts and data visualization
  - Analyst dashboard with data ingestion tools
  - Admin dashboard with user management
  - Mission Control interface
  - Scenario modeling interface
  - Moderation tools
- ✅ Mission-control dark theme (black bg, cyan accents)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features (semantic HTML, ARIA, keyboard nav)

### Authentication
- ✅ Email/password signup and login
- ✅ Role-based access control (citizen/analyst/admin)
- ✅ Session management with middleware
- ✅ Protected routes with automatic redirects

### AI Integration
- ✅ Claude 3.5 Sonnet integration via Vercel AI SDK
- ✅ Scenario modeling API with structured analysis
- ✅ AI recommendations and impact analysis
- ✅ Flexible prompt-based analysis engine

### Styling & Components
- ✅ Tailwind CSS v4 with custom design tokens
- ✅ shadcn/ui components (Button, Card, Input, Label)
- ✅ Recharts for data visualization
- ✅ Custom climate-specific dashboard components
- ✅ 300+ lines of custom component code

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SUPABASE_URL=<your-supabase-url>
   ANTHROPIC_API_KEY=<your-anthropic-api-key>
   ```

3. **Deploy**
   ```bash
   vercel deploy
   ```

### Option 2: Docker

1. **Build Image**
   ```bash
   docker build -t bhu-darpan .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=... \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
     -e ANTHROPIC_API_KEY=... \
     bhu-darpan
   ```

### Option 3: Traditional VPS/Server

1. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install Dependencies**
   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. **Build**
   ```bash
   pnpm build
   ```

4. **Set Environment**
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL=...
   export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   export ANTHROPIC_API_KEY=...
   ```

5. **Run**
   ```bash
   pnpm start
   ```

## 🔑 Required Environment Variables

```
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_URL=https://your-project.supabase.co

# AI Models (Required for scenario modeling)
ANTHROPIC_API_KEY=sk-ant-v7-...

# Optional: Vercel AI Gateway
AI_GATEWAY_API_KEY=<if using AI Gateway routing>
```

## 📊 Pre-Deployment Checklist

- [ ] Supabase project created and tables initialized
- [ ] Profile trigger created in database
- [ ] Anthropic API key obtained
- [ ] Environment variables configured
- [ ] Domain/URL planned (for callbacks)
- [ ] Backup strategy in place
- [ ] Monitoring tools configured
- [ ] Support/admin contact info documented

## 🧪 Testing in Production

1. **Create test user**
   ```
   Email: test@yourdomain.com
   Password: Test123!
   ```

2. **Verify flows**
   - Login works and redirects to dashboard
   - User info displays correctly
   - Scenario modeling responds with AI analysis
   - Charts load with sample data
   - Role-based pages accessible

3. **Monitor logs**
   - Vercel: Dashboard → Deployments → Logs
   - Database: Supabase → Logs
   - Errors: Sentry/error-tracking service

## 📈 Post-Deployment Tasks

1. **Set up Monitoring**
   - Enable Vercel Observability
   - Configure Supabase alerts
   - Add error tracking (Sentry, etc.)

2. **Configure Backups**
   - Supabase automatic backups (enabled by default)
   - Database snapshots: weekly
   - Code repository backups

3. **Performance Optimization**
   - Enable Vercel Edge Caching
   - Configure CDN for static assets
   - Monitor Core Web Vitals

4. **Security Hardening**
   - Enable HTTPS (Vercel does this automatically)
   - Configure CORS for APIs
   - Rate limiting on API endpoints
   - Regular security audits

## 🐛 Common Issues & Solutions

### Supabase Connection Error
```
Error: Your project's URL and Key are required to create a Supabase client!
```
**Solution**: Verify env vars are set. Check `.env.development.local` exists with correct values.

### AI API Not Responding
```
Error: ANTHROPIC_API_KEY not found
```
**Solution**: Ensure ANTHROPIC_API_KEY is set in Vercel environment variables or `.env`.

### Profile Not Created on Signup
**Solution**: Verify trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Charts Not Rendering
**Solution**: Check browser console for errors. Ensure Recharts is installed:
```bash
pnpm add recharts
```

## 📞 Support & Troubleshooting

### Logs Location
- **Build**: Vercel Dashboard → Deployments
- **Runtime**: Vercel Dashboard → Functions (for serverless errors)
- **Database**: Supabase Dashboard → Logs → Query Performance

### Debug Mode
Set in Vercel environment:
```
DEBUG=bhu-darpan:*
LOG_LEVEL=debug
```

### Performance Issues
Check:
1. Database query times (Supabase Logs)
2. API response times (Network tab in DevTools)
3. Next.js build size: `pnpm analyze`
4. Core Web Vitals: PageSpeed Insights

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Deployment](https://supabase.com/docs/guides/hosting/overview)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Docker Deployment](https://docs.docker.com/language/nodejs/)

## 🎯 Next Steps

1. Clone this repository
2. Set up Supabase project (if not already done)
3. Configure environment variables
4. Run `pnpm install && pnpm build`
5. Deploy using Vercel, Docker, or your preferred platform
6. Test all user flows
7. Monitor and maintain

---

**Deployment Date**: [Your deployment date]
**Version**: 1.0.0
**Status**: Ready for Production
