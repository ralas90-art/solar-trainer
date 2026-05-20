# Implementation Plan: SeptiVolt Phase 6B — Company Intelligence Profile + Integration Hub

This plan details the design, models, APIs, security, and UI components to add the Company Intelligence Profile and the Company Integration Hub.

---

## User Review Required

> [!IMPORTANT]
> **Environment Variables**: A new environment variable, `INTEGRATION_ENCRYPTION_KEY`, is required for the production backend on Render. If it is missing or invalid, credential saves will be blocked with a safe error.
> 
> **Role & Tenant Enforcement**: 
> - Company Profiles: Readable by all roles within the company, but editable only by `admin` (company_admin/super_admin) and `manager` (if allowed).
> - Company Integrations: Accessible (read/write/test) only by `admin` (company_admin/super_admin). Managers can only view connection status. Sales reps are completely blocked.
> - Demo Mode: The company `sales_accelerator_demo` (and demo user sessions) will run entirely on isolated mock logic. No real database operations or external API calls will be executed.

---

## Proposed Changes

### Database & Models

#### [NEW] [company_settings.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/models/company_settings.py)
Create SQLModel definitions for the two new tables:
1. **`CompanyProfile`**: Stores company details (overview, markets, financing, brand voice, objections, rebuttals, etc.). Arrays are persisted as JSON strings.
2. **`CompanyIntegration`**: Stores integration settings (provider, auth type, encrypted credentials, location/account ID, webhook URL, sync preferences as JSON, status details).

#### [MODIFY] [user.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/models/user.py) / [__init__.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/models/__init__.py)
Register the new models in the database metadata so they are recognized by SQLModel.

#### [MODIFY] [migrate_db.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/migrate_db.py)
Ensure the startup migration script executes `SQLModel.metadata.create_all` safely to auto-generate `companyprofile` and `companyintegration` tables on database initialization.

---

### Service Layer

#### [NEW] [integration_service.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/services/integration_service.py)
Create service class to manage encryption, decryption, credentials masking, and test connections:
- **Encryption**: Uses AES-gcm or Fernet (`cryptography` library) using `INTEGRATION_ENCRYPTION_KEY`. If key is missing, throws `ValueError`.
- **Masking**: Replaces sensitive tokens with `••••••••••••{last_4_chars}`.
- **Testing GoHighLevel**: Validates fields and mocks or makes a lightweight check.
- **Testing Custom Webhook**: Sends the test payload to the configured webhook URL and verifies the response status code.

#### [NEW] [profile_service.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/services/profile_service.py)
- Utility to fetch, save, or update `CompanyProfile`.
- Exposes `build_company_training_context(company_id)` which generates a clean, structured text profile of the company for future AI consumption.

---

### API Routers

#### [NEW] [company_settings.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/routers/company_settings.py)
Define API endpoints under tags `company_settings`:
- `GET /api/v1/companies/{company_id}/profile`
- `POST /api/v1/companies/{company_id}/profile`
- `PUT /api/v1/companies/{company_id}/profile`
- `GET /api/v1/companies/{company_id}/integrations`
- `POST /api/v1/companies/{company_id}/integrations`
- `PUT /api/v1/companies/{company_id}/integrations/{integration_id}`
- `POST /api/v1/companies/{company_id}/integrations/{integration_id}/test`

*Enforces strict user header `X-User-Id` role checks and matches company_id to prevent cross-tenant access. Masks credentials before returning integration records.*

#### [MODIFY] [main.py](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/backend/main.py)
Register the new company settings router.

---

### Frontend UI

#### [NEW] [settings/company/page.tsx](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/app/settings/company/page.tsx)
Create the company settings dashboard page featuring:
- Role guard: redirects or blocks standard reps.
- **Tab 1: Company Intelligence**: Detailed forms for Basics, Offer Details, Sales Process, Brand Voice, Scripts, and Training preferences.
- **Tab 2: Integrations Hub**: Integrations Tab: Provider selector (GoHighLevel, Webhooks, Cresca CRM, HubSpot), CRM/API credential inputs, connection sync trigger switches, masked credential display, and live test connection feedback.

#### [MODIFY] [app-shell.tsx](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/components/platform/app-shell.tsx)
Add the "Company Settings" navigation link visible only to `admin` and `manager` roles.

---

## Verification Plan

### Automated & Manual Tests (Local Sandbox)
1. **Migrations**: Verify that running database initialization creates the `companyprofile` and `companyintegration` tables.
2. **API Verification**:
   - Verify reading and writing Company Profile works for admins.
   - Verify reading/writing/testing Integrations works for admins.
   - Verify credentials in DB are encrypted and verified masked in endpoint responses.
   - Verify missing `INTEGRATION_ENCRYPTION_KEY` rejects credential saves.
3. **Tenant Isolation**: Confirm that an admin of `cresca_test` cannot query or modify profiles/integrations of `rival_corp_test`.
4. **Demo Mode Isolation**: Verify that `sales_accelerator_demo` serves fake settings and accepts fake credentials without database writes or external API requests.
5. **Frontend smoke test**: Test component rendering, responsive UI layouts, tabs functionality, and masking displays.

---

🚀 Deployment Recommendations

1. Push these changes to staging.
2. Configure INTEGRATION_ENCRYPTION_KEY as a secure backend-only environment variable on Render.
3. Do not configure INTEGRATION_ENCRYPTION_KEY in Vercel frontend settings.
4. Do not expose the key as NEXT_PUBLIC_*.
5. Validate database schema startup migrations on staging.
6. Verify /settings/company is visible and accessible for authorized roles.
7. Verify sales reps are blocked.
8. Verify managers are view-only.
9. Verify credentials are encrypted at rest and masked in API responses.
10. Verify Demo Mode does not save real credentials or call external APIs.
