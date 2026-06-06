export type Schedule = {
    id: string;
    title: string;
    description: string;
    appointments: Appointment[];
    voteoptions: Voteoption[];
    voters: Voter[];
};

export type Appointment = {
    start: Date;
    end: Date;
};

export type Voter = {
    name: string;
    votes: Vote[];
};

export type Vote = {
    start: Date;
    end: Date;
    response: Voteoption;
};

export type Voteoption = {
    icon: string;
    description: string;
};

export type AppointmentProps = {
    date: string;
    times: { start: string; end: string }[];
};

export function toMinutes(hhmm: string) {
    if (!hhmm) return null;
    const [hh, mm] = hhmm.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
}
