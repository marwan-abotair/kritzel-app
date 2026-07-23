# Kritzel – The Open-Source Appointment Planning App

A light-weight, privacy-friendly appointment scheduling and planning platform built with the full-stack framework [UIX](https://uix.unyt.org)
and realtime data exchange powered by [DATEX](https://datex.unyt.org).

## Background

This initiative is overseen by the [Institut für Digitale Lehre](https://digitalelehre.org?utm_source=kritzel&utm_medium=git) (German; "Institute for Digital Education") and aims to provide a free alternative to proprietary software solutions.
It marks an optional part of a larger open-source education and management ecosystem that the institute offers to schools, universities and other educational facilities.

Contributions and Issue Reports to this Git repository are welcome at any time.

## Key Features

* **No Account Required:** Create and participate in polls instantly without registration.
* **Real-time Syncing:** Live updates across all participants powered by DATEX.
* **Privacy by Design:** Automatic cleanup of expired data and fully open-source.
* **Modular Survey Types:** Flexible schedule polls, yes/no voting, and extensible survey modules.

## Data Privacy & GDPR Compliance

As a privacy-focused application, Kritzel incorporates built-in features to support data minimization and GDPR compliance:
* **Automatic Data Cleanup:** Expired surveys and their associated data are automatically deleted from the system after 30 days.
* **Legal Pages:** Integrated, ready-to-use templates for privacy policies (Datenschutzerklärung) and legal notices (Impressum).

## Installation

Install the UIX runtime:

**Linux/macOS:**
```bash
curl -fsSL https://unyt.land/install.sh | bash
```

**Windows:**
```powershell
irm https://unyt.land/install.ps1 | iex
```

## Usage

Once UIX is installed, run the self-hosted version:
```bash
uix -p [desired port]
```

## Architecture

A Kritzel survey is created and administered through an edit link secured by an administration token, while participants vote through a separate, shareable participant link. The backend owns the survey state (configuration and votes) and syncs it to clients in real-time via DATEX.

### Project Structure

Kritzel is organized in a static full-stack core architecture. This architecture is extensible via the
modular _Survey System._ "Survey" is the general term for any kind of poll inside Kritzel.
Currently, this includes the schedule poll, where participants vote on specific date and time slots, but other
survey types — such as simple yes/no polls or multiple-choice questionnaires — can be added the same way.

```
kritzel/
├── backend/           # Survey storage, creation and access control
├── frontend/          # UI views (home, create survey, editor, participant)
│   ├── views/         # Top-level pages routed by the entrypoint
│   └── components/    # Reusable UI components
└── common/            # Shared code and assets
    ├── components/    # Shared UI components used across views and survey types
    ├── lib/           # Vendored utility libraries
    └── surveys/       # Modular survey type system
```

## Contributing a Custom Survey Type

Survey types are modular and pluggable. Each survey type implements the [Survey](common/surveys/surveys.ts:18) interface.

Survey types are organized in directories under [common/surveys/](common/surveys/), registered in [all.ts](common/surveys/all.ts:1), and loaded on demand.

1. Create a directory in [common/surveys/](common/surveys/) that follows the recommended survey architecture:
```
common/surveys/my-type/
├── survey.ts     # Core definition (label, default data, views)
├── types.ts      # Shared types for the survey's configuration and votes
├── Editor.tsx    # Administration / editor view component
├── Participant.tsx  # Participant voting view component
├── icon.svg      # Icon shown when choosing a survey type
└── components/   # Optional survey-specific components
```

2. Define your survey in `survey.ts`:
```typescript
import { Survey } from "common/surveys/surveys.ts";

import EditorView from "./Editor.tsx";
import ParticipantView from "./Participant.tsx";
import { MyOptions } from "./types.ts";

export type Options = MyOptions;

export default {
    label: "My Survey Type",

    defaultData: {
        // Initial configuration assigned when a survey of this type is created
    },

    editorView: EditorView,
    participantView: ParticipantView,
} satisfies Survey<Options>;
```

3. Register in [common/surveys/all.ts](common/surveys/all.ts:1):
```typescript
export const ALL_SURVEY_TYPES = [
    "schedule-poll",
    "my-type",  // Add your type
] as const;
```

4. Create view components using UIX class components with `@template` decorators. See [schedule-poll](common/surveys/schedule-poll/) for reference.

## Technology

Built on [UIX](https://github.com/unyt-org/uix), a full-stack framework with real-time data synchronization via [DATEX](https://datex.unyt.org), developed and maintained by the non-profit [unyt.org democratic free network technologies e.V.](https://unyt.org) association. Runs on Deno.

## Credits

Developed by Team "Kritzel" as part of the "Neue Webtechnologien" module at TU Berlin.
