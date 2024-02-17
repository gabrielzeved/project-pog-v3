import { MAP_SIZE } from '$lib/constants';

export type Tile = number | AutoTile | null;

export interface Rule {
	tile: number;
	sameMask: number;
	differentMask: number;
}

export enum Direction {
	TOP_LEFT,
	TOP,
	TOP_RIGHT,
	LEFT,
	RIGHT,
	BOTTOM_LEFT,
	BOTTOM,
	BOTTOM_RIGHT
}

export class AutoTile {
	rules: Rule[] = [];

	constructor(public tile: number = 102) {}

	static mask(directions: Direction[]) {
		let mask = 0;

		for (const direction of directions) {
			mask |= 1 << direction;
		}
		return mask;
	}

	static directions(mask: number) {
		const directions: Direction[] = [];

		for (const dir of Object.values(Direction)) {
			if (typeof dir === 'number') {
				if (mask & (1 << dir)) directions.push(dir as Direction);
			}
		}
		return directions;
	}

	static isValid(value: number, mask: number) {
		return value & mask & ~mask;
	}

	determineTile(x: number, y: number, map: Tile[]) {
		let sameMask = 0;
		let differentMask = 0;

		for (let dY = 0; dY < 3; dY++) {
			for (let dX = 0; dX < 3; dX++) {
				if (dY == 1 && dX == 1) continue;

				const currentTile = map[(y + dY - 1) * MAP_SIZE + (x + dX - 1)];

				let maskIndex = dY * 3 + dX;
				maskIndex = maskIndex > 4 ? maskIndex - 1 : maskIndex;

				if (!currentTile) {
					differentMask |= 1 << maskIndex;
					continue;
				}

				if (currentTile instanceof AutoTile && currentTile.tile === this.tile) {
					sameMask |= 1 << maskIndex;
				} else {
					differentMask |= 1 << maskIndex;
				}
			}
		}

		return (
			this.rules.find(
				(rule) =>
					(sameMask & rule.sameMask) === rule.sameMask &&
					(differentMask & rule.differentMask) === rule.differentMask
			)?.tile ?? this.tile
		);
	}
}
