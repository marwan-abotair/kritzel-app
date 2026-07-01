import { Component, template } from "uix/components/Component.ts";
import { ParticipantProps } from "common/surveys/surveys.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { emojiSentiments } from "./static/emoji-sentiments.ts";
import { formatDuration, Options } from "./survey.ts";
import { SlotKey, slotKey, Vote } from "./types.ts";
import { locale, t } from "common/i18n/i18n.ts";

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

	const nameInputId = "participant-name-input";

	return <main>
		<section class="meta panel">
			<h1>{props.survey.configuration.title || always(() => t("schedule_default_title"))}</h1>
			<p>{props.survey.configuration.description || always(() => t("schedule_default_description"))}</p>
			<AutoSaveLabel />
		</section>

		<div class="name panel">
			<label for={nameInputId}>
				{always(() => t("schedule_name_label"))}
				<span class="hint">{always(() => t("schedule_name_required_hint"))}</span>
			</label>
			<input
				id={nameInputId}
				type="text"
				value={this.participantName}
				autocomplete="name"
				aria-required="true"
			/>
		</div>

		<section class="slots panel" aria-label={always(() => t("schedule_options_heading"))}>
			<div class="schedule" style={`grid-template-columns: auto 1fr auto auto${
				this.votersVisible.val ? ` repeat(${Object.keys(props.survey.votes).length}, auto)` : ""
			}`}>
				<div class="schedule-head">
					<div class="heading" aria-hidden="true">{always(() => t("schedule_options_heading"))}</div>
					<div class="vote-heading" aria-hidden="true">{always(() => t("schedule_vote_heading"))}</div>
					<button
						class="toggle"
						type="button"
						aria-pressed={this.votersVisible.val}
						aria-label={always(() => this.votersVisible.val ? t("schedule_hide_voters") : t("schedule_show_voters"))}
						onclick={() => this.votersVisible.val = !this.votersVisible.val}
					>
						{this.votersVisible.val ? "👤 ▲" : "👤 ▼"}
					</button>
					{this.votersVisible.val && <div class="names" aria-label={always(() => t("schedule_hide_voters"))}>
						{Object.values(props.survey.votes).map(vote =>
							<div class="voter">{vote.name}</div>
						)}
					</div>}
				</div>

				{props.survey.configuration.dates.map(dateSlot =>
					<div class="date">
						<div class="badge" style={`grid-row: span ${dateSlot.times.length}`} aria-hidden="true">
							<span class="weekday">
								{always(() => dateSlot.date.toLocaleDateString(locale(), { weekday: "short" }))}
							</span>
							<span class="day">
								{always(() => dateSlot.date.toLocaleDateString(locale(), { day: "2-digit" }))}
							</span>
							<span class="month">
								{always(() => dateSlot.date.toLocaleDateString(locale(), { month: "short" }).toUpperCase())}
							</span>
						</div>

						{dateSlot.times.map(timeSlot => {
							const key = slotKey(dateSlot, timeSlot);

							if (!(key in this.selectedOptions))
								this.selectedOptions[key] = "";

							const startStr = always(() => timeSlot.start.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" }));
							const endStr = always(() => timeSlot.end.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" }));
							const dateStr = always(() => dateSlot.date.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }));
							const durationStr = formatDuration(timeSlot.end.getTime() - timeSlot.start.getTime());
							const slotLabel = always(() => `${dateStr.val}, ${startStr.val} – ${endStr.val}, ${durationStr}`);

							return <div class="slot">
								<div class="time" aria-hidden="true">
									<span class="range">
										{startStr}
										{" – "}
										{endStr}
									</span>
									<span class="duration">{durationStr}</span>
								</div>

								<select
									class="vote"
									disabled={!this.participantName.val.trim()}
									value={this.selectedOptions[key]}
									aria-label={always(() => `${t("schedule_vote_heading")}: ${slotLabel.val}`)}
								>
									{!this.selectedOptions[key] && <option value="">{always(() => t("schedule_vote_placeholder"))}</option>}
									{props.survey.configuration.voteOptions.map(option =>
										<option value={`${option.icon} ${option.label}`}>
											{option.icon} {option.label}
										</option>
									)}
								</select>

								<div
									class={`total ${slotVoteCounts[key] > 0 && slotVoteCounts[key] === highestVoteCount.val ? "max" : ""}`}
									aria-label={`${slotVoteCounts[key]}`}
								>
									{slotVoteCounts[key]}
								</div>

								{this.votersVisible.val && <div class="votes" aria-hidden="true">
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
