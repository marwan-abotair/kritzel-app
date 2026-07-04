import { Component, template } from "uix/components/Component.ts";

@template(function () {
    return <main class="legal-page legal-page--impressum">
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

            html, body {
                margin: 0;
                background: #ffffff;
            }

            .legal-page {
                --paper: #ffffff;
                --paper-raised: #ffffff;
                --ink: #1c2b39;
                --ink-soft: #48586a;
                --accent: #8c2f39;
                --accent-ink: #fbf1ee;
                --hairline: #dee1d9;

                background: var(--paper);
                color: var(--ink);
                font-family: 'IBM Plex Sans', sans-serif;
                padding: clamp(2.5rem, 6vw, 6rem) clamp(1.25rem, 6vw, 4rem);
                min-height: 100vh;
                min-height: 100dvh;
                box-sizing: border-box;
            }

            .legal-page *,
            .legal-page *::before,
            .legal-page *::after { box-sizing: border-box; }

            .legal-page .legal-shell {
                max-width: 46rem;
                margin: 0 auto;
            }

            .legal-page .legal-eyebrow {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.72rem;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: var(--accent);
                margin: 0 0 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }

            .legal-page .legal-eyebrow::before {
                content: "";
                width: 1.6rem;
                height: 1px;
                background: var(--accent);
            }

            .legal-page h1 {
                font-family: 'Newsreader', serif;
                font-weight: 500;
                font-size: clamp(2.2rem, 5vw, 3.2rem);
                line-height: 1.05;
                letter-spacing: -0.01em;
                margin: 0 0 1.6rem;
            }

            .legal-page .legal-rule-group {
                margin: 0 0 3rem;
            }

            .legal-page .legal-rule {
                border: none;
                border-top: 1px solid var(--hairline);
                margin: 0;
            }

            .legal-page .legal-rule + .legal-rule {
                margin-top: 4px;
            }

            /* Masthead: Name tritt hier groß und eigenständig auf, das Siegel sitzt daneben */
            .legal-page .masthead {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 2rem;
                margin: 0 0 2.4rem;
                flex-wrap: wrap;
            }

            .legal-page .masthead-name {
                font-family: 'Newsreader', serif;
                font-style: italic;
                font-weight: 500;
                font-size: clamp(1.9rem, 4.4vw, 2.5rem);
                line-height: 1.1;
                margin: 0;
            }

            .legal-page .masthead-name::after {
                content: "";
                display: block;
                width: 3.4rem;
                height: 3px;
                border-radius: 2px;
                background: var(--accent);
                margin-top: 0.6rem;
            }

            .legal-page .masthead-role {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.72rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--ink-soft);
                margin: 0.65rem 0 0;
            }

            /* Siegel: gefüllter Stempel-Kreis statt Outline, klar anderer Charakter */
            .legal-page .seal {
                position: relative;
                flex: 0 0 auto;
                width: 5.8rem;
                height: 5.8rem;
                border-radius: 50%;
                background: var(--accent);
                color: var(--accent-ink);
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(-8deg);
                box-shadow: 0 10px 22px -10px rgba(140, 47, 57, 0.6);
                user-select: none;
            }

            .legal-page .seal-ring {
                position: absolute;
                inset: 6px;
                border-radius: 50%;
                border: 1px dashed rgba(251, 241, 238, 0.55);
            }

            .legal-page .seal-initials {
                font-family: 'Newsreader', serif;
                font-style: italic;
                font-size: 1.75rem;
                line-height: 1;
            }

            /* Kontaktfakten als klare Zeilen statt einer Grid-Definition-List */
            .legal-page .contact-card {
                background: var(--paper-raised);
                border: 1px solid var(--hairline);
                border-radius: 3px;
                box-shadow: 0 1px 2px rgba(28, 43, 57, 0.05), 0 14px 32px -18px rgba(28, 43, 57, 0.22);
                margin: 0;
                overflow: hidden;
            }

            .legal-page .contact-row {
                display: grid;
                grid-template-columns: 8.5rem 1fr;
                gap: 1rem;
                padding: 1.15rem 1.6rem;
                align-items: baseline;
            }

            .legal-page .contact-row + .contact-row {
                border-top: 1px solid var(--hairline);
            }

            .legal-page .contact-row dt {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.68rem;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--ink-soft);
                margin: 0;
            }

            .legal-page .contact-row dd {
                margin: 0;
                font-size: 1.02rem;
                line-height: 1.55;
            }

            .legal-page .contact-row dd a {
                color: var(--accent);
                text-decoration: none;
                border-bottom: 1px solid transparent;
            }

            .legal-page .contact-row dd a:hover,
            .legal-page .contact-row dd a:focus-visible {
                border-bottom-color: var(--accent);
            }

            .legal-page .placeholder-tag {
                display: inline-block;
                margin-left: 0.6rem;
                padding: 0.15rem 0.55rem;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.6rem;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                color: var(--accent);
                background: rgba(140, 47, 57, 0.08);
                border-radius: 999px;
                vertical-align: middle;
            }

            .legal-page .legal-footnote {
                margin-top: 2.2rem;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.75rem;
                color: var(--ink-soft);
                letter-spacing: 0.02em;
            }

            @media (max-width: 30rem) {
                .legal-page .masthead {
                    flex-direction: column-reverse;
                    align-items: flex-start;
                }
                .legal-page .contact-row {
                    grid-template-columns: 1fr;
                    gap: 0.3rem;
                }
            }

            @media (prefers-reduced-motion: no-preference) {
                .legal-page .legal-shell {
                    animation: legal-rise 0.5s ease both;
                }
            }

            @keyframes legal-rise {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .legal-page a:focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: 2px;
            }
        `}</style>

        <div class="legal-shell">
            <p class="legal-eyebrow">Rechtliches · Terminfindung</p>
            <h1>Impressum</h1>
            <div class="legal-rule-group">
                <hr class="legal-rule" />
                <hr class="legal-rule" />
            </div>

            <div class="masthead">
                <div>
                    <p class="masthead-name">Marwan Abotair</p>
                    <p class="masthead-role">Verantwortlich für diesen Dienst</p>
                </div>
                <div class="seal" aria-hidden="true">
                    <span class="seal-ring"></span>
                    <span class="seal-initials">MA</span>
                </div>
            </div>

            <dl class="contact-card">
                <div class="contact-row">
                    <dt>Anschrift</dt>
                    <dd>Straße des 17. Juni 152<br/>10623 Berlin</dd>
                </div>
                <div class="contact-row">
                    <dt>Telefon</dt>
                    <dd>030 23125000</dd>
                </div>
                <div class="contact-row">
                    <dt>E-Mail</dt>
                    <dd><a href="mailto:kritzel-impressum@info.de">kritzel-impressum@info.de</a></dd>
                </div>
            </dl>

            <p class="legal-footnote">Dieses Projekt entstand im Rahmen eines Uniprojekts.</p>
        </div>
    </main>;
})
export class Impressum extends Component {}