import {
	type HealthbarMetadata,
	type HealthbarVariant
} from '../../engine/components/HealthbarComponent';

export const HealthBarData: Record<HealthbarVariant, HealthbarMetadata> = {
	default: {
		offset: {
			x: 5,
			y: 7,
			height: 13,
			width: 8
		},
		rect: {
			x: 576,
			y: 0,
			width: 48,
			height: 16
		},
		slice: {
			bottomHeight: 6,
			leftWidth: 6,
			rightWidth: 6,
			topHeight: 9
		}
	},
	sharp: {
		offset: {
			x: 9,
			y: 7,
			width: 16,
			height: 13
		},
		rect: {
			x: 576,
			y: 64,
			width: 48,
			height: 16
		},
		slice: {
			leftWidth: 16,
			topHeight: 8,
			rightWidth: 16,
			bottomHeight: 7
		}
	},
	rounded: {
		offset: {
			x: 10,
			y: 6,
			height: 13,
			width: 18
		},
		rect: {
			x: 576,
			y: 128,
			width: 48,
			height: 16
		},
		slice: {
			leftWidth: 10,
			topHeight: 6,
			rightWidth: 8,
			bottomHeight: 7
		}
	}
};
