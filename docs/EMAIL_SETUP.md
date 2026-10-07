# Activate IGSA event ticket emails

The website code is deployed. Delivery remains inactive until the Render backend
has a working email API key and verified sender.

## 1. Sign in to Resend

Open https://resend.com/login and use the IGSA-owned account (`igsa.uf@gmail.com`).
Complete any account verification or terms acceptance yourself. Start on the free
plan; do not enable paid upgrades or transactional overages unless approved by IGSA.
The pricing page currently lists a 100-email daily limit for the free plan:
https://resend.com/pricing. Check the account's monthly quota as well.

## 2. Add the sending domain

In Resend, open **Domains → Add domain** and enter `mail.igsauf.us`.
Keep sending enabled; inbound email receiving is not needed. Use a US region.
Resend generates DNS records specific to your account. Copy the exact record type,
name, value, and MX priority shown; do not invent or copy values from examples.

In Porkbun (the registrar shown in IGSA's domain screenshot), open **Domain
Management → igsauf.us → DNS**. Add the records provided by Resend:

- DKIM verification TXT record.
- SPF sending TXT record.
- Sending/return-path MX record, including its priority.

Porkbun's Host field normally uses the relative name. For example, if Resend shows
`resend._domainkey.mail.igsauf.us`, enter `resend._domainkey.mail` when Porkbun
appends `.igsauf.us` automatically. Follow the actual form and Resend record names.
Do not change the website A/CNAME records or existing root-domain mail records.
Do not add a second SPF record at a name that already has one; resolve any existing
record before editing it.

Return to Resend and click its verification action. Wait for the sending domain and
required records to show **Verified**. DNS propagation can take time.

Official guide: https://resend.com/docs/dashboard/domains/introduction

## 3. Create a restricted API key

Open **API Keys → Create API key** in Resend.
Name: `IGSA website event tickets`.
Choose **Sending access**, restricted to the verified `mail.igsauf.us` domain.
Copy the key directly into the Render environment described below. Do not put the
key in chat, screenshots, frontend code, Vercel variables, or GitHub.

Official guide: https://resend.com/docs/dashboard/api-keys/introduction

## 4. Configure Render

Open https://dashboard.render.com, select `igsa-portal-backend`, then **Environment**.
Add these variables alongside the existing database and JWT variables:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | The private sending-only Resend API key |
| `EVENT_EMAIL_FROM` | `IGSA UF <events@mail.igsauf.us>` |

Save and deploy/restart the backend. Keep the API key masked.
Replies already route to `igsa.uf@gmail.com`; a paid mailbox at the sending address
is not required. Gmail itself is not the sender, because Resend requires a domain
that IGSA owns and verifies.

## 5. Verify the full flow

1. In the board dashboard, create or edit a controlled test event.
2. Enter a short **Registration email message**, e.g. “This is an IGSA ticket test.
   Please bring your student ID and show this QR at check-in.” Save the event.
3. Register an IGSA-controlled test email through the public registration page.
4. Confirm the page shows the QR immediately and reports the email is queued.
5. Check the inbox and spam folder. Confirm the title, custom message, date, time,
   location, reply-to address, and attached QR PNG.
6. Scan the attached QR in the board check-in page for that test registration.
7. Check Resend email logs for delivery. Board “Accepted by email provider” means
   Resend accepted the request, not necessarily that it reached the inbox.

Use only a designated test account; do not create test registrations for students.
Existing historical registrations are not emailed automatically. New registrations
saved since the email feature deployment are pending and can send after activation.

## If something does not arrive

- **Pending**: verify both Render variables and domain verification. Free Render
  services suspend when idle, pausing the worker until the backend wakes up.
- **Failed**: inspect Resend logs, daily/monthly quotas, sender spelling, API key
  permission, and domain status. The website's downloadable QR still works.
- **Accepted but not in inbox**: inspect bounce/suppression results and spam folder.
- **Only one recipient works**: ensure you use the verified domain sender rather
  than Resend's onboarding/test sender.

The worker retries up to eight times within 23 hours of the first attempt. It does
not retry indefinitely or automatically retry jobs already marked failed. Do not
repeat the student's registration to attempt a resend; that would conflict with
existing registration checks. Contact the IT board member to inspect a failed job.
