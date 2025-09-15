Multi-Tenant Notes App
Objective

A multi-tenant SaaS Notes Application where multiple companies (tenants) can manage their notes with role-based access and subscription limits. Both backend and frontend are hosted on Vercel.

Features
1. Multi-Tenancy

Supports two tenants: Acme and Globex.

Tenant data is strictly isolated.

Approach used: Shared schema with a tenantId column.

2. Authentication & Authorization

JWT-based login.

Roles:

Admin → can upgrade subscription.

Member → can create, view, edit, and delete notes.

Test accounts (password: password):

admin@acme.test (Admin, Acme)

user@acme.test (Member, Acme)

admin@globex.test (Admin, Globex)

user@globex.test (Member, Globex)

3. Subscription Plans

Free Plan → max 3 notes per tenant.

Pro Plan → unlimited notes.

Upgrade endpoint: POST /tenants/:slug/upgrade

(Only Admin can upgrade, works instantly).

4. Notes API (CRUD)

POST /notes → create a note.

GET /notes → list notes for tenant.

GET /notes/:id → get note by id.

PUT /notes/:id → update a note.

DELETE /notes/:id → delete a note.