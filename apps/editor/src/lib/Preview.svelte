<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	import { CELL_SIZE, MAP_SIZE } from '$lib/constants';
	import { AutoTile } from '$lib/pixi/autotile';
	import { Cursor } from '$lib/pixi/cursor';
	import { Grid } from '$lib/pixi/grid';
	import { asset, editorContext, initTextures, textures, type Layer } from '$lib/store';
	import { Tilemap } from '@pixi/tilemap';
	import { Viewport } from 'pixi-viewport';
	import * as PIXI from 'pixi.js';
	import { get } from 'svelte/store';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let app: PIXI.Application;
	let viewport: Viewport;
	let tilemaps: Map<string, Tilemap> = new Map();

	let leftButton: boolean = false;
	let rightButton: boolean = false;

	async function init() {
		await initTextures();

		app = new PIXI.Application({
			background: '#000',
			view: canvas,
			resizeTo: container
		});

		viewport = new Viewport({
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

		const cursor = new Cursor();
		cursor.draw();

		const grid = new Grid(true, CELL_SIZE, false, CELL_SIZE * MAP_SIZE);
		grid.interactive = true;
		grid.lineStyle({ width: 1, color: 0x1e1e1e });
		grid.drawGrid();

		viewport.interactive = true;
		viewport.on('mousemove', (evt) => {
			const point = viewport.toWorld(evt.global);
			const newPoint = new PIXI.Point(
				Math.floor(point.x / CELL_SIZE) * CELL_SIZE,
				Math.floor(point.y / CELL_SIZE) * CELL_SIZE
			);
			cursor.position.set(newPoint.x, newPoint.y);

			if (leftButton) {
				const value = get(editorContext.store);

				if (value.selectedTool === 'PENCIL') {
					editorContext.addTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
				} else if (value.selectedTool === 'BUCKET') {
					editorContext.floodFill(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
				}

				drawLayers();
			} else if (rightButton) {
				editorContext.removeTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
				drawLayers();
			}
		});

		viewport.on('mouseup', (evt) => {
			leftButton = false;
		});

		viewport.on('mousedown', (evt) => {
			if (evt.button != 0) return;
			const point = viewport.toWorld(evt.global);

			const value = get(editorContext.store);

			if (value.selectedTool === 'PENCIL') {
				editorContext.addTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
			} else if (value.selectedTool === 'BUCKET') {
				editorContext.floodFill(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
			}

			drawLayers();
			leftButton = true;
		});

		viewport.on('rightdown', (evt) => {
			rightButton = true;
			const point = viewport.toWorld(evt.global);

			const value = get(editorContext.store);

			if (value.selectedTool === 'PENCIL') {
				editorContext.removeTile(Math.floor(point.x / CELL_SIZE), Math.floor(point.y / CELL_SIZE));
			} else if (value.selectedTool === 'BUCKET') {
				editorContext.floodFill(
					Math.floor(point.x / CELL_SIZE),
					Math.floor(point.y / CELL_SIZE),
					true
				);
			}

			drawLayers();
		});

		viewport.on('rightup', (evt) => {
			rightButton = false;
		});

		viewport.addChild(grid);
		viewport.addChild(cursor);

		drawLayers($store.layers);

		canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	}

	async function drawLayers(layersList: Layer[] = []) {
		if (!asset) return;

		for (const layer of layersList) {
			if (tilemaps.has(layer.name)) continue;

			const tilemap = new Tilemap([asset.baseTexture]);

			tilemaps.set(layer.name, tilemap);

			viewport.addChild(tilemap);
		}

		const value = get(editorContext.store);

		for (const [key, tilemap] of tilemaps.entries()) {
			tilemap.clear();

			const layer = value.layers.find((layer) => layer.name === key);

			if (!layer) continue;
			if (!layer.visible) continue;

			for (let y = 0; y < MAP_SIZE; y++) {
				for (let x = 0; x < MAP_SIZE; x++) {
					const tile = layer.map[y * MAP_SIZE + x];

					if (tile != null) {
						if (tile instanceof AutoTile) {
							tilemap.tile(
								textures[`${tile.determineTile(x, y, layer.map)}`],
								x * CELL_SIZE,
								y * CELL_SIZE
							);
							continue;
						}

						tilemap.tile(textures[`${tile}`], x * CELL_SIZE, y * CELL_SIZE);
					}
				}
			}
		}
	}

	const store = editorContext.store;

	$: {
		drawLayers($store.layers);
	}

	onMount(async () => {
		await init();
	});
</script>

<div bind:this={container} class="w-full flex-1 flex flex-col">
	<canvas bind:this={canvas}></canvas>
</div>
