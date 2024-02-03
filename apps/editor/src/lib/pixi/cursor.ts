import { Graphics } from 'pixi.js';

export class Cursor extends Graphics {
	draw() {
		this.lineStyle(1, 0x16b5ff, 1);
		this.beginFill(0x16b5ff, 0.4);
		this.drawRect(0, 0, 16, 16);
		this.endFill();
	}
}
