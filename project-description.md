# FastPay Merchant Dashboard — Project Description

## Overview

**FastPay Merchant Dashboard** is a Next.js 16 web application that serves as the merchant-facing interface for **FastPay**, a payments platform. It lets businesses accept and manage payments (including Mobile Money, direct payments, and transfers), view analytics, manage API keys and webhooks, and run day-to-day operations through a single dashboard.

The app talks to the **FastPay API** (OpenAPI 3.0, documented in `api-json.json`). It supports three user roles—**Admin**, **Merchant**, and **Client**—with role-based redirects and layouts.

---

## What the Project Does

### Product positioning

FastPay is presented as a **payment solution that adapts to business growth**, offering:

- **Instant payments** — Real-time processing
- **Multiple payment methods** — Mobile Money, cards, bank transfers, digital wallets
- **API-first integration** — API keys, webhooks, developer docs
- **Analytics** — Transaction and performance metrics
- **Support** — Help center, Telegram/WhatsApp, documentation links

The landing page (`app/page.tsx`) markets these capabilities and directs users to register, sign in, or open developer docs. Authenticated users are sent to role-specific dashboards.

### Core features (by area)

| Area | Description |
|------|-------------|
| **Auth** | Login, register, logout, forgot-password (OTP), complete profile, identity verification (KYC) with uploads |
| **Users** | Current user profile, notifications, Firebase push tokens, verify identity |
| **Organisations** | Create, read, update, delete merchant organisations (businesses) |
| **API Keys & Webhooks** | Generate/list/regenerate API keys per organisation; create/update/delete webhooks per key |
| **Beneficiaries** | CRUD for payment recipients (name, phone, country) per organisation |
| **Payments** | Create payment links and direct payments; list/filter/export by type (PAYMENT, DIRECT_PAYMENT, TRANSFERT, RECHARGE) and status (INIT, INEXECUTION, PENDING, COMPLETE, FAILED, TIMEOUT) |
| **Grouped payments** | Create grouped payment links, view by reference, list payments in a group |
| **Countries** | List countries; enable/disable transactions per country (admin) |
| **Mobile services** | List mobile-money services; enable/disable per service (admin) |
| **Analytics** | Overview stats (totals, success rate, average amount), graph data, top beneficiaries |
| **Transfers** | List transfers, send OTP, initialize mobile transfers |

### User roles and routing

- **ADMIN** → `/admin` — Countries, mobile services, users management
- **MERCHANT** → `/merchant` — Account, beneficiaries, payments (including grouped and payment links), settings, transfers
- **CLIENT** → `/dashboard` — Client-focused dashboard

Routes live under `app/(dashboard)/` with shared layout; public routes (login, register, forgot-password, help, privacy, terms) sit at the app root.

### Tech stack

- **Framework**: Next.js 16, React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Radix UI, shadcn-style components
- **State**: Zustand (with persist for auth)
- **Data**: Axios, controller layer aligned with `api-json.json` endpoints
- **Forms & validation**: React Hook Form, Zod
- **Charts**: Recharts
- **UI extras**: Motion, nuqs, Sonner toasts, Lucide/Tabler icons

---

## API alignment

The frontend is built around the **FastPay API** described in `api-json.json`:

- **Base URL**: `https://merchant-api.fastpay.website/` (production)
- **Tags**: Auth, Users, organisations, api-keys, beneficiaires, payments, grouped-payments, country, services-mobile, analytics, transferts

Controllers in `controllers/` and types in `types/` mirror these endpoints and DTOs (e.g. `LoginRequestDto`, `UserDto`, `NewCreatePaymentDto`, `OrganisationStatsResponseDto`). The client uses a shared API base (`lib/api/base.ts`) for auth headers, error handling, and toasts.

---

## Future integrations

Possible extensions that fit the current architecture and API surface:

1. **Accounting & invoicing**
   - Export payments to Xero, QuickBooks, or local accounting tools
   - Optional invoice creation and matching to payment references

2. **E‑commerce & marketplaces**
   - Plugins or webhooks for Shopify, WooCommerce, custom stores
   - “Pay with FastPay” on checkout; sync orders and payment status via webhooks

3. **Banking & treasury**
   - Bank feed connections for reconciliation (e.g. open banking or file-based)
   - Multi-currency wallets and FX if the backend adds support

4. **Compliance & risk**
   - Deeper KYC/AML workflows (document checks, risk scoring) using existing `/users/verify-identity`
   - Fraud and chargeback dashboards if the API exposes related data

5. **Notifications & messaging**
   - Expand beyond Firebase: in-app notification center, email/SMS templates, optional WhatsApp Business API for receipts and alerts

6. **Developer experience**
   - SDKs (e.g. JS/TS, PHP) generated or documented from `api-json.json`
   - Sandbox/test mode, request logs, and webhook replay in the dashboard

7. **Multi-tenant & teams**
   - Team members, roles, and permissions per organisation
   - Audit logs for sensitive actions (API key changes, large transfers, settings)

8. **Subscriptions & recurring**
   - Recurring payment links or direct-debit style flows if the API adds subscription objects
   - Usage-based billing for platform or interchange-style fees

9. **Local payment methods**
   - Additional mobile networks, “pay later”, or domestic schemes per country, using existing country and mobile-service configuration

10. **White-label & custom domains**
    - Custom branding and domain for payment pages and emails, driven by organisation settings

These ideas assume either new backend endpoints or richer use of existing ones (e.g. webhooks, `extra_data`, and organisation/user metadata).

---

## Summary

FastPay Merchant Dashboard is the web UI for the FastPay payment platform. It provides auth, organisation and API-key management, payments and transfers, beneficiaries, and analytics, and is wired to the FastPay API via `api-json.json`. The codebase is structured for role-based dashboards and can be extended with accounting, e‑commerce, compliance, and developer-focused integrations as the API and product evolve.
