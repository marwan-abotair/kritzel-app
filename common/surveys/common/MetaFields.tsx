import { Component, template } from "uix/components/Component.ts";
import { t } from "common/i18n/i18n.ts";

type Props = {
    title: Ref<string>;
    description: Ref<string>;
}

@template(function (props) {
    return <div class="meta">
        <label>
            {always(() => t("meta_title_label"))}
            <input
                type="text"
                class="title"
                value={props.title}
                placeholder={always(() => t("meta_title_placeholder"))}
                aria-label={always(() => t("meta_title_label"))}
            />
        </label>
        <label>
            {always(() => t("meta_description_label"))}
            <textarea
                class="description"
                value={props.description}
                placeholder={always(() => t("meta_description_placeholder"))}
                aria-label={always(() => t("meta_description_label"))}
            ></textarea>
        </label>
    </div>;
})
export class MetaFields extends Component<Props> {}
