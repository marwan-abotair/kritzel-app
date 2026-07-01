import { Component, template } from "uix/components/Component.ts";
import { ParticipantProps } from "common/surveys/surveys.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { emojiSentiments } from "./static/emoji-sentiments.ts";
import { formatDuration, Options } from "./survey.ts";
import { ScheduleDate, ScheduleTime, SlotKey, slotKey, Vote } from "./types.ts";
import {
    createIcsEvent,
    downloadIcsFile,
    parseIcsBusyRanges,
    toIcsDateTime,
    type CalendarBusyRange,
} from "common/calendar/ics.ts";
@template(function (props) {
	const slotVoteCounts = always<Record<string, number>>(() => {
		const counts: Record<SlotKey, number> = {};
		for (const dateSlot of props.survey.configuration.dates) {
			for (const timeSlot of dateSlot.times) {
				const key = slotKey(dateSlot, timeSlot);
				counts[key] = Object.values(props.survey.votes)
					.filter(vote =>
						typeof vote.slots[key] !== "undefined" &&
						(emojiSentiments as Record<string, number | undefined>)[vote.slots[key].icon] !== -1
					).length;
			}
		}
		return counts;
	});
	const highestVoteCount = always(() => Math.max(0, ...Object.values<number>(slotVoteCounts)));

	return <main>
		<section class="meta panel">
			<h1>{props.survey.configuration.title || "Kritzel"}</h1>
			<p>{props.survey.configuration.description || "Please vote for the slots that fit your preferences."}</p>
			<AutoSaveLabel />
			<button
    		type="button"
    		onclick={() => this.exportBestSlot()}
			>
    			In Kalender speichern
			</button>
		</section>

		<label class="name panel">
			Your name
			<span class="hint">Required for voting</span>
			<input type="text" value={this.participantName} />
		</label>

		<label class ="panel">
			Kalender importieren
			<input type="file"
			accept=".ics,text/calendar"
			onchange={(event) => this.importIcsFile(event)}
			/>
		</label>

		<section class="slots panel">
			<div class="schedule" style={`grid-template-columns: auto 1fr auto auto${
				this.votersVisible.val ? ` repeat(${Object.keys(props.survey.votes).length}, auto)` : ""
			}`}>
				<div class="schedule-head">
					<div class="heading">Options</div>
					<div class="vote-heading">Your vote</div>
					<button
						class="toggle"
						type="button"
						onclick={() => this.votersVisible.val = !this.votersVisible.val}
					>
						{this.votersVisible.val ? "👤 v" : "👤 >"}
					</button>
					{this.votersVisible.val && <div class="names">
						{Object.values(props.survey.votes).map(vote =>
							<div class="voter">{vote.name}</div>
						)}
					</div>}
				</div>

				{props.survey.configuration.dates.map(dateSlot =>
					<div class="date">
						<div class="badge" style={`grid-row: span ${dateSlot.times.length}`}>
							<span class="weekday">
								{dateSlot.date.toLocaleDateString("de-DE", { weekday: "short" })}
							</span>
							<span class="day">
								{dateSlot.date.toLocaleDateString("de-DE", { day: "2-digit" })}
							</span>
							<span class="month">
								{dateSlot.date.toLocaleDateString("de-DE", { month: "short" }).toUpperCase()}
							</span>
						</div>

						{dateSlot.times.map(timeSlot => {
							const key = slotKey(dateSlot, timeSlot);

							if (!(key in this.selectedOptions))
								this.selectedOptions[key] = "";

							return <div class="slot">
								<div class="time">
									<span class="range">
										{timeSlot.start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
										{" – "}
										{timeSlot.end.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
									</span>
									<span class="duration">{formatDuration(timeSlot.end.getTime() - timeSlot.start.getTime())}</span>
									{this.isSlotBusy(dateSlot, timeSlot) && <span class="busy-label">Belegt</span>}
								</div>

								<select
									class="vote"
									disabled={!this.participantName.val.trim()}
									value={this.selectedOptions[key]}
								>
									{!this.selectedOptions[key] && <option value="">Vote</option>}
									{props.survey.configuration.voteOptions.map(option =>
										<option value={`${option.icon} ${option.label}`}>
											{option.icon} {option.label}
										</option>
									)}
								</select>

								<div class={`total ${slotVoteCounts[key] > 0 && slotVoteCounts[key] === highestVoteCount.val ? "max" : ""}`}>
									{slotVoteCounts[key]}
								</div>

								{this.votersVisible.val && <div class="votes">
									{Object.entries(props.survey.votes).map(([endpointId]) => {
										const selectedOption = props.survey.votes[endpointId]?.slots[key];
										return <div class="response">
											{selectedOption?.icon ?? "–"}
										</div>;
									})}
								</div>}
							</div>;
						})}
					</div>
				)}
			</div>
		</section>
	</main>;
})
export default class SchedulePollParticipant extends Component<ParticipantProps<Options, Vote>> {
	votersVisible = $(false);
	participantName = $("");

	/** a `<select>`-friendly representation of the participant's selected options,
	 * formatted as `"{icon} {label}"`
	 */
	selectedOptions = $<Record<string, string>>({});

	importedBusyRanges = $<CalendarBusyRange[]>([]);

	protected override onCreate() {
		if (this.properties.survey.votes[datex.meta.caller.name]?.name !== undefined) {
			this.participantName.val = this.properties.survey.votes[datex.meta.caller.name].name;
		}
		this.updateSelectFriendlyOptionsObject();
		observe(this.properties.survey.votes, () =>  { this.updateSelectFriendlyOptionsObject() });
		observe(this.selectedOptions, () => { this.submitVotes() });
		observe(this.participantName, () => { this.submitVotes() });
	}

	private updateSelectFriendlyOptionsObject() {
		const submittedSlots = this.properties.survey.votes[datex.meta.caller.name]?.slots ?? {};
		for (const [key, option] of Object.entries(submittedSlots)) {
			if (this.selectedOptions[key] === `${option.icon} ${option.label}`) continue;
			else this.selectedOptions[key] = `${option.icon} ${option.label}`;
		}
	}

	private async submitVotes() {
		if (this.participantName.val.trim() === "") return;

		await this.properties.survey.vote({
			name: this.participantName.val,
			slots: Object.fromEntries(
				Object.entries<string>(this.selectedOptions)
					.filter(([_, value]) => value !== "")
					.map(([key, value]) => {
						const [icon, label] = value.split(" ", 2);
						return [key, { icon, label }]
					})
			)
		});
	}

	private exportSlot(dateSlot: ScheduleDate,timeSlot:ScheduleTime) {
		const title = this.properties.survey.configuration.title || "Kritzel termin";
		
		const start = toIcsDateTime(dateSlot.date,timeSlot.start);
		const end = toIcsDateTime(dateSlot.date,timeSlot.end);
		const icsText = createIcsEvent(title,start,end);

		downloadIcsFile("termin.ics",icsText);
		
	}
	private exportBestSlot(){
		let bestDateSlot: ScheduleDate | undefined;
		let bestTimeSlot: ScheduleTime | undefined;
		let bestCount = -1;

		for(const dateSlot of this.properties.survey.configuration.dates){
			for(const timeSlot of dateSlot.times){
				const key = slotKey(dateSlot, timeSlot);
				const count = Object.values(this.properties.survey.votes)
				.filter(vote =>
					typeof vote.slots[key] !== "undefined" &&
					(emojiSentiments as Record<string, number | undefined>)[vote.slots[key].icon] !== -1
				).length;
					
				if (count > bestCount) {
					bestCount = count;
					bestDateSlot = dateSlot;
					bestTimeSlot = timeSlot;
				}
			}
		}
		if (!bestDateSlot || !bestTimeSlot || bestCount <= 0) {
			alert("Es gibt noch keinen passenden Termin zum Exportieren.");
			return;
		}

		this.exportSlot(bestDateSlot, bestTimeSlot);
	}

	private async importIcsFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const content = await file.text();
		const ranges = parseIcsBusyRanges(content);
		this.importedBusyRanges.splice(0, this.importedBusyRanges.length, ...ranges);
		 this.applyCalendarAvailability();
	}
	private getSlotStartDate(dateSlot: ScheduleDate, timeSlot: ScheduleTime) {
		return new Date(
        dateSlot.date.getFullYear(),
        dateSlot.date.getMonth(),
        dateSlot.date.getDate(),
        timeSlot.start.getHours(),
        timeSlot.start.getMinutes(),
        0,
    );
	}

	private getSlotEndDate(dateSlot: ScheduleDate, timeSlot: ScheduleTime) {
		return new Date(
        dateSlot.date.getFullYear(),
        dateSlot.date.getMonth(),
        dateSlot.date.getDate(),
        timeSlot.end.getHours(),
        timeSlot.end.getMinutes(),
        0,
    );
	}
	private overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
    	return startA < endB && endA > startB;
	}
	private isSlotBusy(dateSlot: ScheduleDate, timeSlot: ScheduleTime) {
		const slotStart = this.getSlotStartDate(dateSlot, timeSlot);
		const slotEnd = this.getSlotEndDate(dateSlot, timeSlot);

		return this.importedBusyRanges.some(range =>
			this.overlaps(slotStart, slotEnd, range.start, range.end)
    );
	}
	private getNoOption() {
		return this.properties.survey.configuration.voteOptions.find(option =>
			(emojiSentiments as Record<string, number | undefined>)[option.icon] === -1
			|| option.label.toLowerCase() === "no"
			|| option.label.toLowerCase() === "nein"
		);
	}
	private applyCalendarAvailability() {
		const noOption = this.getNoOption();

		if (!noOption) {
			alert("Keine Nein-Option gefunden.");
			return;
		}

		for (const dateSlot of this.properties.survey.configuration.dates) {
			for (const timeSlot of dateSlot.times) {
				if (!this.isSlotBusy(dateSlot, timeSlot)) continue;

				const key = slotKey(dateSlot, timeSlot);
				this.selectedOptions[key] = `${noOption.icon} ${noOption.label}`;
			}
		}
	}
}
