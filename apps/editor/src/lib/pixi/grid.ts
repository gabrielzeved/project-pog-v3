import { SmoothGraphics } from '@pixi/graphics-smooth';

export class Grid extends SmoothGraphics {
	public correctedWidth = 0;

	constructor(
		public drawBoundaries: boolean,
		public cellSize: number = 16,
		public useCorrectedWidth: boolean = true,
		public _width: number = 200
	) {
		super();
		this.correctWidth();
	}

	getCellCoordinates(x: number, y: number) {
		return {
			x: Math.floor((x - this.bounds.x1) / this.cellSize),
			y: Math.floor((y - this.bounds.y1) / this.cellSize)
		};
	}

	get bounds() {
		return {
			x1: this.x,
			y1: this.y,
			x2: this.x + this.correctedWidth,
			y2: this.y + this.correctedWidth
		};
	}

	get amtLines() {
		return Math.floor(this.gridWidth / this.cellSize);
	}

	correctWidth() {
		if (!this.useCorrectedWidth) {
			this.correctedWidth = this._width;
		}

		this.correctedWidth = Math.ceil(Math.sqrt(this._width)) ** 2;
	}

	get gridWidth() {
		if (!this.useCorrectedWidth) {
			return this._width;
		}
		return Math.abs(this.cellSize - Math.sqrt(this.correctedWidth)) <= 1e-6
			? this.correctedWidth
			: this._width;
	}

	clearGrid(retainLineStyle = true) {
		const { width, alignment, color, alpha } = this.line;
		this.clear();

		if (!retainLineStyle) {
			return;
		}
		this.lineStyle(width, color, alpha, alignment);

		return this;
	}

	drawGrid() {
		this.clearGrid(true);
		for (
			let i = this.drawBoundaries ? 0 : 1;
			i <= this.amtLines - (this.drawBoundaries ? 0 : 1);
			i += 1
		) {
			const startCoord = i * this.cellSize;

			// draw the column
			this.moveTo(startCoord, 0);
			this.lineTo(startCoord, this.correctedWidth);

			// draw the row
			this.moveTo(0, startCoord);
			this.lineTo(this.correctedWidth, startCoord);
		}
		this.endFill();

		return this;
	}
}
