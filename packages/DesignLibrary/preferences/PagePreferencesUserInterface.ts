import { html, component, css, style } from '@a11d/lit'
import { route } from '@a11d/lit-application'
import { Background, ColorSet, Theme } from '@3mo/theme'
import { Color } from '@3mo/color'
import { DataGrid, DataGridPagination } from '@3mo/data-grid'
import { PagePreferences, PageSettings } from './index.js'

@component('mo-page-preferences-user-interface')
@route(PagePreferences, '/preferences/user-interface', '/preferences/ui')
export class PagePreferencesUserInterface extends PageSettings {
	private static readonly accentPresetColors = [
		new Color('rgb(0, 119, 200)'), // 3MO Blue
		new Color('rgb(0, 128, 128)'), // Teal
		new Color('rgb(171, 71, 188)'), // Purple
		new Color('rgb(104, 159, 56)'), // Green
		new Color('rgb(249, 168, 37)'), // Yellow
		new ColorSet('rgb(0, 119, 200)', 'rgb(0, 139, 220)', 'rgb(0, 159, 240)'), // Blue Gradient
		new ColorSet('rgb(0, 128, 128)', 'rgb(0, 148, 148)', 'rgb(0, 168, 168)'), // Teal Gradient
		new ColorSet('rgb(171, 71, 188)', 'rgb(191, 91, 208)', 'rgb(211, 111, 228)'), // Purple Gradient
		new ColorSet('rgb(104, 159, 56)', 'rgb(124, 179, 76)', 'rgb(144, 199, 96)'), // Green Gradient
		new ColorSet('rgb(249, 168, 37)', 'rgb(269, 188, 57)', 'rgb(289, 208, 77)'), // Yellow Gradient
		new ColorSet('rgb(102, 126, 234)', 'rgb(110, 101, 198)', 'rgb(118, 75, 162)'), // Plum Plate Gradient
		new ColorSet('rgb(247, 140, 160)', 'rgb(251, 125, 142)', 'rgb(254, 154, 139)'), // Strong Bliss Gradient
	]

	protected override initialized() {
		Theme.background.changed.subscribe(() => this.requestUpdate())
		Theme.accent.changed.subscribe(() => this.requestUpdate())
	}

	static override get styles() {
		return css`
			${super.styles}

			.themePreview {
				cursor: pointer;
				padding: 10px;
				height: 100px;
				width: min(100%, 150px);
				border: 4px solid var(--mo-color-gray);
				border-radius: var(--mo-border-radius);
				background: var(--preview-background);
			}

			.themePreview[data-active] {
				border-color: var(--mo-color-accent);
			}

			.themePreview[data-background=light] {
				--preview-background: white;
				--preview-foreground: black;
			}

			.themePreview[data-background=dark] {
				--preview-background: black;
				--preview-foreground: white;
			}

			.themePreview[data-background=system] {
				--preview-background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(255,255,255,0.75) 100%);
				--preview-foreground: var(--mo-color-foreground);
			}

			.themePreview div {
				border-radius: var(--mo-border-radius);
				height: 2px;
				width: 100%;
				background-color: var(--preview-foreground);
				opacity: 0.8;
			}

			.accentPreview {
				cursor: pointer;
				justify-self: center;
				border: none;
				width: 25px;
				height: 25px;
				border-radius: 50%;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-page heading='User-Interface'>
				<mo-flex gap='18px'>
					<mo-section heading='Farbthemen'>
						<mo-card ${style({ height: '*', alignItems: 'center' })}>
							<mo-flex direction='horizontal' gap='10px'>
								<mo-flex direction='horizontal' gap='10px' ${style({ width: '*' })}>
									${this.getBackgroundColorTemplate(Background.System)}
									${this.getBackgroundColorTemplate(Background.Light)}
									${this.getBackgroundColorTemplate(Background.Dark)}
								</mo-flex>
								<mo-grid gap='10px' columns='* * *'>
									${PagePreferencesUserInterface.accentPresetColors.map(color => this.getForegroundColorTemplate(color))}
									<!-- .presets={PagePreferencesUserInterface.accentPresetColors} -->
									<mo-color-picker ${style({ width: '100%', gridColumn: '1 / -1' })}
										.value=${Theme.accent.medianColor}
										@input=${(e: CustomEvent<Color>) => Theme.accent.value = e.detail}
										@change=${(e: CustomEvent<Color>) => Theme.accent.value = e.detail}
									></mo-color-picker>
								</mo-grid>
							</mo-flex>
						</mo-card>
					</mo-section>

					<mo-section heading='Tabellen'>
						<mo-flex gap='var(--mo-thickness-l)'>
							<mo-list-item>
								Zeilen pro Seite
								<mo-field-select-data-grid-page-size dense
									${style({ width: '150px' })}
									value=${DataGrid.pageSize.value}
									@change=${(e: CustomEvent<Exclude<DataGridPagination, 'auto'>>) => DataGrid.pageSize.value = e.detail}
								></mo-field-select-data-grid-page-size>
							</mo-list-item>

							<mo-list-item>
								Höhe der Zeilen
								<mo-slider max='50' min='30' step='5'
									${style({ width: '150px', margin: '0 -15px' })}
									value=${DataGrid.rowHeight.value}
									@change=${(e: CustomEvent<number>) => DataGrid.rowHeight.value = e.detail}
								></mo-slider>
							</mo-list-item>

							<mo-checkbox-list-item
								?checked=${DataGrid.hasAlternatingBackground.value}
								@change=${(e: CustomEvent<CheckboxValue>) => DataGrid.hasAlternatingBackground.value = e.detail === 'checked'}
							>Wechselnder Hintergrund</mo-checkbox-list-item>
						</mo-flex>
					</mo-section>

					<mo-section heading='Dialoge'>
						<mo-list-item>
							Popup-fähige Dialoge immer öffnen
							<mo-field-select-poppable-dialog-confirmation-strategy dense
								${style({ width: '150px' })}
							></mo-field-select-poppable-dialog-confirmation-strategy>
						</mo-list-item>
					</mo-section>
				</mo-flex>
			</mo-page>
		`
	}

	private getBackgroundColorTemplate(background: Background) {
		const getName = () => {
			switch (background) {
				case Background.System: return 'Systemfarbe'
				case Background.Light: return 'Hell'
				case Background.Dark: return 'Dunkel'
			}
		}
		return html`
			<mo-flex ${style({ width: '*' })} gap='var(--mo-thickness-l)' alignItems='center'>
				<button class='themePreview'
					data-background=${background}
					?data-active=${Theme.background.value === background}
					@click=${() => Theme.background.value = background}
				>
					<mo-flex gap='var(--mo-thickness-l)'>
						<div ${style({ position: 'relative', opacity: 1, background: 'var(--mo-color-accent)', height: '20px', width: '100%' })}>
							<div ${style({ insetInlineStart: '30%', top: '8px', position: 'absolute', background: 'var(--mo-color-on-accent)', height: '4px', width: '40%', opacity: '1' })}></div>
						</div>
						<div ${style({ background: 'var(--mo-color-accent)', height: '4px', width: '50%', opacity: '1' })}></div>
						<div ${style({ width: '100%' })}></div>
						<div ${style({ width: '100%' })}></div>
						<div ${style({ width: '80%' })}></div>
					</mo-flex>
				</button>
				<mo-heading typography='heading5' ${style({ textAlign: 'center' })}>
					${getName()}
				</mo-heading>
			</mo-flex>
		`
	}

	private getForegroundColorTemplate(color: Color | ColorSet) {
		const background = color instanceof Color ? color.hex : color.medianColor.hex
		return html`
			<button class='accentPreview' ${style({ background: background })}
				@click=${() => Theme.accent.value = color}
			></button>
		`
	}
}