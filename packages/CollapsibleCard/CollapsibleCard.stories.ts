import { story, meta } from '../../.storybook/story.js'
import { html, style } from '@a11d/lit'
import p from './package.json'
import './index.js'

export default meta({
	title: 'CollapsibleCard',
	component: 'mo-collapsible-card',
	args: {
		type: 'filled',
		heading: 'Satoshi Nakamoto',
		subHeading: 'On 9th of January 2009',
		content: `A purely peer-to-peer version of electronic cash would allow online
			payments to be sent directly from one party to another without going through a
			financial institution. Digital signatures provide part of the solution, but the main
			benefits are lost if a trusted third party is still required to prevent double-spending.
			We propose a solution to the double-spending problem using a peer-to-peer network.
			The network timestamps transactions by hashing them into an ongoing chain of
			hash-based proof-of-work, forming a record that cannot be changed without redoing
			the proof-of-work. The longest chain not only serves as proof of the sequence of
			events witnessed, but proof that it came from the largest pool of CPU power. As
			long as a majority of CPU power is controlled by nodes that are not cooperating to
			attack the network, they'll generate the longest chain and outpace attackers. The
			network itself requires minimal structure. Messages are broadcast on a best effort
			basis, and nodes can leave and rejoin the network at will, accepting the longest
			proof-of-work chain as proof of what happened while they were gone.`,
	},
	argTypes: {
		type: { control: { type: 'select', options: ['filled', 'outlined'] } },
		heading: { control: 'text' },
		subHeading: { control: 'text' },
		content: { control: 'text' },
	},
	parameters: {
		docs: {
			description: {
				component: p.description,
			},
		}
	}
})

export const CollapsibleCard = story({
	render: ({ type, heading, subHeading, content }) => html`
		<mo-collapsible-card type=${type} heading=${heading} subHeading=${subHeading} ${style({ width: '400px' })}>
			${content}
		</mo-collapsible-card>
	`
})