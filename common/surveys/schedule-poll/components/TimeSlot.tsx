import { Component, template } from "uix/components/Component.ts";
import { Time } from "datex-core-legacy/types/time.ts";
import { t } from "common/i18n/i18n.ts";

type Props = {
    start: Ref<Time>;
    end: Ref<Time>;
    onRemove?: () => void;
};

@template(function (props) {
    const durationText = always(() => {
        if (!props.start.val || !props.end.val) return "invalid";

        const duration = props.end.val.getTime() - props.start.val.getTime();
        if (duration <= 0) return "invalid";

        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
            if (minutes > 0) return `${hours}h ${minutes}m`;
            else return `${hours}h`;
        } else return `${minutes}m`;
    });

    return <div class="time-slot">
        <input
            type="time"
            value={props.start}
            aria-label={always(() => t("time_slot_start_label"))}
        />
        <input
            type="time"
            value={props.end}
            aria-label={always(() => t("time_slot_end_label"))}
        />

        <div class={`duration ${durationText.val === "invalid" ? "invalid" : ""}`} aria-live="polite">
            {durationText}
        </div>

        <button
            type="button"
            class="remove"
            onclick={() => props.onRemove?.()}
            aria-label={always(() => t("time_slot_remove"))}
        >✗</button>
    </div>;
})
export class TimeSlot extends Component<Props> {}
