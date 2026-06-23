import { Time } from "datex-core-legacy/types/time.ts";

export function createIcsEvent(title: string,start:string,end:string){
    return[
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        "END:VEVENT",
        "END:VCALENDAR",
        "",
    ].join("\r\n");
}
function pad(value: number) {
    return String(value).padStart(2, "0");
}

export function toIcsDateTime(date: Time, time: Time) {
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());

    const hour = pad(time.getUTCHours());
    const minute = pad(time.getUTCMinutes());

    return `${year}${month}${day}T${hour}${minute}00`;
}

export function downloadIcsFile(filename:string,content:string){
    const blob = new Blob([content], {
        type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
