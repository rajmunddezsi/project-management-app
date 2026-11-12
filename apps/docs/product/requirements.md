# Project Management Platform
## Product Requirements Document (PRD)

**Version:** 0.2  
**Status:** Draft — updated following M0.2 review  
**Milestone:** M0.1–M0.2 — Requirements & Architecture  
**Related document:** `docs/architecture/system-design.md`

---

## 1. Product Vision

A modern project management platform for small software development teams to manage projects, tasks, deadlines and team collaboration. The platform gives teams one place to track work and organize responsibilities while keeping access to individual projects under explicit control.

The MVP supports **one organization**, with multiple projects and project-specific members and owners. It is **not multi-tenant**.

## 2. Target Users and Authorization Roles

There are two independent levels of authorization:

| Scope | Role | Responsibilities |
|---|---|---|
| Organization | `ADMIN` | Organization-wide administrative access, oversight of all projects and future user account administration |
| Organization | `MEMBER` | Standard authenticated account; may create a project and become its initial owner, but has no access to unrelated projects |
| Project (`ProjectMember.role`) | `PROJECT_OWNER` | Manages the project, its members, owner assignments, tasks and archive state within that project |
| Project (`ProjectMember.role`) | `MEMBER` | Reads all tasks in joined projects, creates/updates tasks but cannot delete them or manage membership |

`PROJECT_OWNER` **is not a global user role**. A person may be the owner of one project and an ordinary member of another. Global ADMIN permissions and project membership permissions are checked independently.

Any authenticated user may create a project. The creator becomes the first `PROJECT_OWNER` of that project atomically with its creation. This self-service creation policy is proposed for final approval before implementation.

## 3. Product Scope

The platform includes authentication, project ownership and membership, project CRUD/archive, task management with statuses, priorities and optional descriptions, task list and Kanban views, search/filtering/sorting/pagination, dashboard statistics, and later comments, activity logs and account administration.

### 3.1 MVP Scope

- Login, logout, secure session management and server-side authorization.
- Project creation by authenticated users with automatic initial owner assignment.
- Project editing and archiving by project owners or global administrators.
- Membership administration, including promotion/demotion of project owners and last-owner protection.
- Member-removal workflow: conflict on assigned tasks, paginated task preview, individual reassignment, or explicitly confirmed bulk unassignment and removal.
- Task management (optional plain-text description, assignee, status, priority, deadline).
- Task list with search, filtering, sorting and pagination.
- Kanban board with drag-and-drop and persisted ordering, including keyboard fallback.
- Project and task dashboards with access-scoped statistics.

### 3.2 Version 1 Scope

- Comments on tasks.
- Significant activity history.
- Profile settings.
- User administration interface and account lifecycle decisions.

### 3.3 Out of Scope

- Real-time chat and multi-user live collaboration.
- Multiple organizations / multi-tenant architecture.
- AI-powered features, native mobile apps, microservices.
- Complex notification systems and rich-text task descriptions in the MVP.

---

## 4. Functional Requirements (FR)

| ID | Module | Requirement | Phase |
|---|---|---|---|
| FR-01 | Authentication | Users can log in, log out and maintain a secure authenticated session. | MVP |
| FR-02 | Authorization | The system supports global `ADMIN`/`MEMBER` roles and project-scoped `PROJECT_OWNER`/`MEMBER` membership roles. | MVP |
| FR-03 | Projects | Authenticated users can create projects and become initial owners; project owners or ADMIN can update/archive projects. | MVP |
| FR-04 | Project Members | PROJECT_OWNER or ADMIN can add, remove and manage members of an active project. | MVP |
| FR-05 | Tasks | Members can create, view and update tasks in joined projects; PROJECT_OWNER or ADMIN can also delete tasks. | MVP |
| FR-06 | Task Properties | Tasks support an optional plain-text description, status, priority, optional assignee and due date. | MVP |
| FR-07 | Task List | Users can search, filter, sort and paginate tasks visible to them. | MVP |
| FR-08 | Kanban Board | Users can view tasks grouped by status and reorder/move them with drag-and-drop; keyboard alternatives must work. | MVP |
| FR-09 | Dashboard | Users can view authorized project summaries, task statistics and progress indicators. | MVP |
| FR-10 | Comments | Project members can add and view comments on tasks. | V1 |
| FR-11 | Activity Log | The system records significant project and task changes. | V1 |
| FR-12 | Settings | Users can view and update their profile settings. | V1 |
| FR-13 | User Management | ADMIN can manage user accounts through a dedicated interface. | V1 |
| FR-14 | Member Removal | If a member has assigned tasks, authorized project managers can view them in a paginated task table, reassign individual tasks or explicitly confirm bulk unassignment and removal. | MVP |
| FR-15 | Project Ownership | Authorized managers can promote an existing project member to PROJECT_OWNER or demote an owner without leaving the project ownerless. | MVP |

---

## 5. Business Rules (BR)

| ID | Business Rule |
|---|---|
| BR-01 | Any authenticated user may create a project and is atomically added as its first `PROJECT_OWNER`. Global ADMIN can also create projects. |
| BR-02 | Global MEMBER users can only access projects in which they have a `ProjectMember` record. Global ADMIN can access all projects. |
| BR-03 | Every task must belong to an existing project. |
| BR-04 | A task assignee, if present, must be a member of the associated project. |
| BR-05 | Task status must be `TODO`, `IN_PROGRESS`, `IN_REVIEW` or `DONE`. |
| BR-06 | Task priority must be `LOW`, `MEDIUM`, `HIGH` or `URGENT`. |
| BR-07 | Project MEMBER can create and update tasks in the joined project but cannot delete them. PROJECT_OWNER and global ADMIN may delete tasks from active projects. |
| BR-08 | Authentication, authorization and business rules must be enforced on the backend; frontend restrictions alone are insufficient. |
| BR-09 | Archived projects remain readable to authorized users but cannot be edited, assigned, reordered, modified in membership or bulk-unassigned by any role. |
| BR-10 | PROJECT_OWNER may edit/archive their active project and manage its membership; the role has no authority over unrelated projects. Global ADMIN retains organization-wide oversight. |
| BR-11 | Every active project must have at least one PROJECT_OWNER. The last owner cannot be removed or demoted before another member is promoted. |
| BR-12 | If a departing member still has assigned tasks, ordinary removal is rejected with `409 MEMBER_HAS_ASSIGNED_TASKS`. The UI must list affected tasks and offer individual reassignment or an explicitly confirmed operation that atomically unassigns all affected tasks and removes the member. Tasks themselves are preserved. |
| BR-13 | Every project member may view **all tasks in their project**, not only tasks assigned to them. Task assignment affects responsibility, not visibility. |

### 5.1 Rule Enforcement and Consistency

- Project ownership and member permissions are enforced server-side against the **specific project**.
- Protected queries must be scoped before returning data.
- Foreign keys and uniqueness constraints enforce local relational integrity; service logic and transactions enforce owner continuity and assignee membership.
- Bulk unassignment and member removal must run in one transaction, including rechecking current permissions and relevant state.
- Conflict responses expose only data the actor is authorized to inspect.

---

## 6. Application Screens and Key Dialogs

| Screen / Dialog | Route / Location | Phase |
|---|---|---|
| Login | `/login` | MVP |
| Dashboard | `/app` | MVP |
| Projects | `/app/projects` | MVP |
| Project Details & Membership | `/app/projects/:id` | MVP |
| Kanban Board | `/app/projects/:id/board` | MVP |
| Task List | `/app/projects/:id/tasks` | MVP |
| My Tasks | `/app/my-tasks` | MVP |
| Member Removal Conflict Dialog | Project Details → Members | MVP |
| Project Ownership / Membership Editor | Project Details → Members | MVP |
| Settings | `/app/settings` | V1 |
| User Management | `/app/admin/users` | V1 |

The **Member Removal Conflict Dialog** displays the affected tasks in a paginated table (title, status, priority and task link). Actions: **Cancel**, **Edit task assignments** (task links), **Unassign all tasks and remove member** (explicit confirmation). It does not delete tasks. Keyboard navigation, dialog focus management and accessible table headings are required.

---

## 7. Non-Functional Requirements (NFR)

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Type Safety | React and Node.js applications use TypeScript in strict mode. |
| NFR-02 | Architecture | Feature-based frontend and modular backend with explicit responsibilities and enforceable dependencies. |
| NFR-03 | Security | Secure server-side session with HttpOnly cookie and CSRF defenses for cookie-authenticated mutations. |
| NFR-04 | Validation | All external input is validated by the backend; validation and permissions are not delegated to the UI. |
| NFR-05 | Accessibility | Target relevant WCAG 2.2 AA requirements including keyboard and dialog workflows, focus, labels and contrast. |
| NFR-06 | Responsiveness | Mobile, tablet and desktop UI. |
| NFR-07 | Performance | Efficient, measured data fetching and query design; paginated long lists. |
| NFR-08 | Testing | Unit, integration and E2E coverage for critical workflows and authorization boundaries. |
| NFR-09 | Code Quality | Strict lint/format conventions and reviewable PRs. |
| NFR-10 | Deployment | Containerized deployment and automated CI checks. |
| NFR-11 | Data Integrity | No orphaned active project ownership; no invalid assignee after member removal; bulk operations are atomic. |

---

## 8. Technical Scope

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router |
| State | React state, Context, Zustand only if justified; TanStack Query for server state |
| Forms | React Hook Form, Zod |
| Styling | CSS Modules, native modern CSS and design tokens |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| Testing | Vitest, React Testing Library, Playwright |
| Infrastructure | pnpm monorepo, Docker, Docker Compose, CI/CD |

Technical boundaries and API contracts: `docs/architecture/system-design.md`.

---

## 9. Delivery Process

Every feature task will include requirements and acceptance criteria; an architecture/design explanation; implementation; relevant automated tests; review and refactoring; and concise documentation. Architectural decisions are recorded as ADRs when material.

## 10. Open Product Decision

**Self-service project creation:** the design assumes every authenticated user can create projects and becomes its initial owner, so a global ADMIN does not need to run project operations. Confirm this policy before finalizing M0.

## 11. Definition of Done – M0.1 / M0.2 Review

- [x] Product vision, target users, roles and project ownership reviewed.
- [x] MVP and V1 functionality separated.
- [x] FR-01 through FR-15 and BR-01 through BR-13 reviewed.
- [x] Project owner and membership-removal workflows agreed.
- [x] Task description and other fields reflected in architecture diagrams and API contracts.
- [x] Screens, non-functional requirements and architecture references reviewed.
- [x] Product decisions confirmed; documents committed on `docs/0007-product-discovery`.

**Next:** M0.3 — UI/UX Design & Design System.