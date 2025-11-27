# Futurescape Lunch Tracker 🍽️

A beautiful, fun, and modern web application for tracking office lunch updates at Futurescape.

## Features

- 🍔 **Employee Login System** - Unique Employee ID and Passcode authentication
- 👨‍💼 **Admin Dashboard** - Create and manage employees
- ✅ **Lunch Status Updates** - Employees can mark if they brought lunch or not
- 💬 **Food Request System** - Employees can specify what they want to order
- 📱 **Real-time Feed** - WhatsApp-style chat feed showing who needs lunch
- 🎨 **Beautiful Animations** - Flying burgers, floating pizza, and more!
- 📱 **Fully Responsive** - Works perfectly on all devices

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **Framer Motion**
- **Prisma** + **SQLite**
- **NextAuth** for authentication
- **ShadCN UI** components

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Create an admin user:
```bash
node scripts/setup-db.js
```

**Default Admin Credentials:**
- Employee ID: `ADMIN001`
- Passcode: `admin123`

⚠️ **Important:** Change the passcode after first login!

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard
│   ├── dashboard/    # Employee dashboard
│   ├── feed/         # Lunch feed page
│   ├── login/        # Login page
│   └── layout.tsx    # Root layout
├── components/       # Reusable components
├── lib/              # Utilities and configs
├── prisma/           # Database schema
└── types/            # TypeScript types
```

## User Roles

### Admin
- Create employees with unique Employee ID and Passcode
- View all employee lunch updates
- Delete employees
- Access real-time lunch feed

### Employee
- Login with Employee ID and Passcode
- Update lunch status (brought/didn't bring)
- Add food request when not bringing lunch
- View personal lunch history
- View public lunch feed

## Deployment to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free tier works)
3. Vercel Postgres database (free tier available)

### Steps

1. **Push code to GitHub** (see below)

2. **Create Vercel Postgres Database:**
   - Go to Vercel Dashboard
   - Navigate to Storage → Create Database → Postgres
   - Create a new Postgres database
   - Copy the `DATABASE_URL` connection string

3. **Deploy to Vercel:**
   - Import your GitHub repository in Vercel
   - Add environment variables:
     - `DATABASE_URL`: Your Vercel Postgres connection string
     - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`)
     - `NEXTAUTH_SECRET`: Generate a secure random string (min 32 characters)
       ```bash
       openssl rand -base64 32
       ```
   - Click Deploy

4. **Run Database Migrations:**
   - After deployment, go to Vercel Dashboard → Your Project → Storage
   - Open the database and run:
     ```bash
     npx prisma db push
     ```
   - Or use Vercel CLI:
     ```bash
     vercel env pull
     npx prisma db push
     ```

5. **Create Admin User:**
   - After deployment, you can create admin via script or manually
   - Use the deployed app's API or run locally with production DATABASE_URL

### Important Notes:
- ✅ All employee data (ID, password, lunch updates) are saved in PostgreSQL
- ✅ Data persists across deployments
- ✅ Real-time updates work automatically (5-second refresh interval)
- ✅ Employee IDs auto-generate (01, 02, 03...)
- ✅ Admin can see all messages, employees see last 2 days only

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client

## License

Private project for Futurescape office use.

