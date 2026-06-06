import { Component, template } from "uix/components/Component.ts";

type Props = {
	title: Ref<string>;
	description: Ref<string>;
}

@template(function (props) {
	return <div class="meta">
		<label>
			Title
			<input type="text" class="title" value={props.title} placeholder="Name Your Survey" />
		</label>
		<label>
			Description
			<textarea class="description" value={props.description} placeholder="Describe Your Survey"></textarea>
		</label>
	</div>;
})
export class MetaFields extends Component<Props> {}