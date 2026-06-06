import { Component, template } from "uix/components/Component.ts";
import { Time } from "datex-core-legacy/types/time.ts";

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
        <input type="time" value={props.start} />
        <input type="time" value={props.end} />

        <div class={`duration ${durationText.val === "invalid" ? "invalid" : ""}`}>
            {durationText}
        </div>

        <button type="button" class="remove" onclick={() => props.onRemove?.()}>✗</button>
    </div>;
})
export class TimeSlot extends Component<Props> {}