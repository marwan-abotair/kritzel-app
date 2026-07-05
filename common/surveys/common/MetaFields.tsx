import { Component, template } from "uix/components/Component.ts";

type Props = {
	title: Ref<string>;
	description: Ref<string>;
}

@template(function (props) {
	return <div class="meta">
		<label>
			Titel
			<input type="text" class="title" value={props.title} placeholder="Benennen Sie Ihre Umfrage" />
		</label>
		<label>
			Beschreibung
			<textarea class="description" value={props.description} placeholder="Beschreiben Sie Ihre Umfrage"></textarea>
		</label>
	</div>;
})
export class MetaFields extends Component<Props> {}