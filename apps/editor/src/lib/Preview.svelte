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
	import { get } from 'svelte/store';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let app: PIXI.Application;
	let dragging: boolean = false;

	onMount(async () => {
		app = new PIXI.Application({
			background: '#000',
			view: canvas,
			resizeTo: container
		});

		const viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			events: app.renderer.events
		});

		app.stage.addChild(viewport);

		viewport
			.clampZoom({
				minScale: 0.6,
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

		const cursor = new Cursor();
		cursor.draw();

		const grid = new Grid(true, CELL_SIZE, false, CELL_SIZE * MAP_SIZE);
		grid.interactive = true;
		grid.lineStyle({ width: 1, color: 0x1e1e1e });
		grid.drawGrid();

		const tilemap = new Tilemap([asset.baseTexture]);

		function drawMap() {
			tilemap.clear();

			const value = get(editorContext.store);

			for (let y = 0; y < MAP_SIZE; y++) {
				for (let x = 0; x < MAP_SIZE; x++) {
					const tileIndex = value.map[y * MAP_SIZE + x];

					if (tileIndex != null) {
						tilemap.tile(spritesheet.textures[`${tileIndex}`], x * CELL_SIZE, y * CELL_SIZE);
					}
				}
			}
		}

		viewport.interactive = true;
		viewport.on('mousemove', (evt) => {
			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(
				Math.floor(point.x / CELL_SIZE) * CELL_SIZE,
				Math.floor(point.y / CELL_SIZE) * CELL_SIZE
			);
			cursor.position.set(newPoint.x, newPoint.y);

			if (dragging) {
				editorContext.addTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
				drawMap();
			}
		});

		const spritesheeData = generateSpritesheetData(asset, CELL_SIZE, CELL_SIZE);
		const spritesheet = new PIXI.Spritesheet(asset, spritesheeData);
		await spritesheet.parse();

		viewport.on('mouseup', (evt) => {
			if (evt.button != 0) return;

			dragging = false;
		});

		viewport.on('mousedown', (evt) => {
			if (evt.button != 0) return;

			dragging = true;

			const point = viewport.toWorld(evt.global);

			editorContext.addTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
			drawMap();
		});

		viewport.addChild(grid);
		viewport.addChild(tilemap);
		viewport.addChild(cursor);
	});
</script>

<div bind:this={container} class="w-full flex-1 flex flex-col">
	<canvas bind:this={canvas}></canvas>
</div>
