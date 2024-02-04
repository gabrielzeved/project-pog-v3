import { CELL_SIZE } from '$lib/constants';
import { Graphics } from 'pixi.js';

export class Cursor extends Graphics {
	constructor(
		public cellWidth: number = 1,
		public cellHeight: number = 1
	) {
		super();
	}

	draw() {
		this.clear();
		this.lineStyle(1, 0x16b5ff, 1);
		this.beginFill(0x16b5ff, 0.4);
		this.drawRect(0, 0, CELL_SIZE * this.cellWidth, CELL_SIZE * this.cellHeight);
		this.endFill();
	}
}
