import { Component, template } from "uix/components/Component.ts";
import { Time } from "datex-core-legacy/types/time.ts";
import { localtext } from "datex-core-legacy/datex_short.ts";

type Props = {
    start: Ref<Time>;
    end: Ref<Time>;
    onRemove?: () => void;
};

const strings = {
    invalid: localtext({ en: "invalid", de: "ungültig" }),
    startLabel: localtext({ en: "Start time", de: "Startzeit" }),
    endLabel: localtext({ en: "End time", de: "Endzeit" }),
    removeLabel: localtext({ en: "Remove time slot", de: "Zeitslot entfernen" }),
};

@template(function (props) {
    const durationText = always(() => {
        if (!props.start.val || !props.end.val) return strings.invalid.val;

        const duration = props.end.val.getTime() - props.start.val.getTime();
        if (duration <= 0) return strings.invalid.val;

        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
            if (minutes > 0) return `${hours}h ${minutes}m`;
            else return `${hours}h`;
        } else return `${minutes}m`;
    });

    return <div class="time-slot">
        <input type="time" value={props.start} aria-label={strings.startLabel} />
        <input type="time" value={props.end} aria-label={strings.endLabel} />

        <div class={`duration ${durationText.val === strings.invalid.val ? "invalid" : ""}`}>
            {durationText}
        </div>

        <button type="button" class="remove" onclick={() => props.onRemove?.()} aria-label={strings.removeLabel}>✗</button>
    </div>;
})
export class TimeSlot extends Component<Props> {}
