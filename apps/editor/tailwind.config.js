/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
    fontFamily: {
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Roboto Mono', 'monospace']
    },
		extend: {
			colors: {
				elevation1: '#292d39',
				elevation2: '#181c20',
				elevation3: '#373c4b',
				accent1: '#0066dc',
				accent2: '#007bff',
				accent3: '#3c93ff',
				highlight1: '#535760',
				highlight2: '#8c92a4',
				highlight3: '#fefefe',
				vivid1: '#ffcc00',
				error1: '#DB3D3D',
				error2: '#F64545',
				error3: '#FF5C5C'
			},
			boxShadow: {
				default:
					'0px 2px 0px 0px #373c4b inset, 0px -2px 0px 0px #373c4b inset, -2px 0px 0px 0px #373c4b inset, 2px 0px 0px 0px #373c4b inset, 0px 2px 0px 0px #535760, 2px 0px 0px 0px #535760, -2px 0px 0px 0px #535760, 0px -2px 0px 0px #535760, 0px 4px 0px 0px rgba(25, 25, 25, .8)'
			}
		}
	},
	plugins: []
};
