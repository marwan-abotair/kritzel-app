import { Component, template } from "uix/components/Component.ts";

@template(function () {
    return <main class="legal-page legal-page--datenschutz">
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

            html, body {
                margin: 0;
                background: #ffffff;
            }

            .legal-page {
                --paper: #ffffff;
                --ink: #1c2b39;
                --ink-soft: #48586a;
                --accent: #8c2f39;
                --hairline: #dee1d9;
                --gutter-ghost: #d6dccf;

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
                margin: 0 0 2.8rem;
            }

            .legal-page .legal-rule {
                border: none;
                border-top: 1px solid var(--hairline);
                margin: 0;
            }

            .legal-page .legal-rule + .legal-rule {
                margin-top: 4px;
            }

            .legal-page section.clause {
                position: relative;
                padding: 2.2rem 0 2.2rem 3.6rem;
                border-top: 1px solid var(--hairline);
            }

            .legal-page section.clause .clause-mark {
                position: absolute;
                left: -0.2rem;
                top: 2.1rem;
                font-family: 'Newsreader', serif;
                font-style: italic;
                font-size: 2.6rem;
                line-height: 1;
                color: var(--gutter-ghost);
                user-select: none;
            }

            .legal-page h2 {
                font-family: 'Newsreader', serif;
                font-weight: 500;
                font-size: 1.3rem;
                margin: 0 0 0.7rem;
                color: var(--ink);
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }

            .legal-page h2::before {
                content: "";
                width: 0.4rem;
                height: 0.4rem;
                background: var(--accent);
                transform: rotate(45deg);
                flex-shrink: 0;
            }

            .legal-page p {
                font-size: 1rem;
                line-height: 1.7;
                color: var(--ink-soft);
                margin: 0;
                max-width: 34rem;
            }

            .legal-page .legal-footnote {
                margin-top: 2.8rem;
                padding-top: 1.4rem;
                border-top: 1px solid var(--hairline);
                font-family: 'IBM Plex Mono', monospace;
                font-size: 0.75rem;
                color: var(--ink-soft);
                letter-spacing: 0.02em;
            }

            @media (max-width: 32rem) {
                .legal-page section.clause {
                    padding-left: 2.4rem;
                }
                .legal-page section.clause .clause-mark {
                    font-size: 2rem;
                    top: 2.25rem;
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

            .legal-page a { color: var(--accent); }
            .legal-page a:focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: 2px;
            }
        `}</style>

        <div class="legal-shell">
            <p class="legal-eyebrow">Rechtliches · Terminfindung</p>
            <h1>Datenschutzerklärung</h1>
            <div class="legal-rule-group">
                <hr class="legal-rule" />
                <hr class="legal-rule" />
            </div>

            <section class="clause">
                <span class="clause-mark">§1</span>
                <h2>Datensparsamkeit</h2>
                <p>Wir erheben keine personenbezogenen Daten, die nicht zwingend für die Terminfindung erforderlich sind. Es werden keine E-Mail-Adressen oder Passwörter gespeichert.</p>
            </section>

            <section class="clause">
                <span class="clause-mark">§2</span>
                <h2>Speicherdauer</h2>
                <p>Alle Umfragedaten werden automatisiert 30 Tage nach Ablauf der Abstimmungsfrist endgültig von unseren Servern gelöscht.</p>
            </section>

            <section class="clause">
                <span class="clause-mark">§3</span>
                <h2>Cookies &amp; Tracking</h2>
                <p>Diese Anwendung verzichtet vollständig auf Tracking-Mechanismen und verwendet lediglich essenzielle Verbindungs-Cookies für die Funktionalität des Netzwerks.</p>
            </section>

            <p class="legal-footnote">Diese Erklärung gilt ausschließlich für die Nutzung dieses Dienstes.</p>
        </div>
    </main>;
})
export class Datenschutz extends Component {}