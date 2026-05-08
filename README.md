# TravelForm — Digital Travel Requisitions

A Next.js web application that digitises corporate travel request forms. Staff members fill in trip details online and submit them for approval. Finance managers and final approvers can then review and action requests through a structured two-stage workflow.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [How the App Works](#how-the-app-works)
  - [Login](#login)
  - [Submitter Flow](#submitter-flow)
  - [Approver Flow](#approver-flow)
- [Approval Workflow](#approval-workflow)
- [Form Sections](#form-sections)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Persistence](#data-persistence)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If port 3000 is in use, Next.js will automatically pick the next available port (e.g. 3001).

---

## Demo Accounts

All accounts use the password `pass123`. You can click any account on the login screen to auto-fill the credentials.

| Username | Name | Role |
|---|---|---|
| `john.doe` | John Doe | Staff (Submitter) |
| `jane.smith` | Jane Smith | Staff (Submitter) |
| `sarah.mgr` | Sarah Johnson | Finance Manager (Approver) |
| `admin.final` | Michael Peters | Final Approver |

---

## How the App Works

### Login

Navigate to `/login`. Enter a username and password, or click one of the demo accounts listed on the page. After signing in:

- **Staff accounts** are redirected to their personal dashboard at `/dashboard`
- **Approver accounts** are redirected to the approvals dashboard at `/approvals`

Your session is stored in `localStorage` and persists across page refreshes. Click **Logout** in the navigation bar to end your session.

---

### Submitter Flow

#### Dashboard (`/dashboard`)

After logging in as a staff member you land on your personal dashboard. It shows:

- **Stats cards** — a quick count of your total forms, drafts, forms in progress, and approved forms
- **My Travel Requests table** — all forms you have submitted, with their current status and last-updated date
- **New Travel Request** button — starts a fresh form

You can **delete** any form that is still in Draft status. Once submitted, a form is locked and can only be viewed.

#### Creating a New Form (`/forms/new`)

Click **New Travel Request**. A blank form opens with an auto-generated Trip Number and your name pre-filled. Fill in all the required sections (see [Form Sections](#form-sections) below).

Two actions are available at the top of the page:

- **Save Draft** — saves your progress to localStorage without submitting. You can come back and continue editing later.
- **Submit for Approval** — locks the form and sends it into the approval queue. The status changes to **Pending Approval**.

#### Viewing a Submitted Form (`/forms/[id]`)

Click **View** on any submitted form. The form opens in read-only mode. The **Approval Status** panel at the bottom shows the current stage in the workflow and a history of who has approved it so far.

Once a request reaches **Approved** status (both approval stages complete), a **Download PDF** button appears at the top of the form so users can export the full requisition details. The generated PDF includes a professional company-branded header and tabulated section data for easier review.

---

### Approver Flow

#### Approvals Dashboard (`/approvals`)

Approvers land here after login. The page has two tabs:

- **My Queue** — shows only the forms that are waiting for *your specific* action, highlighted with an orange left border. Finance Managers see forms with status `Pending Approval`. Final Approvers see forms with status `Finance Approved`.
- **All Forms** — shows every travel request in the system regardless of status, useful for auditing.

Stats cards at the top give a snapshot of the full pipeline.

#### Reviewing a Form

Click **Review & Action** on any form in your queue. The full form opens in read-only mode. Scroll to the **Section 4: Approval Status** panel at the bottom.

- **Approve** — records your name and a timestamp against the form and advances it to the next stage.
- **Reject** — prompts you to enter a written reason, then marks the form as Rejected and records who rejected it and why.

---

## Approval Workflow

Travel requests go through two mandatory approval stages:

```
Draft  →  Pending Approval  →  Finance Approved  →  Approved
                    ↘                    ↘
                       Rejected (at any stage)
```

| Status | Meaning |
|---|---|
| **Draft** | Form saved but not yet submitted by the staff member |
| **Pending Approval** | Submitted and waiting for the Finance Manager |
| **Finance Approved** | Finance Manager has approved; waiting for the Final Approver |
| **Approved** | Both stages approved — travel request is confirmed |
| **Rejected** | Rejected by either approver; reason is recorded on the form |

The approval panel shows a visual step-by-step timeline so both submitters and approvers can see exactly where a form is in the process.

---

## Form Sections

### Section 1 — Application Information

| Field | Type |
|---|---|
| Trip No. | Auto-generated (read-only) |
| Name of Applicant | Auto-filled from session (read-only) |
| Travel From Date | Date picker |
| Travel To Date | Date picker |
| Purpose of Travel | Text area |
| Cost Code | Text input |

### Section 2 — Reservations

All sub-sections support **dynamic lists** — you can add as many entries as needed using the "Add" button, and remove individual entries with the "Remove" link.

#### 2.1 Flights (Economy Class)

Each flight entry includes:

| Field | Notes |
|---|---|
| Date | Date of the flight |
| From | Departure airport/city (e.g. JHB) |
| To | Arrival airport/city (e.g. CPT) |
| Departure Time | Time picker |
| Arrival Time | Time picker |
| Flight No. | e.g. FA101 |
| Priority Pass | Checkbox |
| Window Seat | Checkbox |

> **Note:** Business class and upgrade requests require additional management approval.

#### 2.2 Hotel Accommodation

Each hotel entry includes:

| Field | Notes |
|---|---|
| Date In | Check-in date |
| Date Out | Check-out date |
| Location | City |
| Hotel Name & Details | Full hotel name |
| Board Basis | e.g. B&B, Room Only |
| Estimated Cost (ZAR) | Numeric |

#### 2.3 Car Hire

Each car hire entry includes:

| Field |
|---|
| Pick-up Date |
| Drop-off Date |
| Location |

> **Note:** Flights should be kept flexible to allow changes if needed.

#### 2.4 Shuttle Services (Transfer)

Each shuttle entry includes:

| Field |
|---|
| Pick-up Date |
| Shuttle Company |
| Pick-up Address |
| Drop-off Address |
| Mobile Number |

### Section 3 — Daily Allowances

| Sub-section | Fields |
|---|---|
| International Travel | Nights away from home, Amount (ZAR) |
| Local Travel | Nights away from home, S&T Amount (ZAR) |

### Section 4 — Approval Status

System-managed. Displays the approval timeline, approval history (who approved and when), and the action panel for approvers. Not editable by the submitter.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | React framework, routing, server rendering |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling |
| **React Hook Form** | Form state management (available for extension) |
| **Zod** | Schema validation (available for extension) |
| **localStorage** | Mock persistence — no backend required |

### Theme Colours

| Colour | Hex | Usage |
|---|---|---|
| Navy Blue | `#1E3A5F` | Primary brand colour, headings, nav |
| Orange | `#F97316` | CTAs, highlights, logo accent |
| Mustard Yellow | `#EAB308` | Pending status, warning notes |

---

## Project Structure

```
travel-form-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with Navbar
│   │   ├── page.tsx                # Root redirect (login or dashboard)
│   │   ├── globals.css             # Global styles and CSS variables
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Submitter dashboard
│   │   ├── forms/
│   │   │   ├── new/page.tsx        # New travel form
│   │   │   └── [id]/page.tsx       # View/edit existing form
│   │   └── approvals/
│   │       └── page.tsx            # Approver dashboard
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── TravelFormEditor.tsx    # Main form editor (shared by /new and /[id])
│   │   ├── ApprovalPanel.tsx       # Section 4 approval actions and timeline
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Reusable button (variants: primary, secondary, danger, ghost, outline)
│   │   │   ├── Input.tsx           # Input and TextArea components
│   │   │   ├── Badge.tsx           # StatusBadge component
│   │   │   └── Card.tsx            # Card, CardHeader, CardBody, SectionCard
│   │   └── form-sections/
│   │       ├── ApplicationInfo.tsx # Section 1
│   │       ├── Flights.tsx         # Section 2.1 — dynamic list
│   │       ├── Hotel.tsx           # Section 2.2 — dynamic list
│   │       ├── CarHire.tsx         # Section 2.3 — dynamic list
│   │       ├── ShuttleServices.tsx # Section 2.4 — dynamic list
│   │       └── DailyAllowances.tsx # Section 3
│   ├── lib/
│   │   ├── auth.ts                 # Login/logout helpers
│   │   ├── mock-data.ts            # Hardcoded users and seed forms
│   │   └── store.ts                # localStorage CRUD helpers
│   └── types/
│       └── travel-form.ts          # All TypeScript interfaces and types
└── package.json
```

---

## Data Persistence

All data is stored in the browser's `localStorage` under two keys:

- `travel_forms` — the array of all travel form objects
- `travel_session` — the currently logged-in user's session

On first load, three seed travel forms are automatically inserted so you can see the app populated with data straight away (one Pending, one Finance Approved, one Draft). Clearing your browser's localStorage will reset the app to this initial state.

Because there is no backend, data is **per-browser and per-device**. This is intentional — the app is designed as a fully functional prototype that can be extended with a real API layer when needed.
