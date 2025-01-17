import { component, css, eventListener, property } from '@a11d/lit'
import { SelectionListItem } from './SelectionListItem.js'

/**
 * @element mo-selectable-list-item
 *
 * @attr selected - Whether the list item is selected
 *
 * @fires change - Dispatched when the list item is selected or deselected
 */
@component('mo-selectable-list-item')
export class SelectableListItem extends SelectionListItem {
	@property({ type: Boolean, reflect: true }) selected = false

	static override get styles() {
		return css`
			${super.styles}

			:host([selected]) {
				background-color: var(--mo-selectable-list-item-selected-background, var(--mo-color-accent-transparent));
				color: var(--mo-selectable-list-item-selected-color, var(--mo-color-accent));
			}
		`
	}

	@eventListener('click')
	protected handleClick() {
		this.selected = !this.selected
		this.change.dispatch(this.selected)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-selectable-list-item': SelectableListItem
	}
}