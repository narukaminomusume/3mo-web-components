import { story, meta } from '../../.storybook/story.js'
import { html, style } from '@a11d/lit'
import p from './package.json'
import './index.js'

export default meta({
	title: 'Linear Progress',
	component: 'mo-linear-progress',
	parameters: {
		docs: {
			description: {
				component: p.description,
			},
		}
	}
})

export const Indeterminate = story({
	render: () => html`<mo-linear-progress></mo-linear-progress>`
})

export const WithProgress = story({
	args: { progress: 0.75 },
	argTypes: { progress: { control: 'number' } },
	render: ({ progress }) => html`<mo-linear-progress progress=${progress}></mo-linear-progress>`
})

export const WithBuffer = story({
	args: { buffer: 0.5 },
	argTypes: { buffer: { control: 'number' } },
	render: ({ buffer }) => html`<mo-linear-progress buffer=${buffer}></mo-linear-progress>`
})

export const WithProgressAndBuffer = story({
	args: { progress: 0.5, buffer: 0.75 },
	argTypes: { progress: { control: 'number' }, buffer: { control: 'number' } },
	render: ({ progress, buffer }) => html`<mo-linear-progress progress=${progress} buffer=${buffer}></mo-linear-progress>`
})

export const WithCustomStyles = story({
	render: () => html`
		<div>
			<mo-linear-progress ${style({ height: '20px', borderRadius: '100px' })}></mo-linear-progress>
			<br>
			<div ${style({ position: 'relative' })}>
				<mo-linear-progress progress='0.5' ${style({ height: '20px', borderRadius: '100px' })}></mo-linear-progress>
				<span ${style({ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', mixBlendMode: 'difference', color: 'white' })}>50%</span>
			</div>
		</div>
	`
})