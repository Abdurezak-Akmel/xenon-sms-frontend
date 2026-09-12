## PROMPT FOR VERCEL v0: XENON_SMS FULL IMPLEMENTATION

### Project Overview

**Project Name:** Xenon_SMS (School Management System)
**Type:** Multi-tenant Cloud SaaS / School ERP Platform
**Objective:** Generate a complete Next.js 14+ frontend application for a comprehensive school management system that serves all stakeholders in educational institutions.

⚠️ IMPORTANT: Please focus ONLY on the frontend. Do not build backend logic, database connections, or authentication systems. Use mock data and placeholder functions for all backend interactions.

### Core System Requirements

#### 1. Architecture & Foundation

- Build using Next.js 14+ with App Router
- Use Tailwind CSS with Shadcn/ui components
- Implement a multi-tenant architecture where each school/institution has isolated data
- Create a role-based access control (RBAC) system with 10+ distinct user roles
- Ensure all pages are mobile-responsive and accessible (WCAG 2.1 Level AA)
- Implement light/dark mode toggle

#### 2. Authentication & User Management

- **Public Pages (No Auth Required):**
  - Landing page with product overview, features, and pricing (pricing will vary by school and will be per user rate)
  - Registration page for new schools/tenants
  - Login page with role selection
  - Forgot password page with time-limited reset mechanism
- **Authentication Features:**
  - MFA mandatory for Super-Admin and School-Admin roles
  - Secure session handling with expiration and revocation
  - Role-based redirection after login
  - Password reset using time-limited, single-use tokens
  - Rate limiting on authentication endpoints

#### 3. Role-Based Dashboards & Navigation

Create separate dashboards with side navigation bars for each role. Organize code with each role's pages in dedicated folders. Use the following role structure:

**Platform Level Roles:**

- **Super-Admin:** Full platform oversight, tenant management, subscription administration, system health monitoring. Super-admin won't have access to school specific data, but will have access to school metrics and similar system administration related data

**Tenant Level Roles:**

- **School-Admin:** Full tenant administration, user/role management, oversight of all modules
- **Teacher:** Classroom tools, attendance, lesson planning, grading, communication
- **Student:** Personal schedule, resources, assignments, grades, attendance, events
- **Parent/Guardian:** Child progress tracking, fee notices, communication
- **Cashier/Receptionist:** Fee collection, transaction entry, receipts, visitor registration
- **Librarian:** Catalog management, circulation, fines
- **Lab Assistant:** Equipment checkout, consumables management, maintenance
- **Janitor/Facilities:** Maintenance tickets, cleaning schedules, service requests
- **Gate Keeper/Security:** Entry/exit logs, visitor records, pass issuance

**Navigation Requirements:**

- Sidebar navigation adapts based on role
- Navigation items grouped by module (Platform, People, Academic, Finance, Operations, Communication, Reports)
- Quick access to frequently used features
- User profile with role indicator
- Tenant switcher for multi-tenant users

**Mock User Data:**
Create a mock data file with sample users for each role with credentials:

- super-admin@xenon.com / password123
- admin@school1.com / password123
- teacher@school1.com / password123
- student@school1.com / password123
- parent@school1.com / password123
- (Include all other roles with similar patterns)

### Detailed Module Implementation

#### Module A: Platform Administration (Super-Admin Only)

**A1. Platform Dashboard (`/platform/dashboard`)**

- Metrics cards: Total Tenants, Active Users, Subscription Revenue, System Health Score
- Recent tenant activity feed
- System performance charts
- Alert/warning notifications for system issues

**A2. Tenant Management (`/platform/tenants`)**

- List view with search, filter, sort, pagination
- Columns: Tenant Name, Status (Active/Suspended), Users Count, Subscription Plan, Created Date
- Quick actions: View Details, Suspend/Activate, Manage Subscription
- Ability to create new tenant with onboarding wizard

**A3. Tenant Detail (`/platform/tenants/[tenantId]`)**

- Tabs: Overview, Subscription, Users, Usage Statistics, Settings
- Overview: Tenant configuration, contact info, key metrics
- Subscription: Current plan, billing cycle, invoice history, manual settlement recording
- Users: List of tenant users with roles and status
- Usage: Charts showing active users, storage usage, feature usage
- Settings: Tenant-specific configurations
- Emergency break-glass access (audited)

**A4. Platform Settings (`/platform/settings`)**

- System-wide configurations
- Default billing models
- Integration management (email, SMS, push providers)
- Notification templates
- Security policies (MFA requirements, session timeout)
- Backup/DR configuration monitoring

#### Module B: Tenant Administration & People Management

**B1. Tenant Dashboard (`/dashboard`)**

- Role-aware landing page with personalized metrics
- **For School-Admin:** School overview, financial summary, pending tasks, announcements
- **For Teachers:** Today's schedule, upcoming deadlines, class attendance summary
- **For Students:** Schedule, upcoming exams, recent grades, announcements
- **For Parents:** Child attendance, fee status, recent academic updates
- **For Cashiers:** Today's collections, pending invoices, reconciliation summary
- **For Librarians:** Circulation stats, overdue items, popular books
- **For Janitors:** Pending maintenance requests, cleaning schedule
- **For Gate Keepers:** Today's visitors, entry/exit counts, pending passes

**B2. Student Management (`/people/students`)**

- **List View:**
  - Table with columns: Student ID, Name, Class, Guardian, Status, Actions
  - Advanced filters: Class, Status, Enrollment Date, Stream
  - Bulk actions: Export, Status Update, Enrollment
- **Student Registration (`/people/students/register`):**
  - Multi-step wizard:
    - Step 1: Personal Information (Name, DOB, Gender, Contact)
    - Step 2: Guardian/Parent Information
    - Step 3: Enrollment Details (Class, Section, Academic Period)
    - Step 4: Document Upload (Birth Certificate, Transcripts, Health Records)
    - Step 5: Review & Submit
  - Field validation with user-friendly messages
  - Document upload with preview
- **Student Profile (`/people/students/[studentId]`):**
  - Tabs: Personal Info, Academics, Fees, Attendance, Documents, History
  - Personal: Complete student profile with photo
  - Academics: Class history, grades, report cards
  - Fees: Invoice history, payment records, balance
  - Attendance: Calendar view with attendance patterns
  - Documents: All uploaded documents with access control
  - History: Enrollment changes, status changes, key events audit trail

**B3. Staff/Teacher Management (`/people/staff`, `/people/teachers`)**

- **List Views:** Similar to students with role-based filtering
- **Staff Profile (`/people/staff/[staffId]`):**
  - Employment Details: Contract, Salary, Department, Join Date
  - HR Information: Leave balance, attendance, performance records
  - Payroll History: Salary slips, deductions, tax information
  - (For Teachers): Course Assignments, Teaching Hours, Workload Analytics

**B4. Guardian/Parent Management (`/people/guardians`)**

- List of all guardians with linked students
- Communication history with each guardian
- Ability to manage relationships (add/remove student links)

**B5. Role & Permission Management (`/settings/roles`)**

- Configurable role definitions
- Permission matrix showing all modules and actions
- Create custom roles with specific permissions
- Assign roles to users
- Audit log of permission changes

#### Module C: Academic Operations

**C1. Academic Periods (`/academic/periods`)**

- Configure academic years, terms, semesters
- Set start/end dates, holidays, breaks
- Manage academic calendars

**C2. Classes & Scheduling (`/academic/classes`)**

- **Class Management:**
  - Create classes: Grade, Section, Stream, Academic Period
  - Set capacity, room, teacher assignment
  - Manage class roster
- **Schedule Management:**
  - Weekly/Monthly calendar view
  - Drag-and-drop scheduling
  - Conflict detection: Teacher conflicts, Room conflicts
  - Substitute teacher assignment with reasons
  - Schedule change history
  - Notify affected users on schedule changes

**C3. Attendance (`/academic/attendance`)**

- **Marking Attendance:**
  - Grid/table interface for class sessions
  - Quick mark all present with individual adjustments
  - States: Present, Absent, Late, Excused, Custom
  - Submit with confirmation
  - Support for batch operations
- **Attendance Analytics:**
  - Daily/Monthly summary reports
  - Charts: Trends, Patterns, Class comparisons
  - At-risk identification: High absenteeism, chronic lateness
  - Automated notifications for absentees (configurable)
- **Attendance Correction:**
  - Authorized correction workflow
  - Audit trail for all changes

**C4. Exams & Assessments (`/academic/exams`)**

- **Exam Setup:**
  - Create exam schedules: Date, Time, Duration, Venue
  - Define grading schemes: Percentage, Letter Grade, GPA, Competency-based
  - Configure assessment weights: Continuous Assessment (40%), Midterm (20%), Final (40%)
- **Score Entry:**
  - Teacher interface for entering marks
  - Support for continuous assessment, midterm, final
  - Bulk import option
  - Draft/Published states
- **Gradebook:**
  - Class/Subject grade view
  - Automatic calculation based on weighting rules
  - Individual student performance overview
  - Analytics: Class average, highest/lowest, distribution

**C5. Lesson Planning (`/academic/lesson-plans`)**

- **Teacher Interface:**
  - Create weekly/monthly lesson plans from templates
  - Link to curriculum targets
  - Upload resources, presentations, assignments
  - Submit for review
- **Supervisor Interface:**
  - Review submitted lesson plans
  - Comment, request changes, approve, reject
  - Track curriculum progress
  - Historical view of all lesson plans

**C6. Curriculum Tracking (`/academic/curriculum`)**

- Define curriculum targets by subject/class
- Track progress against targets
- Generate curriculum coverage reports
- Identify gaps in curriculum delivery

#### Module D: Financial Management

**D1. Fee Structure (`/finance/fees`)**

- Create fee items: Tuition, Registration, Library, Lab, Transport, Extracurricular
- Set amounts per academic period
- Define discounts, scholarships, waivers
- Configure due dates and payment schedules

**D2. Student Invoicing (`/finance/invoices`)**

- **Invoice Generation:**
  - Generate individual/class batch invoices
  - Configure invoice templates
  - View/Print invoices
- **Invoice Management:**
  - List view with filters: Student, Status, Date Range
  - Detailed invoice view with line items
  - Mark invoices as paid, partially paid, overdue
  - Email invoices to guardians

**D3. Payment Processing (`/finance/payments`)**

- **Payment Recording:**
  - Student search/lookup
  - View outstanding balance
  - Enter payment details: Amount, Method (Cash, Cheque, Bank Transfer), Reference
  - Attach supporting documents (e.g., deposit slip)
  - Generate unique receipt for each payment
- **Payment Management:**
  - Duplicate payment prevention
  - Partial payment handling
  - Payment history for each student
- **Refunds & Reversals:**
  - Authorized refund/reversal workflow
  - Retain original transaction records
  - Audit trail for all financial actions

**D4. Financial Reports (`/finance/reports`)**

- **Cash Register Summary:**
  - Opening balance, Receipts, Adjustments, Refunds, Closing balance
  - Daily/Monthly summaries
- **Revenue Reports:**
  - Revenue by fee type, class, period
  - Year-over-year comparison
- **Collections Reports:**
  - Outstanding balances by student/class
  - Aging analysis (30/60/90 days overdue)
  - Collection efficiency metrics
- **Reconciliation:**
  - Payment vs invoice matching
  - Bank reconciliation support

**D5. Financial Settings (`/finance/settings`)**

- Configure fiscal years
- Set financial periods (monthly/quarterly closure)
- Define currency and formatting preferences
- Configure automatic reminders for overdue payments

#### Module E: Human Resources & Payroll

**E1. Staff Management (`/hr/staff`)**

- Complete staff profiles with employment details
- Track leave balance, attendance, performance
- Manage contract renewals, promotions, resignations
- Staff directories and organizational charts

**E2. Payroll (`/hr/payroll`)**

- **Payroll Configuration:**
  - Salary components: Basic, Allowances, Deductions, Taxes
  - Configure tax brackets
  - Set leave policies, overtime rules
- **Payroll Run:**
  - Draft → Review → Approved → Finalized lifecycle
  - Import attendance/leave data
  - Calculate payroll with configured components
  - Generate payslips
- **Payroll Correction:**
  - Controlled correction workflow
  - Preserve finalized original records
  - Create correction/reversal entries
- **Payroll Reports:**
  - Payslip generation (PDF)
  - Payroll summary reports
  - Tax reports

**E3. Recruitment (`/hr/recruitment`)**

- **Vacancy Management:**
  - Create vacancies with job descriptions
  - Publish internally/externally
  - Close and archive positions
- **Applicant Tracking:**
  - Application submission with document upload
  - Manage applicant stages: New, Shortlisted, Interviewing, Offer, Hired, Rejected
  - Interview scheduling
  - Evaluation and decision recording
- **Talent Pipeline:**
  - Resume database
  - Candidate communications
  - Hiring analytics

**E4. Teacher Evaluation (`/hr/evaluations`)**

- **Evaluation Configuration:**
  - Create evaluation forms/rubrics
  - Define evaluation periods
  - Set evaluation sources: Admin, Peer, Student, Parent
- **Evaluation Management:**
  - Conduct evaluations
  - Multi-source feedback collection
  - Performance rating calculation
  - Longitudinal performance tracking
- **Evaluation Reports:**
  - Teacher performance summaries
  - Department/Subject performance comparisons
  - Professional development recommendations

#### Module F: Operations Management

**F1. Inventory & Resource Management (`/operations/inventory`)**

- **Asset Catalog:**
  - Computers, Equipment, Furniture, Sports kits
  - Categories, Location, Status
  - Barcode/QR code support
- **Checkout/Return:**
  - Record movements
  - Track custody and usage
  - Transfer, Loss, Damage recording
- **Maintenance:**
  - Track maintenance history
  - Schedule preventive maintenance
  - Manage service requests
- **Consumables:**
  - Set reorder thresholds
  - Low stock alerts
  - Consumption tracking

**F2. Library Operations (`/operations/library`)**

- **Catalog Management:**
  - Add books with identifier, title, author, category
  - Manage availability status
  - Search and discovery
- **Circulation:**
  - Checkout/Return for eligible borrowers
  - Borrowing limits and rules
  - Calculate/record overdue fines
- **Library Reports:**
  - Popular books, circulation statistics
  - Overdue items reports
  - User borrowing history
- **Audit Trail:**
  - All transactions logged
  - Borrower and item linked

**F3. Laboratory Operations (`/operations/laboratory`)**

- **Equipment Management:**
  - Catalog equipment and consumables
  - Track availability status
  - Checkout/Return for lab sessions
- **Lab Preparation:**
  - Session scheduling
  - Material/preparation tracking
- **Maintenance:**
  - Maintenance records
  - Out-of-service status tracking
- **Usage Reports:**
  - Equipment utilization
  - Consumable consumption

**F4. Facilities Management (`/operations/facilities`)**

- **Maintenance Requests:**
  - Create/Update service requests
  - Track status: New, Assigned, In Progress, Completed
  - Priority handling (High/Medium/Low)
- **Cleaning Schedules:**
  - Configurable schedules
  - Completion tracking
  - Checklist management
- **Facility Status:**
  - Room availability
  - Booking requests

**F5. Gate & Visitor Operations (`/operations/gate`)**

- **Visitor Management:**
  - Record entry/exit events
  - Visitor information: Name, Contact, Person/Reason for Visit
  - ID/Pass issuance
  - Check-in/Check-out
- **Tardiness Validation:**
  - Late arrival tracking
  - Pass issuance for late students
- **Access Logs:**
  - Complete visitor history
  - Filter by date, visitor, reason
  - Audit trail for all events

#### Module G: Communication & Events

**G1. Communication Engine (`/communication`)**

- **Direct Messaging:**
  - Send messages between authorized users
  - Relationship-based access
  - Attachments support
  - Message status tracking
- **Announcements:**
  - School-wide announcements
  - Targeted announcements by role/group
  - Schedule announcements
  - Read receipts tracking
- **Audience Management:**
  - Group creation (e.g., "Class 5 Parents", "All Teachers")
  - Role-based targeting
  - Broadcast limits and moderation
- **Message History:**
  - Search and filter messages
  - Delivery status (Sent, Delivered, Failed)
  - Audit trail of all communications

**G2. Event Management (`/events`)**

- **Calendar Views:**
  - Month/Week/Day/Agenda views
  - Academic terms, holidays, exams
  - Sports events, parent-teacher meetings
  - School-defined events
- **Event Management:**
  - Create, update, publish, cancel, archive events
  - Set event details: Date, Time, Location, Description
  - Recurring events support
- **RSVP & Participation:**
  - RSVP tracking
  - Participant registration
  - Event capacity management
- **Ticketing:**
  - Ticket/pass issuance for events
  - Ticket types and pricing
  - QR code generation for event entry

**G3. Notifications (`/notifications`)**

- **Notification Center:**
  - All notifications in one place
  - Read/Unread status
  - Filter by type: System, Academic, Financial, Attendance
- **Notification Preferences:**
  - Configure channels: Email, SMS, Push
  - Choose notification types to receive
  - Quiet hours configuration
- **Delivery Status:**
  - Track delivery attempts
  - Retry mechanism for failures
  - Audit trail of all notifications

#### Module H: Reporting & Analytics

**H1. Academic Reports (`/reports/academic`)**

- Report cards with grading periods
- Transcripts
- Subject/Class performance reports
- Class rankings and comparisons
- At-risk student identification
- Export: PDF, XLSX, CSV

**H2. Attendance Reports (`/reports/attendance`)**

- Daily/Monthly attendance summaries
- Student attendance patterns
- Class/Subject attendance analysis
- Lateness and absence trends
- Export: PDF, XLSX, CSV

**H3. Financial Reports (`/reports/financial`)**

- Detailed invoice summaries
- Collection reports by period/class
- Balance sheet for students
- Revenue analysis by fee type
- Export: PDF, XLSX, CSV

**H4. Workforce Reports (`/reports/workforce`)**

- Staff profile summaries
- Payroll summary reports
- Teaching hours analysis
- Staff performance summaries
- Recruitment analytics
- Export: PDF, XLSX, CSV

**H5. Operations Reports (`/reports/operations`)**

- Inventory status reports
- Library circulation reports
- Laboratory usage reports
- Facilities maintenance reports
- Visitor logs
- Export: PDF, XLSX, CSV

**H6. Platform Reports (`/reports/platform`)**

- Tenant count and growth
- Subscription status and revenue
- Platform usage analytics
- System health reports
- Audit reports

**H7. Custom Reports Builder**

- Select report type
- Configure parameters (Date Range, Filters, Grouping)
- Preview results
- Export with formatting options
- Save frequently used reports

#### Module I: Auditing & Compliance

**I1. Audit Trail (`/audit`)**

- **Audit Events:**
  - Authentication successes/failures
  - User creation, role/permission changes, activation/deactivation
  - Student enrollment, status, placement changes
  - Financial transactions, adjustments, refunds
  - Grade entry/publication/correction
  - Payroll finalization/correction
  - Schedule publication/change
  - Subscription plan, invoice, suspension changes
  - Administrative configuration changes
- **Audit Record Details:**
  - Event Type, Actor, Tenant, Target, Timestamp, Outcome
  - Correlation/Request ID
  - Immutable, tamper-resistant
- **Audit Search:**
  - Filter by actor, event type, date range, tenant
  - Full-text search
  - Export audit logs
- **Audit Reports:**
  - Security incident reports
  - Compliance reports
  - User activity reports

**I2. Compliance Settings (`/settings/compliance`)**

- Data retention policies by data category
- Privacy settings (GDPR, FERPA, local requirements)
- Consent management
- Data anonymization tools
- Data export/delete requests

#### Module J: Settings & Configuration

**J1. Tenant Settings (`/settings/tenant`)**

- Basic Information: Name, Address, Contact, Logo
- Academic Settings: School levels, grading systems
- Financial Settings: Currency, Tax, Financial Periods
- Communication Settings: Email/SMS/Notification providers
- Integration Settings: API keys, Webhooks
- User Management: Default roles, permissions, MFA requirements

**J2. Personal Settings (`/settings/profile`)**

- Profile Information: Name, Photo, Contact
- Security: Change Password, MFA Setup
- Preferences: Language, Timezone, Date/Number formats
- Notification Preferences: Channels, Types, Schedule
- Privacy Settings

**J3. System Configuration (`/settings/system`)**

- Security policies
- Backup/DR configuration
- Performance tuning
- Maintenance windows
- Feature flags

### Shared UI Components & Patterns

#### 1. Core Components

- **DataTable:** Advanced table with search, filter, sort, pagination, column visibility, export
- **Forms:** Input fields with validation, error messages, loading states, auto-save
- **Cards:** Summary cards with icons, trend indicators, clickable areas
- **Charts:** Bar, Line, Pie, Donut charts with interactive tooltips (use Recharts or Chart.js)
- **Calendar:** Full calendar integration with event management
- **Wizard:** Step-by-step workflow with progress indicator, step navigation
- **Modal Dialogs:** Confirmations, Forms, Details, with loading overlays
- **Notifications:** Toast notifications for success/error/info, notification center
- **File Upload:** Drag-and-drop upload with preview, progress, multiple files
- **Date Picker:** Multi-language, range selection, time support
- **Rich Text Editor:** For communication and lesson planning

#### 2. Layout Patterns

- **Dashboard Grid:** Responsive grid layout for dashboard cards
- **Master-Detail:** List view with detail panel for quick editing
- **Tabbed Interface:** For complex entities with multiple related sections
- **Sidebar Navigation:** Collapsible, role-aware, grouped
- **Breadcrumbs:** Navigation hierarchy display

#### 3. Feedback & User Experience

- Loading spinners for async operations
- Skeleton loading for initial page loads
- Progress indicators for long operations
- Confirmation dialogs for destructive actions
- Field-level validation with real-time feedback
- Success/Error toasts with actionable buttons
- Empty states with helpful guidance
- Error boundaries with recovery options

#### 4. Responsive Design

- Mobile-first approach
- Collapsible sidebar on smaller screens
- Touch-friendly interactions
- Responsive tables with horizontal scroll
- Adaptive layouts for all screen sizes

### Technical Implementation Requirements

#### 1. Code Organization

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (platform)/
│   │   ├── platform/
│   │   └── admin/
│   ├── (dashboard)/
│   │   └── dashboard/
│   ├── people/
│   ├── academic/
│   ├── finance/
│   ├── operations/
│   ├── communication/
│   ├── reports/
│   └── settings/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── layouts/
├── lib/
│   ├── auth/
│   ├── utils/
│   └── constants/
├── hooks/
├── types/
└── mock-data/
```

#### 2. State Management

- Use React Context for global state (auth, tenant)
- Use React Query for server state (data fetching, caching)
- Use Zustand for complex local state
- Implement optimistic updates for better UX
- Handle loading, error, success states

#### 3. Data Fetching

- Use React Query with placeholder data
- Implement infinite scroll for large lists
- Implement debounced search
- Handle API errors with retry logic
- Cache strategies for performance

#### 4. Error Handling

- Global error boundary
- HTTP error handlers (401, 403, 404, 500)
- User-friendly error messages
- Error reporting to console
- Graceful degradation

#### 5. Performance Optimization

- Code splitting by route
- Lazy loading for heavy components
- Image optimization
- Virtual scrolling for large lists
- Debounce/throttle for search/scroll
- Memoization for expensive computations

#### 6. Testing Setup

- Unit tests for components
- Integration tests for workflows
- Accessibility testing setup
- Mock service worker for API

### Specific Edge Cases to Implement

1. **Multi-tenant Access Control:**
   - User belongs to multiple tenants with explicit tenant selection
   - Authorization recalculated per tenant
   - Cross-tenant access blocked with generic error messages
   - Audit logging for all tenant operations

2. **Financial Integrity:**
   - Duplicate payment prevention
   - Partial payment handling
   - Refund/reversal workflows preserving original transactions
   - Decimal-safe monetary calculations
   - Reconciliation reports

3. **Academic Integrity:**
   - Published grades require controlled correction workflow
   - Grade changes create audit trail
   - Historical records preserved
   - Conflict detection in scheduling

4. **Payroll Integrity:**
   - Draft → Review → Finalized lifecycle
   - Correction/reversal workflows
   - Payroll freeze during finalization
   - Sensitive data restricted by role

5. **Data Protection:**
   - Hard deletion vs archival vs anonymization
   - Document access control
   - Sensitive data in logs/notifications minimized
   - Compliance features (GDPR, FERPA)

6. **Subscription Management:**
   - Per-active-user billing
   - Grace period after non-payment
   - Workspace suspension without data deletion
   - Recovery access for billing

7. **System Resilience:**
   - Scheduled jobs with retry/failure handling
   - Notification delivery tracking
   - Backup monitoring
   - Health/readiness endpoints

### Design Guidelines

1. **Colors:** Professional, educational theme with accessible contrast ratios
2. **Typography:** Clear hierarchy with readable font sizes
3. **Spacing:** Consistent spacing system
4. **Animations:** Smooth transitions for state changes
5. **Icons:** Consistent icon library (Lucide or similar)
6. **Branding:** Placeholder for customizable school branding

### Deliverables Checklist

- [ ] Complete application shell with role-aware navigation
- [ ] Landing page with public access
- [ ] Authentication flow (Login, Register, Forgot Password)
- [ ] All role-specific dashboards (10+ roles)
- [ ] All module pages with placeholder data
- [ ] Data tables with search, filter, sort, pagination
- [ ] Forms with validation and multi-step wizards
- [ ] Charts and analytics components
- [ ] Communication center
- [ ] Notification system
- [ ] Calendar integration
- [ ] Report generation interfaces
- [ ] Audit trail viewer
- [ ] Settings pages
- [ ] Mock data file with sample users
- [ ] Responsive design across all pages
- [ ] Dark/Light mode toggle
- [ ] Accessibility features
- [ ] Error handling and edge cases
- [ ] Performance optimizations
- [ ] Code organization and documentation

---

**IMPORTANT NOTES FOR v0:**

1. Generate all pages with placeholder data and clear comment markers for API integration
2. Use mock data file for all sample data
3. Implement complete navigation structure with role-based access
4. Focus on creating a functional, beautiful, and navigable frontend shell
5. Include all necessary UI components and interactions
6. Ensure all pages are responsive and accessible
7. Use consistent design patterns throughout
