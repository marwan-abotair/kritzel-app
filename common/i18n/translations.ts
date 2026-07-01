export type Locale = "de" | "en";

export const translations = {
    de: {
        locale: "de-DE",

        // Home
        home_open_schedule: "Termin öffnen",
        home_create_schedule: "Termin erstellen",
        home_or: "ODER",
        home_schedule_id_placeholder: "Termin-ID",

        // CreateSurvey
        create_survey_heading: "Was möchtest du erstellen?",

        // EditorView
        editor_survey_not_found: "Diese Umfrage wurde nicht gefunden.",
        editor_unauthorized: "Du bist nicht berechtigt, diese Umfrage zu bearbeiten.",
        editor_share_title: "Umfrage teilen",
        editor_participant_link_label: "Teilnahme-Link",
        editor_edit_link_label: "Bearbeiten und moderieren",
        editor_survey_id_label: "Umfrage-ID",
        editor_copy_link: "Link kopieren",
        editor_copied: "Kopiert",
        editor_copy_id: "ID kopieren",

        // ParticipantView
        participant_survey_not_found: "Diese Umfrage wurde nicht gefunden.",

        // AutoSaveLabel
        auto_save: "✓ Wird automatisch gespeichert",

        // MetaFields
        meta_title_label: "Titel",
        meta_title_placeholder: "Umfrage benennen",
        meta_description_label: "Beschreibung",
        meta_description_placeholder: "Umfrage beschreiben",

        // VotingOptionsEditor
        voting_options_title: "Abstimmungsoptionen",
        voting_options_explanation: "Passe an, wie Teilnehmer abstimmen können – mit Icons und Beschreibungen",
        voting_option_label_placeholder: "Bezeichnung",
        voting_option_remove: "Option entfernen",
        voting_option_add: "Option hinzufügen",
        voting_option_open_emoji: "Emoji auswählen",

        // DateSlot
        date_slot_add_time: "Zeitslot hinzufügen",

        // TimeSlot
        time_slot_start_label: "Startzeit",
        time_slot_end_label: "Endzeit",
        time_slot_remove: "Zeitslot entfernen",

        // SchedulePoll – Editor
        schedule_no_dates: "Beginne damit, ein Datum im Kalender auszuwählen.",

        // SchedulePoll – Participant
        schedule_default_title: "Kritzel",
        schedule_default_description: "Bitte stimme für die Zeitslots ab, die dir passen.",
        schedule_name_label: "Dein Name",
        schedule_name_required_hint: "Pflichtfeld zum Abstimmen",
        schedule_options_heading: "Optionen",
        schedule_vote_heading: "Deine Stimme",
        schedule_show_voters: "Teilnehmer einblenden",
        schedule_hide_voters: "Teilnehmer ausblenden",
        schedule_vote_placeholder: "Abstimmen",
    },

    en: {
        locale: "en-US",

        // Home
        home_open_schedule: "Open Schedule",
        home_create_schedule: "Create Schedule",
        home_or: "OR",
        home_schedule_id_placeholder: "Schedule ID",

        // CreateSurvey
        create_survey_heading: "What would you like to create?",

        // EditorView
        editor_survey_not_found: "This survey could not be found.",
        editor_unauthorized: "You are not authorized to edit this survey.",
        editor_share_title: "Share your survey",
        editor_participant_link_label: "Participant Link",
        editor_edit_link_label: "Edit and Moderate this Survey",
        editor_survey_id_label: "Survey ID",
        editor_copy_link: "Copy Link",
        editor_copied: "Copied",
        editor_copy_id: "Copy ID",

        // ParticipantView
        participant_survey_not_found: "This survey could not be found.",

        // AutoSaveLabel
        auto_save: "✓ Saves Automatically",

        // MetaFields
        meta_title_label: "Title",
        meta_title_placeholder: "Name Your Survey",
        meta_description_label: "Description",
        meta_description_placeholder: "Describe Your Survey",

        // VotingOptionsEditor
        voting_options_title: "Voting Options",
        voting_options_explanation: "Customize how participants can vote by setting icons and descriptions",
        voting_option_label_placeholder: "Label",
        voting_option_remove: "Remove option",
        voting_option_add: "Add Option",
        voting_option_open_emoji: "Select emoji",

        // DateSlot
        date_slot_add_time: "Add Time Slot",

        // TimeSlot
        time_slot_start_label: "Start time",
        time_slot_end_label: "End time",
        time_slot_remove: "Remove time slot",

        // SchedulePoll – Editor
        schedule_no_dates: "Begin by selecting a date from the calendar.",

        // SchedulePoll – Participant
        schedule_default_title: "Kritzel",
        schedule_default_description: "Please vote for the slots that fit your preferences.",
        schedule_name_label: "Your name",
        schedule_name_required_hint: "Required for voting",
        schedule_options_heading: "Options",
        schedule_vote_heading: "Your vote",
        schedule_show_voters: "Show voters",
        schedule_hide_voters: "Hide voters",
        schedule_vote_placeholder: "Vote",
    },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations.de;
