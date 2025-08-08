# Mission Risk Profile (MRP) Planner

A comprehensive web application for the Philippine Air Force Flying School (101st Pilot Training Squadron) to conduct T-41 Operational Risk Management assessments.

## Features

- **Card-based Interface**: Smooth, modern UI with card transitions for optimal user experience
- **Comprehensive Risk Assessment**: 29 questions across 4 categories (Mission, Environment, Human Factor, Aircraft)
- **Dual-Pilot Support**: Individual and shared question types for PIC (Pilot-in-Command) and CP (Co-Pilot)
- **Automatic Scoring**: Real-time MRP score calculation and MDA (Mission Decision Authority) determination
- **Document Generation**: Exports to Microsoft Word format using template placeholder replacement
- **Email Distribution**: Optional email delivery to PIC and user addresses
- **Progress Tracking**: Visual progress indicator and navigation system
- **Risk Override**: Users can override risk scores for any question

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with modern design system
- **Language**: TypeScript for type safety
- **Forms**: React Hook Form with Zod validation
- **Document Generation**: docxtemplater for Word document creation
- **Email Service**: Resend API for email delivery
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Resend API key (for email functionality)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mission-risk-profile
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your Resend API key:

```
RESEND_API_KEY=your_resend_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Authentication

The application uses hardcoded credentials for security:

- **Username**: `wildcats`
- **Password**: `p!lotTrainingSqdn101`

## MRP Scoring System

- **Green**: 0 points (Low risk)
- **Yellow**: 1 point (Medium risk)
- **Red**: 2 points (High risk)

### MDA (Mission Decision Authority) Levels

- **0-8 points**: PIC (Pilot-in-Command)
- **9-15 points**: SUP (Duty Supervisor)
- **16-20 points**: SC (Squadron Commander)
- **>20 points**: CMDT (Commandant)

## Question Categories

1. **Mission**: Short notice changes, unfamiliar airfields, area assignments, test flights, lessons
2. **Environment**: Weather conditions, clouds, temperature, wind, visibility, runway conditions
3. **Human Factor**: Pilot experience, sorties flown, sleep cycle, personal factors, fatigue, stress
4. **Aircraft**: Aircraft type/model familiarity, collision risk, previous discrepancies

## Template System

The application uses a Word document template located in `/templates/mrp_template.docx`. Placeholders in the template are automatically replaced with user inputs and calculated values.

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Set the `RESEND_API_KEY` environment variable in Vercel
4. Deploy

## Project Structure

```
mission-risk-profile/
├── components/          # Reusable UI components
│   ├── forms/          # Form-specific components
│   ├── navigation/     # Navigation components
│   └── ui/            # Basic UI components
├── data/              # Static data and questions
├── lib/               # Utility functions and services
├── src/app/           # Next.js app directory
│   ├── api/          # API routes
│   ├── login/        # Authentication page
│   └── questionnaire/ # Main application
├── templates/         # Word document templates
└── types/            # TypeScript type definitions
```

## Contributing

This is a specialized application for military training purposes. Please follow the existing code patterns and maintain the security standards.

## License

Proprietary - Philippine Air Force Flying School (101st Pilot Training Squadron)
