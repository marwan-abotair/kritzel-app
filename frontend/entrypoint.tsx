import { type Entrypoint } from "uix/providers/entrypoints.ts";

import { ParticipantView } from "frontend/views/ParticipantView.tsx";
import { CreateSurvey } from "frontend/views/CreateSurvey.tsx";
import { EditorView } from "frontend/views/EditorView.tsx";
import { Home } from "frontend/views/Home.tsx";
import { Impressum } from "frontend/views/Impressum.tsx";     // NEU
import { Datenschutz } from "frontend/views/Datenschutz.tsx"; // NEU

import "common/theme.ts";

export default {
    "/": <Home />,
    "/create-survey": <CreateSurvey />,
    "/impressum": <Impressum />,       // NEU
    "/datenschutz": <Datenschutz />,   // NEU
    "/edit/:surveyId": (_, { surveyId }) => <EditorView surveyId={surveyId} />,
    "/:surveyId": (_, { surveyId }) => <ParticipantView surveyId={surveyId} />
} satisfies Entrypoint;
import { type Entrypoint } from "uix/providers/entrypoints.ts";

import { ParticipantView } from "frontend/views/ParticipantView.tsx";
import { CreateSurvey } from "frontend/views/CreateSurvey.tsx";
import { EditorView } from "frontend/views/EditorView.tsx";
import { Home } from "frontend/views/Home.tsx";
import { LoginView } from "frontend/views/auth/LoginView.tsx";
import { RegisterView } from "frontend/views/auth/RegisterView.tsx";

import "common/theme.ts";

export default {
    "/": <Home />,
    "/create-survey": <CreateSurvey />,
    "/login": <LoginView />,
    "/register": <RegisterView />,
    "/edit/:surveyId": (_, { surveyId }) => <EditorView surveyId={surveyId} />,
    "/:surveyId": (_, { surveyId }) => <ParticipantView surveyId={surveyId} />
} satisfies Entrypoint;
