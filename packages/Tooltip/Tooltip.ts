import { component, css, property, html, unsafeCSS, Component, query, ifDefined } from '@a11d/lit'
import { Popover, PopoverPlacement } from '@3mo/popover'
import { TooltipPlacement } from './TooltipPlacement.js'

/**
 * @element mo-tooltip
 *
 * @attr placement - The placement of the tooltip.
 * @attr anchor - The element id that the tooltip is anchored to.
 *
 * @slot - Default slot for tooltip content
 */
@component('mo-tooltip')
export class Tooltip extends Component {
	private static readonly instancesContainer = new Set<Tooltip>()
	private static openInstance?: Tooltip
	private static getLeftPositionOffset = (anchorRect: DOMRect, popoverRect: DOMRect) => anchorRect.width / 2 - popoverRect.width / 2
	private static getTopPositionOffset = (anchorRect: DOMRect, popoverRect: DOMRect) => anchorRect.height / 2 - popoverRect.height / 2

	@property() placement?: TooltipPlacement
	@property({ type: Object }) anchor?: HTMLElement

	@property({ type: Boolean, reflect: true }) protected rich?: boolean

	@query('mo-popover') protected readonly popover!: Popover

	protected override connected() {
		Tooltip.instancesContainer.add(this)
	}

	protected override disconnected() {
		Tooltip.instancesContainer.delete(this)
	}

	static override get styles() {
		return css`
			:host {
				display: inline-block;
			}

			mo-popover {
				border-radius: var(--mo-toolbar-border-radius, var(--mo-border-radius, 4px));
				transition-duration: 175ms;
				transition-property: opacity, transform;
			}

			mo-popover[placement="${unsafeCSS(PopoverPlacement.Top)}"] {
				transform: translateY(+10px);
			}

			mo-popover[placement="${unsafeCSS(PopoverPlacement.Bottom)}"] {
				transform: translateY(-10px);
			}

			mo-popover[placement="${unsafeCSS(PopoverPlacement.Left)}"] {
				transform: translateX(+10px);
			}

			mo-popover[placement="${unsafeCSS(PopoverPlacement.Right)}"] {
				transform: translateX(-10px);
			}

			mo-popover[open] {
				transform: translate(0);
			}

			:host(:not([rich])) mo-popover {
				background: var(--mo-tooltip-surface-color, var(--mo-color-surface, rgba(255, 255, 255, 0.75)));
				backdrop-filter: blur(40px);
				color: var(--mo-color-foreground);
				box-shadow: var(--mo-tooltip-shadow, var(--mo-shadow-deep, 0px 5px 5px -3px rgba(95, 81, 78, 0.2), 0px 8px 10px 1px rgba(95, 81, 78, 0.14), 0px 3px 14px 2px rgba(95, 81, 78, 0.12)));
				padding: 8px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-popover
				.anchor=${this.anchor}
				placement=${ifDefined(this.placement)}
				openOnFocus
				openOnHover
				.getLeftPositionOffset=${Tooltip.getLeftPositionOffset}
				.getTopPositionOffset=${Tooltip.getTopPositionOffset}
				@openChange=${this.handleOpenChange.bind(this)}
			>
				<slot @slotChange=${() => this.rich = this.childElementCount > 0}></slot>
			</mo-popover>
		`
	}

	protected handleOpenChange(event: CustomEvent<boolean>) {
		const open = event.detail
		if (open) {
			Tooltip.openInstance = this
		}

		for (const tooltip of [...Tooltip.instancesContainer.values()].filter(t => t !== this)) {
			tooltip.popover.open = Tooltip.openInstance === tooltip
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tooltip': Tooltip
	}
}