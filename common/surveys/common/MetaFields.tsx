import { Component, template } from "uix/components/Component.ts";
import { localtext } from "datex-core-legacy/datex_short.ts";

type Props = {
	title: Ref<string>;
	description: Ref<string>;
}

const strings = {
	titleLabel: localtext({ en: "Title", de: "Titel" }),
	titlePlaceholder: localtext({ en: "Name Your Survey", de: "Umfrage benennen" }),
	descriptionLabel: localtext({ en: "Description", de: "Beschreibung" }),
	descriptionPlaceholder: localtext({ en: "Describe Your Survey", de: "Umfrage beschreiben" }),
};

@template(function (props) {
	return <div class="meta">
		<label>
			{strings.titleLabel}
			<input type="text" class="title" value={props.title} placeholder={strings.titlePlaceholder} />
		</label>
		<label>
			{strings.descriptionLabel}
			<textarea class="description" value={props.description} placeholder={strings.descriptionPlaceholder}></textarea>
		</label>
	</div>;
})
export class MetaFields extends Component<Props> {}
