# Bhu-Darpan Climate Intelligence Platform

A comprehensive climate monitoring and AI-powered analysis platform for India built with Next.js 16, Supabase, and Claude AI.

## 🌍 Overview

Bhu-Darpan ("Earth's Mirror") is a mission-control styled climate intelligence platform that integrates real-time environmental data from multiple Indian government agencies and provides AI-powered climate scenario modeling and analysis.

### Key Features

- **Real-time Climate Monitoring** - Track temperature, humidity, air quality, and water levels across India
- **AI-Powered Scenario Modeling** - Use Claude AI to simulate climate scenarios and predict impacts
- **Multi-source Data Integration** - IMD (Indian Meteorological Department), CWC (Central Water Commission), CPCB (Central Pollution Control Board), Bhuvan (ISRO)
- **Role-Based Access Control** - Citizen, Analyst, and Admin roles with different capabilities
- **Mission Control Interface** - Beautiful dark-themed dashboard with real-time status indicators
- **Data Visualization** - Interactive charts and maps showing climate trends
- **Audit Logging** - Complete activity tracking for compliance and monitoring

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Authentication**: Supabase Auth with email/password
- **AI**: Claude 3.5 Sonnet via Vercel AI SDK
- **Charts**: Recharts for data visualization
- **UI Components**: shadcn/ui with custom Tailwind styling

### Database Schema

```
profiles (id, email, first_name, last_name, role)
├── citizen, analyst, admin roles
└── Automatic creation on user signup

locations (id, name, latitude, longitude, type)
└── Monitoring stations across India

data_sources (id, name, type, status)
└── IMD, CWC, CPCB, Bhuvan

climate_readings (id, location_id, temperature, humidity, aqi, pm25, created_at)
└── Time-series environmental data

scenarios (id, creator_id, title, scenario_type, parameters, results, status)
└── AI-modeled climate scenarios

access_logs (id, user_id, action, resource, created_at)
└── Audit trail for all user actions
```

## 📁 Project Structure

```
app/
├── page.tsx                    # Home/Dashboard (citizen role)
├── layout.tsx                  # Root layout with theme
├── auth/
│   ├── login/page.tsx         # Email/password login
│   ├── sign-up/page.tsx       # User registration
│   ├── sign-up-success/page.tsx # Post-signup confirmation
│   ├── error/page.tsx         # Error page
│   └── callback/route.ts      # OAuth callback (if configured)
├── dashboard/
│   ├── analyst/page.tsx       # Data ingestion & validation
│   └── admin/page.tsx         # User management & settings
├── admin/
│   └── moderation/page.tsx    # Data quality & moderation tools
├── mission-control/page.tsx   # Real-time monitoring command center
├── scenarios/page.tsx         # AI scenario library
└── api/
    └── scenarios/route.ts     # AI scenario modeling API

components/
├── dashboard/
│   ├── header.tsx             # Top navigation with user info
│   ├── stats-grid.tsx         # KPI cards
│   ├── climate-charts.tsx     # Temperature/AQI/location charts
│   ├── climate-map.tsx        # Geographic data display
│   ├── scenario-simulator.tsx # AI scenario interface
│   └── ...
└── ui/                        # shadcn/ui components

lib/
├── supabase/
│   ├── server.ts              # Server-side Supabase client
│   ├── client.ts              # Client-side Supabase client
│   ├── proxy.ts               # Middleware session management
│   └── profile.ts             # Profile utilities
├── roles.ts                   # RBAC utilities
└── utils.ts                   # Helper functions

styles/
├── globals.css                # Global styles & design tokens
```

## 🎨 Design System

### Color Palette (Mission Control Aesthetic)

- **Background**: Deep black (#000000)
- **Primary**: Cyan/Teal (#00D9FF)
- **Secondary**: Darker cyan accents
- **Neutral**: Grays for text
- **Accent**: Gradient effects

### Typography

- **Headings**: Geist (Modern, sans-serif)
- **Body**: System default (clear, readable)
- **Monospace**: For data display

### Components

All UI components use shadcn/ui with Tailwind CSS:
- Cards, Inputs, Labels, Buttons (with custom styling)
- Charts (Recharts with dark theme)
- Forms with validation
- Responsive layouts (mobile-first design)

## 🔐 Authentication & Authorization

### Login Flow

1. User navigates to `/auth/login`
2. Enters email and password
3. Supabase validates credentials
4. User profile retrieved from `profiles` table
5. Redirects to home dashboard `/`
6. Header shows user name and role

### Signup Flow

1. User navigates to `/auth/sign-up`
2. Enters first name, last name, email, password
3. Password validation (must match repeat)
4. Supabase creates auth user
5. Database trigger creates profile with role='citizen'
6. Redirects to `/auth/sign-up-success`
7. User can then login

### Role-Based Access

```typescript
// From lib/roles.ts
isAdmin(role) → bool
isAnalyst(role) → bool  
isCitizen(role) → bool
canAccessFeature(role, feature) → bool
```

Routes are protected by:
- Server-side checks in page components
- Middleware redirects to `/auth/login` for unauthenticated users
- Client-side UI visibility based on role

## 📊 Pages & Features

### Public Pages
- `/auth/login` - Login form
- `/auth/sign-up` - Registration form
- `/auth/error` - Error display

### Protected Pages

#### Citizen Dashboard (`/`)
- Real-time climate stats (4 data sources, N monitoring locations)
- 24-hour temperature & humidity trends chart
- Air quality index and particulates chart
- Location comparison bar chart
- Climate data map showing readings by region
- Scenario modeling launch button
- Analytics deep-dive access
- Data sources overview

#### Scenarios Library (`/scenarios`)
- Browse saved scenario simulations
- Filter by type, date, creator
- View AI analysis and recommendations
- Export reports

#### Mission Control (`/mission-control`)
- Real-time environmental monitoring command center
- Critical alerts dashboard
- Regional status indicators
- System health monitoring (CPU, memory, database, network)
- Recent events log with severity
- Emergency protocols section

#### Analyst Dashboard (`/dashboard/analyst`)
- Data ingestion workflow
- Validation queue for new readings
- Quality metrics and statistics
- Anomaly detection alerts
- Data source integration status

#### Admin Dashboard (`/dashboard/admin`)
- User management
- Role assignments
- System settings
- View audit logs

#### Admin Moderation (`/admin/moderation`)
- Data quality validation tools
- Pending submissions review
- Flagged anomalies dashboard
- Contributor reputation system
- Accuracy metrics

## 🤖 AI Scenario Modeling

### How It Works

1. User selects scenario type from template (Heat Wave, Monsoon, Drought, Flood)
2. Sets intensity (0-100) and duration (days)
3. Specifies affected region
4. Claude AI analyzes the scenario with context:
   - Impact analysis
   - Affected sectors (agriculture, water, health, infrastructure)
   - Vulnerable populations
   - Mitigation strategies
   - Early warning signals

### API Endpoint

```
POST /api/scenarios

Request:
{
  title: string
  description: string
  scenario_type: 'temperature_rise' | 'extreme_weather' | 'drought' | 'flood' | 'custom'
  parameters: {
    intensity: number (0-100)
    duration: number (days)
    affectedRegion: string
    baselineData?: { temperature, humidity, rainfall }
  }
}

Response:
{
  scenario_id: string
  analysis: string (AI-generated analysis)
  impactedRegions: number
  affectedPopulation: string
  severity: 'Moderate' | 'High' | 'Critical'
  confidence: number (0-100)
  recommendations: string[]
  generatedAt: ISO8601 timestamp
}
```

Results are stored in `scenarios` table for later retrieval.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase project
- Anthropic API key (for Claude)
- Vercel AI Gateway (optional, for model routing)

### Setup

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd bhu-darpan-climate-platform
   pnpm install
   ```

2. **Environment Variables**
   Create `.env.development.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ANTHROPIC_API_KEY=<your-anthropic-key>
   ```

3. **Database Setup**
   - Create Supabase project
   - Run migrations (in `supabase/migrations/`)
   - Seed sample data

4. **Run Dev Server**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

### Testing

1. Sign up with email: `test@example.com`
2. Password: `Test123!`
3. Login to see dashboard
4. Try scenario modeling
5. Switch to admin view (needs role change)

## 📱 Responsive Design

- **Mobile** (< 768px): Single column, stacked cards
- **Tablet** (768px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-4 column layouts
- **All charts**: Responsive containers
- **Navigation**: Fixed header, always accessible

## ♿ Accessibility

- Semantic HTML (`main`, `header`, `section`)
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1
- Focus indicators on buttons
- Alt text on images

## 🔧 Customization

### Change Color Theme

Edit `globals.css`:
```css
@theme inline {
  --color-primary: #00D9FF;
  --color-background: #000000;
  /* ... */
}
```

### Add New Dashboard Cards

1. Create component in `components/dashboard/`
2. Import in page
3. Add to grid layout

### Extend AI Prompting

Modify scenario prompt in `/api/scenarios/route.ts`:
```typescript
const prompt = `You are a climate science expert...`
```

## 📈 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Environment variables are automatically set from Vercel project settings.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🐛 Troubleshooting

### Login Redirect Loop
- Check Supabase URL and anon key in env vars
- Verify profile trigger is created in database

### Scenario API Not Working
- Ensure ANTHROPIC_API_KEY is set
- Check Claude API rate limits
- Verify Supabase scenarios table exists

### Styling Issues
- Clear `.next` directory: `rm -rf .next`
- Rebuild: `pnpm build`
- Check Tailwind CSS config

## 📚 Additional Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 License

Confidential - Bhu-Darpan Climate Intelligence Platform

## 🤝 Support

For issues and questions, contact the development team.

---

**Last Updated**: July 1, 2026
**Version**: 1.0.0
**Status**: Production Ready
