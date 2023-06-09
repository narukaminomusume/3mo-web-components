import { EventListenerController, Controller, ReactiveControllerHost, ReactiveElement } from '@a11d/lit'
import { FocusController } from '@3mo/focus-controller'
import { isListItem } from './List.js'

export interface VirtualizedListItem {
	scrollIntoView(options?: ScrollIntoViewOptions): void
}

interface ListItem extends HTMLElement { }

export interface ListElement extends HTMLElement {
	readonly role: 'list'
	readonly items: Array<ListItem>
	readonly itemsLength?: number
	getItem?(index: number): VirtualizedListItem | ListItem | undefined
	getRenderedItemIndex?(item: ListItem): number | undefined
}

export class ListItemsKeyboardController extends Controller {
	constructor(protected override readonly host: ReactiveControllerHost & ReactiveElement & ListElement) {
		super(host)
	}

	private get items() { return this.host.items }

	private get itemsLength() { return this.host.itemsLength ?? this.items.length }

	protected getItem(index: number) {
		return this.host.getItem?.(index) ?? this.items[index]
	}

	protected getRenderedItemIndex(item: HTMLElement) {
		return this.host.getRenderedItemIndex?.(item) ?? this.items.indexOf(item)
	}

	private _focusedItemIndex?: number
	get focusedItemIndex() { return this._focusedItemIndex }
	set focusedItemIndex(value) {
		if (value !== undefined) {
			value %= this.itemsLength
		}

		this._focusedItemIndex = value

		if (value !== undefined) {
			const item = this.getItem(value)
			item?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
		}

		for (const item of this.items) {
			const willFocus = value !== undefined && this.getRenderedItemIndex(item) === value && this.isFocusable(item)
			item.toggleAttribute('focused', willFocus)
			if (willFocus) {
				item.focus()
			}
		}
	}

	private isFocusable(item: ListItem | VirtualizedListItem) {
		return !(item instanceof Element) || !item.hasAttribute('disabled')
	}

	override hostConnected() {
		this.host.tabIndex = 0
		this.items.forEach(item => item.tabIndex = -1)
	}

	override hostDisconnected() {
		this.host.tabIndex = -1
	}

	focusFirstItem() {
		console.log('FIRST ITEM FOCUSED', this.host)
		this.focusTraversal(0, 'forward')
	}

	focusLastItem() {
		this.focusTraversal(this.itemsLength - 1, 'backward')
	}

	focusNextItem() {
		!this.focusedItemIndex && console.log('UNMANAGED TRAVERSAL!', this.host)
		this.focusTraversal((this.focusedItemIndex ?? -1) + 1, 'forward')
	}

	focusPreviousItem() {
		this.focusTraversal((this.focusedItemIndex ?? 0) - 1, 'backward')
	}

	private focusTraversal(index: number, direction: 'forward' | 'backward') {
		/*let breakSafe = 0
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (breakSafe >= this.itemsLength) {
				break
			}

			const item = this.getItem(index)
			if (item && this.isFocusable(item)) {
				this.focusedItemIndex = index
				break
			}
			index = direction === 'forward' ? index + 1 : index - 1
			index = index % this.itemsLength
			breakSafe++
		}*/

		let item: any = undefined
		let i = (index + this.itemsLength) % this.itemsLength
		for (undefined;
			!(item && i === index) && !((item = this.getItem(i)) && this.isFocusable(item));
			i = (i + this.itemsLength + (direction === 'forward' ? +1 : -1)) % this.itemsLength) {
			continue
		}

		if (item && this.isFocusable(item)) {
			this.focusedItemIndex = i
			this.focus()
		}
	}

	focus() {
		this.focusedItemIndex ?? this.focusFirstItem()
		this.forceFocused = true
	}

	unfocus(force = true) {
		this.focusedItemIndex = undefined
		this.forceFocused = false
		force && this.host.blur()
		console.log('FOCUS LOST', this.host)
	}

	forceFocused = false

	protected readonly focusController = new FocusController(this.host, {
		handleChange: (focused, bubbled) => {
			if (!bubbled) {
				if (focused) {
					this.focus()
				} else {
					this.unfocus()
				}
			}
		},
	})

	get hasFocus() { return this.focusController.focused || this.forceFocused }

	protected readonly itemsPointerDownEventListener = new EventListenerController(this.host, {
		target: () => this.host,
		type: 'pointerdown',
		listener: (event: PointerEvent) => {
			const listItem = event.composedPath().find(item => isListItem(item as HTMLElement))
			this.focusedItemIndex = this.getRenderedItemIndex(listItem as ListItem)
		}
	})

	protected readonly keyDownEventListener = new EventListenerController(this.host, {
		type: 'keydown',
		target: document,
		listener: (event: KeyboardEvent) => {
			if (!this.hasFocus) {
				return
			}
			console.log('THIS HAS FOCUS?', `[FocusController]=${this.focusController.focused}`, `[ForceFocus]=${this.forceFocused}`, this.host)

			if (event.ctrlKey || event.shiftKey) {
				return
			}

			let prevent = false

			switch (event.key) {
				case 'Down':
				case 'ArrowDown':
					this.focusNextItem()
					prevent = true
					break
				case 'Up':
				case 'ArrowUp':
					this.focusPreviousItem()
					prevent = true
					break
				case 'Home':
				case 'PageUp':
					this.focusFirstItem()
					prevent = true
					break
				case 'End':
				case 'PageDown':
					this.focusLastItem()
					prevent = true
					break
				default:
					break
			}

			if (prevent) {
				event.stopPropagation()
				event.preventDefault()
			}
		}
	})
}