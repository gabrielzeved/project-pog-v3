<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	import { CELL_SIZE, MAP_SIZE } from '$lib/constants';
	import { Cursor } from '$lib/pixi/cursor';
	import { generateSpritesheetData } from '$lib/pixi/generateSpritesheetData';
	import { Grid } from '$lib/pixi/grid';
	import { editorContext } from '$lib/store';
	import { Tilemap } from '@pixi/tilemap';
	import { Viewport } from 'pixi-viewport';
	import * as PIXI from 'pixi.js';

	let canvas: HTMLCanvasElement;
	let app: PIXI.Application;
	let dragging: boolean = false;
	let startingPoint: PIXI.Point;

	onMount(async () => {
		app = new PIXI.Application({
			background: '#000',
			width: 400,
			height: 400,
			view: canvas
		});

		const viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldHeight: 1048,
			worldWidth: 1048,
			events: app.renderer.events
		});

		app.stage.addChild(viewport);

		viewport
			.clampZoom({
				minScale: 0.4,
				maxScale: 8
			})

			.drag({
				mouseButtons: 'middle'
			})
			.pinch()
			.wheel()
			.decelerate({
				friction: 0.8
			});

		const asset = await PIXI.Assets.load('/spr_grass_tileset.png');
		asset.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

		const tilemap = new Tilemap([asset.baseTexture]);

		const spritesheeData = generateSpritesheetData(asset, CELL_SIZE, CELL_SIZE);
		const spritesheet = new PIXI.Spritesheet(asset, spritesheeData);
		await spritesheet.parse();
		const cellXCount = asset.baseTexture.width / CELL_SIZE;
		const cellYCount = asset.baseTexture.height / CELL_SIZE;

		for (let y = 0; y < cellYCount; y++) {
			for (let x = 0; x < cellXCount; x++) {
				tilemap.tile(spritesheet.textures[`${y * cellYCount + x}`], x * CELL_SIZE, y * CELL_SIZE);
			}
		}

		const cursor = new Cursor();
		cursor.draw();

		const selectedCursor = new Cursor();
		selectedCursor.draw();

		const grid = new Grid(true, CELL_SIZE, false, CELL_SIZE * MAP_SIZE);
		grid.interactive = true;
		grid.lineStyle({ width: 1, color: 0x1e1e1e });
		grid.drawGrid();

		viewport.interactive = true;

		viewport.on('mousemove', (evt) => {
			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(
				Math.floor(point.x / CELL_SIZE),
				Math.floor(point.y / CELL_SIZE)
			);
			cursor.position.set(newPoint.x * CELL_SIZE, newPoint.y * CELL_SIZE);

			if (dragging) {
				const minPoint = new PIXI.Point(
					Math.min(newPoint.x, startingPoint.x),
					Math.min(newPoint.y, startingPoint.y)
				);

				const maxPoint = new PIXI.Point(
					Math.max(newPoint.x, startingPoint.x),
					Math.max(newPoint.y, startingPoint.y)
				);

				selectedCursor.cellWidth = maxPoint.x - minPoint.x + 1;
				selectedCursor.cellHeight = maxPoint.y - minPoint.y + 1;
				selectedCursor.position.set(minPoint.x * CELL_SIZE, minPoint.y * CELL_SIZE);
				selectedCursor.draw();
			}
		});

		viewport.on('mousedown', (evt) => {
			dragging = true;

			if (evt.button != 0) return;

			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(
				Math.floor(point.x / CELL_SIZE),
				Math.floor(point.y / CELL_SIZE)
			);

			startingPoint = newPoint;

			const tileIndex = newPoint.y * cellYCount + newPoint.x;
			editorContext.setSelectedTiles([[tileIndex]]);
			selectedCursor.position.set(startingPoint.x * CELL_SIZE, startingPoint.y * CELL_SIZE);

			selectedCursor.cellWidth = 1;
			selectedCursor.cellHeight = 1;
			selectedCursor.draw();
		});

		viewport.on('mouseup', (evt) => {
			dragging = false;

			if (evt.button != 0) return;

			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(
				Math.floor(point.x / CELL_SIZE),
				Math.floor(point.y / CELL_SIZE)
			);

			const selectedTiles = [];

			const minPoint = new PIXI.Point(
				Math.min(newPoint.x, startingPoint.x),
				Math.min(newPoint.y, startingPoint.y)
			);

			const maxPoint = new PIXI.Point(
				Math.max(newPoint.x, startingPoint.x),
				Math.max(newPoint.y, startingPoint.y)
			);

			for (let x = minPoint.x; x <= maxPoint.x; x++) {
				const col = [];
				for (let y = minPoint.y; y <= maxPoint.y; y++) {
					const tileIndex = y * cellYCount + x;

					col.push(tileIndex);
				}
				selectedTiles.push(col);
			}

			editorContext.setSelectedTiles(selectedTiles);

			selectedCursor.cellWidth = maxPoint.x - minPoint.x + 1;
			selectedCursor.cellHeight = maxPoint.y - minPoint.y + 1;
			selectedCursor.position.set(minPoint.x * CELL_SIZE, minPoint.y * CELL_SIZE);
			selectedCursor.draw();
		});

		viewport.addChild(grid);
		viewport.addChild(tilemap);
		viewport.addChild(cursor);
		viewport.addChild(selectedCursor);
	});
</script>

<canvas bind:this={canvas}></canvas>
