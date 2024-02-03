import { type ISpritesheetData, type Texture } from 'pixi.js';

export function generateSpritesheetData(texture: Texture, cellWidth: number, cellHeight: number) {
	const cellXCount = texture.baseTexture.width / cellWidth;
	const cellYCount = texture.baseTexture.height / cellHeight;

	const data: ISpritesheetData = {
		frames: {},
		meta: {
			scale: 1
		}
	};

	for (let y = 0; y < cellYCount; y++) {
		for (let x = 0; x < cellXCount; x++) {
			data.frames[y * cellYCount + x] = {
				frame: {
					h: cellHeight,
					w: cellWidth,
					x: x * cellWidth,
					y: y * cellHeight
				},
				sourceSize: {
					h: cellHeight,
					w: cellWidth
				},
				spriteSourceSize: {
					h: cellHeight,
					w: cellWidth,
					x: x * cellWidth,
					y: y * cellHeight
				}
			};
		}
	}

	return data;
}
