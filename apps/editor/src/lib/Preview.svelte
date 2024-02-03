<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	import { Cursor } from '$lib/pixi/cursor';
	import { Grid } from '$lib/pixi/grid';
	import { Viewport } from 'pixi-viewport';
	import * as PIXI from 'pixi.js';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let app: PIXI.Application;

	onMount(async () => {
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

		app = new PIXI.Application({
			background: '#000',
			view: canvas,
			resizeTo: container
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
		viewport.addChild(cursor);
	});
</script>

<div bind:this={container} class="w-full flex flex-col">
	<canvas bind:this={canvas}></canvas>
</div>
