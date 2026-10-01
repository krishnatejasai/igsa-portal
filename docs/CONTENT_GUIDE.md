# Updating IGSA content

## Board members

Sign in → **Board Members** → **Add member**. Enter name and position, optionally add a public contact email, biography and portrait, then **Save member**. Use **Edit** on a profile card to update it. Search finds names and positions. President and Vice President can manage profiles.

Adding a public profile does not create a login. The President manages dashboard access separately in **Admin Users**.

## Photos and shared albums

Sign in → **Gallery** → **Add album**. Enter an event name and description. Choose either or both:

1. Paste a shared HTTPS album link from Drive, Google Photos or another photo host. A link-only album is supported.
2. Upload up to 20 highlight photos. Files must be JPG, PNG or WebP, at most 15 MB each. The browser resizes and compresses them. Use **Make cover** to choose the first image and **Remove** to discard individual selections.

Use **Save album** to publish. **Edit** can change its name, description, link and highlights later. President, Vice President, Social Media Manager, Creative Director and IT Director can manage albums.

For Drive: upload the full event collection in a dedicated folder; set viewing access appropriate for public website visitors; copy its shared link; test the link while signed out; paste it in **Full album link**. The site links to the external collection; it does not automatically upload files to Drive, change Drive sharing or embed its private contents. Removing an album from the website does not remove files from Drive.

Highlights still use database storage. Link-only albums avoid storing those photo binaries in the website database. The server limits highlight content to approximately 8 MB of encoded image data per album and profile images to approximately 2 MB; fewer images or a shared album link may be required for detailed photos. Existing images are not automatically migrated or compressed.

## Release checklist

Deploy backend and frontend together: the updated frontend uses new detail and update endpoints. Gallery adds optional `description` and `externalUrl` fields; existing documents can still be read without them.

In staging, verify: create/edit board member; authorized and unauthorized roles; compressed upload and removal; cover selection; link-only and hybrid albums; signed-out public album navigation; nonexistent album; API failure/retry; phone layout; keyboard photo viewer; create/edit validation; expired token behavior. Existing session expiry handling remains a separate improvement.
