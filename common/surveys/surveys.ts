import { inferType } from "datex-core-legacy/types/struct.ts";
import { Component } from "uix/components/Component.ts";

import { deepClone } from "common/util.ts";

type EndpointId = string;

type PrivateSurvey = {
    configuration: Record<string, unknown>,
    votes: Record<string, unknown>,
    administrationToken: string
    type: string,
    id: string
};

const privateSurveys = eternal ?? $(new Map<string, PrivateSurvey>());

export type Survey<Options> = {
    label: string;
    defaultData: Options;
    editorView: new (...args: unknown[]) => Component;
    participantView: new (...args: unknown[]) => Component;
};

export const StoredSurvey = struct("StoredSurvey", class {
    constructor(public privateData: PrivateSurvey) {}
    
    static init(fields: {
        id: string,
        type: string,
        configuration: Record<string, unknown>,
        administrationToken: string
    }) {
        privateSurveys.set(fields.id, {
            id: fields.id,
            type: fields.type,
            configuration: fields.configuration,
            votes: {},
            administrationToken: fields.administrationToken
        });

        // @ts-ignore due to faulty type definition checks
        return new StoredSurvey(privateSurveys.get(fields.id)!);
    }

    static getById(id: string) {
        if (!StoredSurvey.exists(id))
            throw new Error(`Survey with id ${id} not found`);

        // @ts-ignore due to faulty type definition checks
        return new StoredSurvey(privateSurveys.get(id)!);
    }

    static exists(id: string) {
        return privateSurveys.has(id);
    }

    destroy () {
        privateSurveys.delete(this.privateData.id);
    }

    @property get configuration() {
        return deepClone(this.privateData.configuration);
    }

    @property async getEditableConfiguration(token: string) {
        if (privateSurveys.get(this.id)!.administrationToken !== token) throw new Error("Unauthorized");
        else return privateSurveys.get(this.id)!.configuration;
    }

    @property get votes() {
        return deepClone(this.privateData.votes);
    }

    @property get id() {
        if (typeof this.privateData === "undefined")
            throw new Error("You must set the Survey._id field before using the survey");
        return this.privateData.id;
    }

    @property get type() {
        return this.privateData.type;
    }

    @property getAdministrativeConfiguration(token: string) {
        if (this.privateData.administrationToken !== token) throw new Error("Unauthorized");
        else return this.privateData.configuration;
    }

    @property async vote(value: unknown) {
        const config = this.privateData.configuration as any;
        if (config.deadline && new Date() > new Date(config.deadline)) {
            throw new Error("Abstimmungszeitraum ist abgelaufen.");
        }
        this.privateData.votes[datex.meta.caller.name] = value;
    }

    @property async withdraw() {
        delete this.privateData.votes[datex.meta.caller.name];
    }

    get _administrationToken() {
        return this.privateData.administrationToken;
    }

    set _administrationToken(value: string) {
        this.privateData.administrationToken = value;
    }
});

export type StoredSurvey<OPTIONS, VOTE_TYPE> = Omit<
    inferType<typeof StoredSurvey>,
    "configuration" | "votes" | "vote"
> & {
    configuration: OPTIONS;
    votes: Record<EndpointId, VOTE_TYPE>;
    vote: (value: VOTE_TYPE) => Promise<void>;
};

export type EditorProps<OPTIONS, VOTE_TYPE=Record<string, unknown>> = {
    survey: StoredSurvey<OPTIONS, VOTE_TYPE>;
    editableConfiguration: OPTIONS;
};

export type ParticipantProps<OPTIONS, VOTE_TYPE> = { survey: StoredSurvey<OPTIONS, VOTE_TYPE> };

export function cleanupExpiredSurveys() {
    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    console.log("Starte automatische Bereinigung alter Umfragen...");

    for (const [id, privateSurvey] of privateSurveys.entries()) {
        let baseDateMs = 0;
        const config = privateSurvey.configuration as any;

        if (config.deadline) {
            baseDateMs = new Date(config.deadline).getTime();
        } else if (config.dates && config.dates.length > 0) {
            baseDateMs = Math.max(...config.dates.map((date: string | number | Date) => new Date(date).getTime()));
        } else {
            continue; 
        }

        const timeSinceBaseDate = now - baseDateMs;

        if (timeSinceBaseDate > THIRTY_DAYS_IN_MS) {
            console.log(`Lösche Umfrage ${id} (Abgelaufen seit über 30 Tagen)`);
            privateSurveys.delete(id); 
        }
    }
}