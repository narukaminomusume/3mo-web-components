import { eventListener, PropertyValues } from '@a11d/lit'
import { DialogActionKey, DialogParameters } from '@a11d/lit-application'
import { FetchableDialogComponentParameters, FetchableDialogComponent } from '@3mo/fetchable-dialog'
import { EntityDialog } from './EntityDialog.js'

export abstract class EntityDialogComponent<
	TEntity,
	TParameters extends Exclude<DialogParameters, void> = FetchableDialogComponentParameters,
	TResult = TEntity
> extends FetchableDialogComponent<TEntity, TParameters, TResult | undefined> {
	protected abstract save(entity: TEntity): (TEntity | void) | PromiseLike<TEntity | void>
	protected abstract delete?(entity: TEntity): void | PromiseLike<void>

	override get dialogElement() {
		if (super.dialogElement instanceof EntityDialog === false) {
			throw new Error('EntityDialogComponent must be used with an mo-entity-dialog element or a subclass thereof')
		}
		return super.dialogElement as EntityDialog<TEntity>
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.dialogElement.save = () => this.save(this.entity)
		if (this.delete && this.parameters.id) {
			this.dialogElement.delete = () => this.delete?.(this.entity)
		}
	}

	@eventListener({ target: window, type: 'keydown' })
	protected override async handleKeyDown(e: KeyboardEvent) {
		await super.handleKeyDown(e)
		if (!this.dialogElement.preventPrimaryOnCtrlS && e.key === 's' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			(document.activeElement as HTMLElement)?.blur()
			await this.handleAction(DialogActionKey.Primary)
		}
	}

	protected override async primaryAction() {
		return (await this.save(this.entity) || undefined) as TResult | undefined
	}

	protected override async secondaryAction() {
		if (this.parameters.id === undefined) {
			throw new Error('Cannot delete a new entity')
		}
		await this.delete?.(this.entity)
		return undefined
	}
}