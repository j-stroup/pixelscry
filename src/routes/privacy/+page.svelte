<script>
    import SeoHead from '$lib/components/SeoHead.svelte';

    const EFFECTIVE_DATE = 'July 22, 2026';
    const CONTACT_EMAIL = 'contact@pixelscry.com';
</script>

<SeoHead
    title="Privacy Policy | PixelScry"
    description="How PixelScry collects, uses, and protects information, including third-party services, affiliate links, and analytics."
    path="/privacy"
/>

<main class="min-h-screen bg-void text-ink relative overflow-x-hidden pt-24 pb-32">

    <div class="relative z-10 max-w-3xl mx-auto px-6">

        <header class="mb-14">
            <h1 class="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3">
                Privacy <span class="text-ink-faint">Policy</span>
            </h1>
            <p class="font-mono text-signal text-xs md:text-sm tracking-[0.3em] font-medium uppercase">
                Effective {EFFECTIVE_DATE}
            </p>
        </header>

        <div class="prose prose-invert max-w-none
                    prose-p:text-ink-dim prose-p:leading-relaxed
                    prose-headings:font-display prose-headings:text-ink prose-headings:uppercase prose-headings:tracking-wide
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-line
                    prose-h3:text-base prose-h3:mt-8 prose-h3:mb-2
                    prose-strong:text-ink prose-a:text-signal hover:prose-a:opacity-80
                    prose-li:text-ink-dim prose-ul:my-4">

            <p>
                PixelScry ("PixelScry," "we," "us," or "our") operates pixelscry.com (the "Site"), a free video
                game database and search tool. This policy explains what information the Site collects, how it's
                used, and the third-party services involved. It applies to the Site only.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information you provide</h3>
            <p>
                PixelScry does not require an account, and we do not collect names, email addresses, or payment
                information. There are no sign-up forms anywhere on the Site.
            </p>

            <h3>Your Collection list</h3>
            <p>
                The "My Collection" feature tracks which games you've marked as owned entirely in your browser's
                local storage. This list never leaves your device as identifying data — when the page loads your
                collection, your browser asks our server for details on those specific games, but nothing tied to
                you personally is stored on our end. Clearing your browser's site data for pixelscry.com erases it
                permanently, and we have no way to recover it.
            </p>

            <h3>Automatically collected information</h3>
            <p>
                Like most websites, our server and hosting infrastructure automatically log standard technical
                information for every request — including IP address, browser type, device type, referring page,
                and timestamps. This is standard web server behavior, used only for security, troubleshooting, and
                keeping the Site running, and is not cross-referenced with any other data we hold (we don't hold
                any).
            </p>

            <h2>Analytics</h2>
            <p>
                We use <strong>Google Analytics</strong> to understand how visitors use the Site — which pages are
                popular, how people navigate, and general traffic trends. Google Analytics uses cookies and similar
                technologies to collect information such as your approximate location, device and browser type, and
                the pages you visit on the Site. This data is processed by Google in aggregate; we do not use it to
                identify individual visitors.
            </p>
            <p>
                You can learn more about how Google handles this data at
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>,
                and opt out of Google Analytics tracking across all websites using the
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h2>Cookies</h2>
            <p>
                PixelScry itself does not set any cookies. Google Analytics sets its own cookies (described above)
                to distinguish visitors and sessions. Your "My Collection" list uses browser local storage, not
                cookies, and is not accessible to us or any third party.
            </p>

            <h2>Third-Party Services</h2>
            <p>
                Game data, images, and related content on the Site are sourced from several third-party services.
                Visiting a game page may cause your browser to load images directly from these providers'
                servers, which are then subject to those providers' own privacy practices:
            </p>
            <ul>
                <li><strong>RAWG</strong> (rawg.io) — our primary source for game data, cover art, and screenshots.</li>
                <li><strong>Steam</strong> (Valve Corporation) — live player counts, pricing, and store links for games available on Steam.</li>
                <li><strong>Wikipedia</strong> — supplementary game summaries, used under Wikipedia's CC BY-SA license with attribution linked on each game page.</li>
                <li><strong>eBay</strong> — live marketplace listings shown on game pages are fetched by our server, but listing images load directly from eBay's servers in your browser.</li>
            </ul>
            <p>
                We do not send any personal or identifying information to these providers as part of normal Site
                operation — requests to them are limited to the game data needed to render the page you're viewing.
            </p>

            <h2>Affiliate Disclosure</h2>
            <p>
                PixelScry is a participant in the <strong>Amazon Associates Program</strong>, an affiliate advertising
                program designed to provide a means for sites to earn advertising fees by linking to Amazon.com, and
                the <strong>eBay Partner Network</strong>. When you click a "Buy on Amazon," "Search on eBay," or
                similar link on the Site and make a qualifying purchase, we may earn a commission at no additional
                cost to you. Once you click through to Amazon, eBay, or any other retailer, that site's own privacy
                policy and cookie practices apply — not ours.
            </p>

            <h2>Children's Privacy</h2>
            <p>
                The Site is not directed at children under 13, and we do not knowingly collect personal information
                from children. Since PixelScry does not collect personal information from any visitor in the first
                place, this is true for all users regardless of age.
            </p>

            <h2>Data Retention</h2>
            <p>
                We do not retain personal data because we do not collect any. Server access logs are retained only
                as long as necessary for security and operational purposes, and are periodically purged. Your
                Collection list is retained locally in your browser until you remove games from it or clear your
                browser's site data.
            </p>

            <h2>Your Choices</h2>
            <ul>
                <li>Clear your "My Collection" list at any time by removing games individually, or by clearing pixelscry.com from your browser's site data.</li>
                <li>Opt out of Google Analytics using the browser add-on linked above, or by using your browser's tracking-protection or ad-blocking features.</li>
                <li>Use your browser's Do Not Track setting — note that the Site does not currently respond differently to this signal, as there is no industry-standard way to honor it.</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
                We may update this policy as the Site changes — for example, if we add new features or third-party
                services. Material changes will be reflected by updating the effective date at the top of this page.
            </p>

            <h2>Contact Us</h2>
            <p>
                Questions about this policy or how the Site handles information can be sent to
                <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
            </p>

        </div>
    </div>
</main>
