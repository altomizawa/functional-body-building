# KOR FBB - AI Agent Instructions

## Project Overview

**KOR FBB** is a Next.js-based gym management system for tracking workouts, movements, and user progress with role-based authentication (admin/user). It uses MongoDB (Mongoose) for persistence and JWT for session management.

**Key Stack:**
- Next.js 15 with App Router (Turbopack for dev)
- React 18, Tailwind CSS, Radix UI components
- MongoDB + Mongoose with custom models
- JWT-based authentication (jose library)
- Server Actions as primary data mutation pattern

---

## Architecture & Data Flow

### 1. **Authentication Layer** (`lib/session.js`, `lib/auth.js`)

- **Session Model:** JWT token stored in httpOnly cookies, encrypted with HS256
- **Key Functions:**
  - `verifySession()` → Server Components/Actions → redirects if no session
  - `verifySessionForRequests()` → API routes → returns null if no session
  - `createSession(user)` → Sets encrypted JWT cookie with 7-day expiration
  
- **Pattern:** Always check session before database operations. Use `CustomError` class with status codes for error handling.

### 2. **Data Models** (`models/`)

**User Schema:**
- `name`, `email`, `password` (bcrypt hashed, saltRounds: 10)
- `role: enum['user', 'admin']` → Always check this for authorization
- `status: enum['active', 'inactive', 'expired']`
- `completed[]` → Array of `{pillarId, completedAt}` for tracking workout completion
- Includes `resetToken`, `TwoFAToken` for account recovery flows

**Other Models:** Movement, Workout, Pillar (referenced in README, check `/models` for schema)

### 3. **Server Actions Pattern** (`lib/actions.js`, `lib/workoutActions.js`, `lib/movementActions.js`)

All data mutations use Server Actions (`'use server'` directive):
- Import `connectDB()` at start
- Check session with `verifySession()` or `verifySessionForRequests()`
- Throw `CustomError(message, statusCode)` for errors
- Use `revalidatePath()` after mutations to sync client cache

**Example:** `updateProfile(userId, userData)` in `lib/actions.js`

### 4. **API Routes vs Server Actions**

- **API Routes:** Used for specific external requests (e.g., `GET /api/movements` returns all movements unfiltered for form dropdowns)
- **Server Actions:** Preferred for authenticated mutations and protected data reads
- **Note:** Some API routes have commented-out session checks—follow actual logic in file, not aspirational code

---

## Project-Specific Patterns

### **Error Handling**

```javascript
// CustomError class usage
import CustomError from '@/lib/error';

if (!userId) throw new CustomError("User ID is required", 400);
// Returns { success: false, error: "...", status: 400 }
```

### **Role-Based Authorization**

Always check `session.user.role` before admin operations:
```javascript
if (user.role !== "admin") {
  throw new CustomError("You do not have permission", 403)
}
```

### **Naming Conventions**

- **Files:** camelCase (e.g., `movementActions.js`, `workoutActions.js`)
- **Functions:** camelCase, export Server Actions explicitly
- **Components:** PascalCase (e.g., `AddNewWorkoutForm.js`, `DeletePopup.jsx`)
- **Database fields:** camelCase, use `lowercase: true` for emails/names in schemas

### **UI Component Library**

- **Form inputs:** Use Radix UI primitives from `components/ui/` (input, label, select, textarea)
- **Styling:** Tailwind CSS with `cn()` utility from `lib/utils.js` for class merging
- **Toast notifications:** Via `useToast()` hook from `contexts/useToast.jsx`

### **Directory Structure Semantics**

- `app/api/` → API routes (GET/POST handlers)
- `app/dashboard/` → Protected routes requiring `verifySession()`
- `components/` → UI components, organized by domain (form/, header/, workout/, etc.)
- `lib/` → Business logic (Server Actions, auth, database helpers)
- `models/` → Mongoose schemas
- `contexts/` → React Context providers (Toast)
- `hooks/` → Custom React hooks (useUser, useToast)

---

## Critical Developer Workflows

### **Running the Project**

```bash
npm run dev           # Starts Next.js with Turbopack (http://localhost:3000)
npm run build         # Production build
npm start             # Run production server
npm run lint          # Run ESLint
```

### **Database Connection**

- **Connection:** `lib/database/db.js` → Connects to MongoDB database named `"functional_bodybuilding"`
- **Required Env:** `MONGODB_URI` (MongoDB connection string)
- **Required Env:** `JWT_SECRET` (for session encryption)

All Server Actions must call `await connectDB()` before database operations.

### **Adding New Features**

1. **New endpoint:** Create Server Action in `lib/*Actions.js`, add auth checks
2. **Database changes:** Update model in `models/`, use Mongoose `.populate()` for relationships
3. **Protected page:** Use `verifySession()` at top of Server Component
4. **Form submission:** Use `<form action={serverAction}>` or Client Component with `startTransition`

---

## Integration Points & Communication

### **Workout Tracking Flow**

- User completes workout → `MarkCompleteWorkoutButton` → Server Action → Updates `User.completed[]`
- Dashboard queries completed workouts via `User.populate('completed.pillarId')`

### **User Management (Admin)**

- Admin views users via `getAllUsers()` (checks role)
- Can modify via `modifyUser()` → Updates User model → `revalidatePath('/dashboard/users')`

### **Movement CRUD**

- GET `/api/movements` → List all (for dropdown forms)
- POST `/api/movements` → Create via Server Action (checks session)

---

## Common Pitfalls to Avoid

1. **Forgetting `'use server'`** in Server Actions or database connection files
2. **Not checking user role** before admin operations
3. **Using `verifySession()` in API routes** → Use `verifySessionForRequests()` instead (doesn't redirect)
4. **Missing `revalidatePath()`** after mutations → Stale data in UI
5. **Not hashing passwords** with bcrypt before saving User
6. **Middleware sync:** `middleware.js` calls `updateSession()` from `lib/session.js` — keep in sync

---

## Key Files to Reference

| Purpose | File |
|---------|------|
| Auth logic | [lib/auth.js](lib/auth.js#L1) |
| Server Actions (User) | [lib/actions.js](lib/actions.js#L1) |
| Session management | [lib/session.js](lib/session.js#L1) |
| Custom errors | [lib/error.js](lib/error.js#L1) |
| User model | [models/User.js](models/User.js#L1) |
| API pattern | [app/api/movements/route.js](app/api/movements/route.js#L1) |
| Protected layout | [app/layout.js](app/layout.js#L1) |
