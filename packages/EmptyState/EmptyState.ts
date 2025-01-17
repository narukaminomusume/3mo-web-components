import { html, component, Component, property, nothing, css } from '@a11d/lit'
import { MaterialIcon } from '@3mo/icon'

/**
 * @element mo-empty-state
 *
 * @attr icon
 *
 * @slot - Error message
 */
@component('mo-empty-state')
export class EmptyState extends Component {
	@property() icon?: MaterialIcon

	static override get styles() {
		return css`
			:host {
				display: flex;
			}

			:host, mo-flex {
				align-items: center;
				justify-content: center;
				text-align: center;
				color: var(--mo-color-gray);
			}

			mo-heading {
				font-weight: 600;
			}

			mo-icon {
				font-size: 48px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex gap='8px'>
				${!this.icon ? nothing : html`<mo-icon icon=${this.icon}></mo-icon>`}
				<mo-heading>
					<slot></slot>
				</mo-heading>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-empty-state': EmptyState
	}
}