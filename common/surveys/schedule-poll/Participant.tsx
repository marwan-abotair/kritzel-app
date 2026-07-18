import { Component, template } from "uix/components/Component.ts";
import { ParticipantProps } from "common/surveys/surveys.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { emojiSentiments } from "./static/emoji-sentiments.ts";
import { formatDuration, Options } from "./survey.ts";
import { SlotKey, slotKey, Vote } from "./types.ts";
import { localtext } from "datex-core-legacy/datex_short.ts";
import { UIX } from "uix";

const strings = {
	defaultDescription: localtext({ en: "Please vote for the slots that fit your preferences.", de: "Bitte stimme für die Zeitslots ab, die dir passen." }),
	nameLabel: localtext({ en: "Your name", de: "Dein Name" }),
	nameHint: localtext({ en: "Required for voting", de: "Pflichtfeld zum Abstimmen" }),
	optionsHeading: localtext({ en: "Options", de: "Optionen" }),
	voteHeading: localtext({ en: "Your vote", de: "Deine Stimme" }),
	showVoters: localtext({ en: "Show voters", de: "Teilnehmer einblenden" }),
	hideVoters: localtext({ en: "Hide voters", de: "Teilnehmer ausblenden" }),
	votePlaceholder: localtext({ en: "Vote", de: "Abstimmen" }),
};

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
			<p>{props.survey.configuration.description || strings.defaultDescription}</p>
			<AutoSaveLabel />
		</section>

		<label class="name panel">
			{strings.nameLabel}
			<span class="hint">{strings.nameHint}</span>
			<input type="text" value={this.participantName} />
		</label>

		<section class="slots panel" aria-label={strings.optionsHeading}>
			<div class="schedule" style={`grid-template-columns: auto 1fr auto auto${
				this.votersVisible.val ? ` repeat(${Object.keys(props.survey.votes).length}, auto)` : ""
			}`}>
				<div class="schedule-head">
					<div class="heading">{strings.optionsHeading}</div>
					<div class="vote-heading">{strings.voteHeading}</div>
					<button
						class="toggle"
						type="button"
						aria-pressed={this.votersVisible.val}
						aria-label={this.votersVisible.val ? strings.hideVoters : strings.showVoters}
						onclick={() => this.votersVisible.val = !this.votersVisible.val}
					>
						{this.votersVisible.val ? "👤 ▲" : "👤 ▼"}
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
								{dateSlot.date.toLocaleDateString(UIX.language, { weekday: "short" })}
							</span>
							<span class="day">
								{dateSlot.date.toLocaleDateString(UIX.language, { day: "2-digit" })}
							</span>
							<span class="month">
								{dateSlot.date.toLocaleDateString(UIX.language, { month: "short" }).toUpperCase()}
							</span>
						</div>

						{dateSlot.times.map(timeSlot => {
							const key = slotKey(dateSlot, timeSlot);

							if (!(key in this.selectedOptions))
								this.selectedOptions[key] = "";

							return <div class="slot">
								<div class="time">
									<span class="range">
										{timeSlot.start.toLocaleTimeString(UIX.language, { hour: "2-digit", minute: "2-digit" })}
										{" – "}
										{timeSlot.end.toLocaleTimeString(UIX.language, { hour: "2-digit", minute: "2-digit" })}
									</span>
									<span class="duration">{formatDuration(timeSlot.end.getTime() - timeSlot.start.getTime())}</span>
								</div>

								<select
									class="vote"
									disabled={!this.participantName.val.trim()}
									value={this.selectedOptions[key]}
								>
									{!this.selectedOptions[key] && <option value="">{strings.votePlaceholder}</option>}
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
