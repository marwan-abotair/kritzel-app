import { ObjectRef } from "datex-core-legacy/runtime/pointers.ts";
import { Component, template } from "uix/components/Component.ts";
import { Time } from "datex-core-legacy/types/time.ts";

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type Props = {
    value: Ref<Time>;
} | {
    values: ObjectRef<Time[]>;
};

function getGridDates(year: number, month: number) {
    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysThisMonth = new Date(year, month + 1, 0).getDate();
    const daysPreviousMonth = new Date(year, month, 0).getDate();

    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    const dates: Time[] = [];

    for (let i = 0; i < firstDayOffset; i++)
        dates.push(new Time(new Date(Date.UTC(previousYear, previousMonth, daysPreviousMonth - firstDayOffset + i + 1))));

    for (let day = 1; day <= daysThisMonth; day++)
        dates.push(new Time(new Date(Date.UTC(year, month, day))));

    for (let day = 1; dates.length < 42; day++)
        dates.push(new Time(new Date(Date.UTC(nextYear, nextMonth, day))));

    return dates;
}

@template(function () {
    return <div class="calendar-grid">
        <div class="control-bar">
            <button type="button" onclick={() => this.navigateMonth(-1)}>{"<"}</button>
            <span class="month-name">
                {new Date(Date.UTC(this.year.val, this.month.val)).toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button type="button" onclick={() => this.navigateMonth(1)}>{">"}</button>
        </div>

        {DAY_LABELS.map((day) => (
            <div class="day-header">{day}</div>
        ))}

        {getGridDates(this.year.val, this.month.val).map((date) => (
            <div
                class={`date-cell${date.getMonth() !== this.month.val ? " off-current-month" : ""}${this.isDateSelected(date) ? " selected" : ""}`}
                onclick={() => date.getMonth() === this.month.val && this.selectDate(date)}
            >
                {date.getDate()}
            </div>
        ))}
    </div>;
})
export class Calendar extends Component<Props> {
    year = $(new Date().getFullYear());
    month = $(new Date().getMonth());

    isDateSelected(date: Time): boolean {
        if ("values" in this.properties)
            return this.properties.values.some(selectedDate => selectedDate.getTime() === date.getTime());
        else return this.properties.value.val.getTime() === date.getTime();
    }

    navigateMonth(delta: number) {
        let month = this.month.val + delta;
        let year = this.year.val;

        if (month > 11) { month = 0; year++; }
        else if (month < 0) { month = 11; year--; }

        this.month.val = month;
        this.year.val = year;
    }

    selectDate(date: Time) {
        if ("values" in this.properties) {
            const selectedIndex = this.properties.values.findIndex(
                selectedDate => selectedDate.getTime() === date.getTime()
            );
            if (selectedIndex >= 0) this.properties.values.splice(selectedIndex, 1);
            else this.properties.values.push(date);
        } else {
            this.properties.value.val = date;
        }
    }
}
