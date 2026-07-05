import { Time } from "datex-core-legacy/types/time.ts";
import { Component, template } from "uix/components/Component.ts";

import { MetaFields } from "common/surveys/common/MetaFields.tsx";
import { type EditorProps } from "common/surveys/surveys.ts";

import { type Options } from "./survey.ts";
import { ScheduleDate, ScheduleTime } from "./types.ts";

import { Calendar } from "./components/Calendar.tsx";
import { DateSlot } from "./components/DateSlot.tsx";
import { VotingOptionsEditor } from "./components/VotingOptionsEditor.tsx";

/**
 * Predicts the time schedule most likely to apply to a newly created date slot
 * based on the schedules of existing date slots.
 *
 * The schedule occurring most often is returned. If no schedule occurs more than
 * once, the last date's schedule is returned.
 *
 * @param dates
 * @throws TypeError if `dates` is empty
 */
function predictNextTimeRanges(dates: ScheduleDate[]) {
	if (dates.length === 0) throw new TypeError("At least one date slot is required for prediction.");

	const scheduleKey = (times: ScheduleTime[]) =>
		times.map(time => `${time.start.getTime()}-${time.end.getTime()}`).join(",");

	const occurrences = new Map<string, number>();
	for (const date of dates) {
		const key = scheduleKey(date.times);
		occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
	}

	const mostCommonSchedule = [...occurrences.entries()].sort((a, b) => a[1] - b[1]).toReversed()[0];

	const targetKey = mostCommonSchedule[1] === 1
		? scheduleKey(dates[dates.length - 1].times)
		: mostCommonSchedule[0];

	const targetDate = dates.find(date => scheduleKey(date.times) === targetKey)!;
	return targetDate.times.map(({ start, end }) => ({ start, end })) satisfies Pick<ScheduleTime, "start" | "end">[];
}

@template(function (props) {
	const selectedDates = $(props.editableConfiguration.dates.map(slot => slot.date));
	const anyDateSelected = $(selectedDates.length > 0);
	observe(selectedDates, () => {
		anyDateSelected.val = selectedDates.length > 0;

		/* Only select dates from the existing configuration that are selected in the calendar */
		let updatedDates = props.editableConfiguration.dates.filter(slot =>
			selectedDates.some(date => date.getTime() === slot.date.getTime())
		);

		for (const date of selectedDates) {
			/* If the date is selected in the calendar but not stored in the configuration */
			if (!updatedDates.some(slot => slot.date.getTime() === date.getTime())) {
				let insertionIndex = updatedDates.findIndex(slot => slot.date.getTime() > date.getTime());
				if (insertionIndex === -1) insertionIndex = updatedDates.length;

				let times: ScheduleTime[];
				if (updatedDates.length === 0) {
					times = [{
						start: new Time(new Date(Date.UTC(1970, 0, 1, 10, 0))),
						end: new Time(new Date(Date.UTC(1970, 0, 1, 11, 0)))
					}];
				} else {
					const SURROUNDING_N_DATES = 3;
					times = predictNextTimeRanges([
						...updatedDates.slice(insertionIndex, insertionIndex + SURROUNDING_N_DATES),
						...updatedDates.slice(Math.max(0, insertionIndex - SURROUNDING_N_DATES), insertionIndex)
					]).map(({ start, end }) => ({ start, end }));
				}
				updatedDates = [
					...updatedDates.slice(0, insertionIndex),
					{ date, times },
					...updatedDates.slice(insertionIndex)
				];
			}
		}

		if (props.editableConfiguration.dates.every((slot, index) => slot === updatedDates[index])) {
			/* Only push newly selected dates to the end */
			for (let i = props.editableConfiguration.dates.length; i < updatedDates.length; i++) {
				props.editableConfiguration.dates.push(updatedDates[i]);
			}
		} else {
			/* Replace all existing dates in-place */
			props.editableConfiguration.dates.splice(
				0,
				props.editableConfiguration.dates.length,
				...updatedDates
			);
		}
	});

	return <main>
		<MetaFields title={props.editableConfiguration.title} description={props.editableConfiguration.description} />
		<VotingOptionsEditor options={props.editableConfiguration.voteOptions} />
		<div class="schedule-setup">
			<Calendar class="calendar panel" values={selectedDates} />
			<div class="slots panel">
				{props.editableConfiguration.dates.map(date => <DateSlot scheduleDate={date} />)}
				{!anyDateSelected.val && <div class="no-dates">Beginnen Sie damit, ein Datum aus dem Kalender auszuwählen.</div>}
			</div>
		</div>
	</main>;
})
export default class SchedulePollEditor extends Component<EditorProps<Options>> {}
