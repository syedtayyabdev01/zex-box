# ZEX BOX — Implementation Roadmap

## Phase 0 — Foundation
- [x] Create GitHub repository.
- [x] Record product requirements and legal/data boundaries.
- [x] Define architecture and delivery phases.
- [ ] Verify initial Next.js shell with a clean install/build.

## Phase 1 — Original UI
- [ ] Create ZEX BOX design tokens and responsive shell.
- [ ] Build header, navigation, hero, content rails, cards, and footer.
- [ ] Add skeletons, empty states, and accessible focus behavior.
- [ ] Test narrow mobile, tablet, and desktop breakpoints.

## Phase 2 — Discovery
- [ ] Select an authorized catalog metadata provider.
- [ ] Implement provider adapter and server-side validation.
- [ ] Add search, filters, pagination, and title details.
- [ ] Add locally persisted watchlist.

## Phase 3 — Playback
- [ ] Select authorized playback providers or public-domain sources.
- [ ] Implement provider-specific source verification and handoff.
- [ ] Build clear unavailable/error states.
- [ ] Test playback only against sources with documented authorization.

## Phase 4 — Release
- [ ] Connect GitHub repository to Vercel.
- [ ] Configure environment variables securely.
- [ ] Run typecheck, lint, build, accessibility, and responsive QA.
- [ ] Verify production deployment and domain.

## Working agreement
No dependency installation, build, deployment, destructive operation, or external account change is performed on the user's local machine without explicit approval. GitHub file changes are committed to this repository as requested.
