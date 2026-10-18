<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All visible copy is bilingual `{en, bn}`; components read it via `useT()` from `src/i18n/language.tsx`. Why: every page must switch languages without hardcoded strings.
- Shared UI copy lives in `src/i18n/ui.ts`; page/service/industry content lives in `src/content/*`. Why: one place to edit text in both languages.
- Company details (email, phone, address, socials) live only in `src/config/site.ts`. Why: placeholders must be replaceable in one edit.
- Contact and demo forms validate with `src/lib/inquiry.ts` and insert into the insert-only `inquiries` table. Why: public site with no visitor reads of submissions.
- No login, dashboards or admin pages on this site. Why: it is a public corporate website only.
- Menu detail pages (products, channels, solutions, resources, developers) are data files in `src/content/pages/<group>-<slug>.ts` rendered by `RichPageView`; routes `/<group>/$slug` look them up. Why: adding a page means adding one content file, no new layout code.
- The shared "Why Businesses Trust Ritorica" block uses only approved company facts; page data files must not carry their own stats. Why: source pages contain conflicting figures.
- Pages whose data sets `dev` (API docs, integration guides) render through `DeveloperPageView` instead of the generic sections. Why: developer pages need the dark docs layout without changing other menu pages.
- The SMS price cards, feature grid and BTRC notice are one shared `PricingSection` used on home and `/pricing`; data stays in `src/content/pricing.ts`. Why: prices must never differ between pages.
- Motion is dependency-free: `NetworkBackground` (canvas particles), `SignalOverlay` (SVG), `OtpJourney` (home OTP story, timer-driven steps that pause off-screen, copy in `src/content/otp-journey.ts`), `OtpDemo` (click-to-play, local only — no inputs, no network, no SMS) and `ApiConnection` (CSS packets, paused off-screen), copy in `src/content/demos.ts`; `useScrollReveal` (Web Animations API, never mutates markup), `.parallax` wrappers (CSS scroll-driven `translate`, distance in `--plx`, no JS; browsers without support stay still), ServiceCard mouse-only tilt via CSS vars and CSS hover/keyframes in `styles.css`; all honour prefers-reduced-motion. Why: keeps the site fast and avoids hydration mismatches.
- The menu is `navGroups` → `navLinks` → `navTrailingGroups` in `src/content/navigation.ts`; header (desktop + mobile) and footer all render from it, and a routing test checks every trailing/top link resolves. Why: one menu definition, no dead links.
- The site assistant is `ChatWidget` (button, lazy-loads `ChatPanel`) streaming from `/api/chat` → `src/lib/assistant/chat.server.ts`; its instructions are built in `src/lib/assistant/knowledge.ts` from the same config/content files the pages use, with no chat storage. Why: answers can never drift from published prices/terms, and the public endpoint keeps visitor input small and text-only.
- Terms & Conditions clauses live in `src/content/terms.ts`, shared by `/terms` and the assistant; `LegalPage` hides the draft notice only when `draft={false}`. Why: client-approved legal text must appear identically everywhere.
- The Privacy Policy is structured data in `src/content/privacy.ts` (paragraphs, lists, tables) rendered by `PrivacyPolicyView`; other legal pages keep the simple `LegalPage`. Why: the policy needs tables and an index without changing the other legal pages.
- Pages removed from the menu at the client's request (Developers, Refund Policy, Case Studies) keep their routes alive. Why: removal from the menu is reversible and avoids dead links from elsewhere.
- "Request Demo" buttons use `PricingLink` (`src/components/site/PricingLink.tsx`); on the same page it cancels the router navigation and scrolls itself. Why: the router restores the old scroll position on a same-URL click.
- Menu items may set `href` for external links (opens a new tab, wins over `to`); external URLs come from `src/config/site.ts`. Why: Blogs points to LinkedIn without a dead internal page.
- Client logos are a list in `src/content/clients.ts` (cropped images in `src/assets/clients/`) rendered by `ClientLogos` as a CSS-only marquee (two copies, second aria-hidden; static wrapped grid under reduced motion). Why: adding a client means one list entry, no animation code.
