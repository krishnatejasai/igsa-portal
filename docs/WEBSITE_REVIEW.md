# IGSA website review and maintenance plan

Reviewed October 1, 2026. This is a repository review with a local browser smoke check, not a production infrastructure audit. Hosting accounts, database usage, backups, live credentials, and Drive permissions were not inspected. Frontend and backend changes are deployed together through the main branch. The production site is https://www.igsauf.us.

## Implemented in this refinement

- Board profiles: create and edit, suggested positions with custom entry, searchable profile cards, image preview/removal, labeled fields, inline validation and save feedback. Public profiles and dashboard accounts remain separate.
- Gallery: create and edit albums, description, Drive/Google Photos/other HTTPS collection links, link-only publishing, optional highlights, cover selection, append/remove photos, searchable management and public views.
- Photo preparation: JPEG/PNG/WebP input, automatic resize/compression, 15 MB source-file limit, 20 highlights per album, and bounded server payloads. A link-only album stores metadata instead of the photo collection.
- Public album page: photo grid, native modal viewer with keyboard dismissal, previous/next controls, download/open action and external collection button. The browser may open remote images instead of downloading them.
- Removed sample gallery albums that linked to nonexistent records; homepage shows four real previews while the gallery page shows all matches.
- Board/gallery backend role checks now match frontend management permissions; create/update inputs are explicitly selected and validated.
- Responsive management cards, active dashboard navigation, scrollable sidebar, visible keyboard focus, reduced-motion support, public/admin navigation fix and missing-page fallback.
- Fixed existing lint errors in admin fetching and conditional hooks in Admin Users. Protected-route redirects no longer clear all origin storage.
- Load the QR scanner separately: production entry JavaScript dropped from about 720 KB to 345 KB before compression. Scanner code loads when its route is visited.

## What needs attention next

| Priority | Area and evidence | Required outcome |
| --- | --- | --- |
| P0 | `registrationController.js`: count-then-create capacity checks and duplicate lookups are separate writes; registration schema lacks event/email and event/UFID uniqueness constraints | Prevent duplicate/over-capacity registrations under simultaneous requests. Plan existing-data cleanup before adding indexes; implement atomic capacity allocation/transactions and concurrency tests. |
| P0 | Public registration spreads `req.body` into database records | Whitelist student fields; derive event title on the server; forbid caller-supplied attendance and internal status metadata. |
| P1 | Waitlist flow closes registration at capacity, then rejects subsequent requests before reaching waitlist logic | Separate manual closure from capacity; allow explicit waitlist joining; show waitlist-specific confirmation and notify promotions. Current success UI assumes every registration has a QR code. |
| P1 | Registration form still renders when event loading fails; other public sections show “no data” on request failure | Add explicit failures, retry, disabled submissions and useful recovery paths across every page. |
| P1 | `authController.js`, `server.js`: no login throttling, minimal input validation, seven-day token in browser storage | Add login abuse protection, password policy/recovery, token-expiry handling and session controls; review a cookie-based session approach. |
| P1 | Registrations collect UFID, phone and email | Minimize fields, document purpose/retention, add server validation and abuse controls, restrict personal-data access to operational roles. |
| P1 | `AdminRegistrations.jsx` CSV export does not escape embedded quotes or protect spreadsheet formula interpretation | Correct escaping and formula handling, then test names and other input containing quotes, commas and formula prefixes. |
| P1 | Gallery API still returns every embedded photo in collection responses | Add cover/metadata-only listing, pagination and separate album-detail retrieval; move image binaries into object/media storage when needed. Compression is an interim improvement, not unlimited storage. |
| P1 | Dashboard loads four datasets together without checking every response; actions ignore some role restrictions | Partial-error handling, loading states, permission-aware actions and summary endpoints that avoid downloading unnecessary personal data/photos. |
| P1 | No verified backup, alerting, recovery or handoff runbook in the repository | Confirm account ownership and recovery contacts; test database restore, document deployment rollback, monitor downtime and storage. |
| P2 | `EventsSection.jsx` lists all events under “Upcoming”; dates are display strings | Store unambiguous date/time + time zone, distinguish upcoming/past events, add filters and event detail pages. |
| P2 | Homepage/About numbers are hard-coded; contact email has been standardized to `igsa.uf@gmail.com` | Confirm historical statistics; centralize editable site settings so updates stay consistent. |
| P2 | Homepage logo asset is about 1 MB and all non-scanner pages share the entry bundle | Optimize logo and images, lazy-load admin routes, add explicit image dimensions and measure real mobile performance. |
| P2 | Public pages have inconsistent footer coverage, form labeling and page headings | Apply a shared public layout and design system; test keyboard, screen-reader, 360px mobile and tablet flows. |
| P2 | Album highlights have generated alt text; board bios disappear on mobile | Add per-photo captions/alt text and allow mobile users to expand full biographies. |
| P2 | Board members have no term/archive/order data | Add academic-year terms, current/alumni archive, display ordering and annual rollover without deleting history. |
| P2 | Event deletion leaves registration handling unspecified | Prefer event cancellation/archive with retained attendance history and notification rules; define deletion policy. |
| P2 | Metadata and content operations are mostly hard-coded | Add per-page titles/descriptions, social previews, sitemap, content ownership and a documented editorial checklist. |

P0 = resolve before a high-demand registration opening or broader admin rollout. P1 = next reliability/operations release. P2 = planned product and design improvements. These are code findings and proposals, not claims of a confirmed production incident.

## Feature roadmap for a useful IGSA portal

### Student experience

1. New-student hub: arrival checklist, housing guidance, campus setup, transport, banking/phone pointers, FAQs and verified university resources. Give every resource an owner and last-reviewed date.
2. Event detail pages: agenda, accessibility information, cost, venue/map, capacity, registration deadline and cancellation policy.
3. Calendar download/add-to-calendar, registration email, reminders and recoverable ticket lookup.
4. Self-service registration cancellation and visible waitlist status.
5. Searchable event archive and photo collections.
6. Volunteer sign-up with tasks, shifts and confirmation.
7. Community links, newsletter opt-in and contact routing by topic.
8. Feedback forms after events; summarize feedback for the board.
9. Student opportunities, mentorship and professional-development listings, with moderation before publishing.

### Board operations

1. Invitation-based admin onboarding, password reset, role editing and term-end access removal.
2. Draft → preview → publish workflow, scheduled posts and change history.
3. Board term rollover, archived members and bulk profile import with a review step.
4. Dashboard task list for upcoming event deadlines and stale content.
6. Event budgets/expense summaries and sponsor management only after access and retention requirements are defined.
7. Audit trail for content edits, admin role changes and exports; soft deletion/restore.
8. Media library with captions, cover cropping, explicit reuse permissions and storage metrics.
9. Documented backups, deployment checks, rollback, uptime alerts and ownership handoff.

### Later, only when there is a clear owner

Alumni directory with opt-in visibility, mentorship matching, merchandise, membership dues/payments, sponsorship packages and certificate generation. Each introduces ongoing administration; prioritize reliable event, content and communication workflows first.

## Day-to-day maintenance

| Frequency | Owner | Checklist |
| --- | --- | --- |
| Before publishing | Content editor | Proofread dates/venue; preview mobile; confirm photo permission; test shared album signed out; check public profile email. |
| Before each event | Event lead + IT | Verify registration/closure, QR and manual check-in, export and capacity behavior in staging; assign check-in operators. |
| Monthly | IT director | Check hosting/database/media usage, failed requests, dependency updates, backups and admin roster. |
| Each semester | President + IT | Review access, privacy/retention, content owners, resource links and service ownership. |
| Annual handoff | Outgoing + incoming leads | Confirm recovery access, rotate shared credentials through normal account workflows, test deployment and restore, archive board term and transfer runbook. |

## Verification and remaining limits

- `npm run build --prefix frontend`: passes.
- `npm run lint --prefix frontend`: passes.
- `node --test backend/tests/content.test.js`: nine passing validation/controller/role-guard tests with mocked database calls.
- Isolated browser fixtures: created and edited a board profile, saved a link-only album, and verified its external link on the public album page. Fixtures used in-memory data and were removed after testing.
- Local browser: public navigation and gallery error state rendered; the configured API could not be loaded during the smoke check. Database-backed creation/editing and real uploads still require a staging check with valid backend configuration and authorized credentials.
- No production writes, deployments, Drive uploads or sharing-permission changes were performed. No database storage quota was measured.
- Existing large albums/photos remain unchanged. Newly edited legacy content may exceed the new validation limits; move its full collection to external storage and retain selected highlights before saving.

## Homepage refinement

The homepage now uses a bright orange, green, blue, and white design with an animated SVG rangoli, pointer-responsive artwork, a moving culture ribbon, scroll reveals, and a reading-progress line. Continuous motion can be paused, and reduced-motion preferences are honored. Board profile ordering and short-description suggestions are available in the editor. The homepage shows the first four members. Contact links replace the removed messaging feature.
