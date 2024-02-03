<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	import { Cursor } from '$lib/pixi/cursor';
	import { generateSpritesheetData } from '$lib/pixi/generateSpritesheetData';
	import { Grid } from '$lib/pixi/grid';
	import { Tilemap } from '@pixi/tilemap';
	import { Viewport } from 'pixi-viewport';
	import * as PIXI from 'pixi.js';

	let canvas: HTMLCanvasElement;
	let app: PIXI.Application;

	onMount(async () => {
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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
				minScale: 0.6,
				maxScale: 8
			})

			.drag()
			.pinch()
			.wheel()
			.decelerate({
				friction: 0.8
			});

		const asset = await PIXI.Assets.load('/spr_grass_tileset.png');
		asset.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

		const tilemap = new Tilemap([asset.baseTexture]);

		const spritesheeData = generateSpritesheetData(asset, 16, 16);
		const spritesheet = new PIXI.Spritesheet(asset, spritesheeData);
		await spritesheet.parse();
		const cellXCount = asset.baseTexture.width / 16;
		const cellYCount = asset.baseTexture.height / 16;

		for (let y = 0; y < cellYCount; y++) {
			for (let x = 0; x < cellXCount; x++) {
				tilemap.tile(spritesheet.textures[`${y * cellYCount + x}`], x * 16, y * 16);
			}
		}

		const cursor = new Cursor();
		cursor.draw();

		const grid = new Grid(true, 16, false, 1024);
		grid.interactive = true;
		grid.lineStyle({ width: 1, color: 0x1e1e1e });
		grid.drawGrid();

		viewport.interactive = true;
		viewport.on('mousemove', (evt) => {
			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(Math.floor(point.x / 16) * 16, Math.floor(point.y / 16) * 16);
			cursor.position.set(newPoint.x, newPoint.y);
		});

		viewport.addChild(grid);
		viewport.addChild(tilemap);
		viewport.addChild(cursor);
	});
</script>

<canvas bind:this={canvas}></canvas>
