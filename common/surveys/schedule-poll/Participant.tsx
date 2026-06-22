import { Component, template } from "uix/components/Component.ts";
import { ParticipantProps } from "common/surveys/surveys.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { emojiSentiments } from "./static/emoji-sentiments.ts";
import { computeResult } from "./result.ts";
import { formatDuration, Options } from "./survey.ts";
import { SlotKey, slotKey, Vote } from "./types.ts";

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
	const isExpired = always(() => {
    const deadline = props.survey.configuration.deadline;
    return deadline ? new Date() > new Date(deadline) : false;
});
	const highestVoteCount = always(() => Math.max(0, ...Object.values<number>(slotVoteCounts)));

	// Bester Termin (3.6): wird automatisch nach Ablauf der Deadline ermittelt,
	// ohne Eingriff des Initiators (AK3). Liefert den Slot-Key des Gewinners,
	// oder null, wenn die Abstimmung noch läuft oder keine Stimmen vorliegen.
	const bestSlotKey = always(() => {
		if (!isExpired.val) return null;

		const slotKeys: SlotKey[] = [];
		for (const dateSlot of props.survey.configuration.dates)
			for (const timeSlot of dateSlot.times)
				slotKeys.push(slotKey(dateSlot, timeSlot));

		return computeResult(slotKeys, props.survey.votes).bestSlot;
	});

	// Gewinner-Slot menschenlesbar formatieren ("Montag, 14. Juli, 18:00 – 19:00").
	const formatBestSlot = (key: SlotKey): string => {
		for (const dateSlot of props.survey.configuration.dates) {
			for (const timeSlot of dateSlot.times) {
				if (slotKey(dateSlot, timeSlot) !== key) continue;
				const date = dateSlot.date.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" });
				const from = timeSlot.start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
				const to = timeSlot.end.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
				return `${date}, ${from} – ${to}`;
			}
		}
		return "";
	};

	return <main>
		<section class="meta panel">
			<h1>{props.survey.configuration.title || "Kritzel"}</h1>
			<p>{props.survey.configuration.description || "Please vote for the slots that fit your preferences."}</p>
			{props.survey.configuration.deadline && (
			<p class="deadline">
				Abstimmung läuft bis:{" "}
				{new Date(props.survey.configuration.deadline).toLocaleString("de-DE")}
			</p>
)}
			<AutoSaveLabel />
		</section>

		{bestSlotKey.val && <section class="result panel">
			<span class="result-label">Bester Termin</span>
			<span class="result-slot">{formatBestSlot(bestSlotKey.val)}</span>
		</section>}

		<label class="name panel">
			Your name
			<span class="hint">Required for voting</span>
			<input type="text" value={this.participantName} />
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
								</div>

								<select
									class="vote"
									disabled={!this.participantName.val.trim() || isExpired.val}
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
}
