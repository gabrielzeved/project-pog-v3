import * as PIXI from 'pixi.js';

export async function getBase64TileTexture(texture: PIXI.Texture, width: number, height: number) {
	const renderer = PIXI.autoDetectRenderer();
	const renderTexture = PIXI.RenderTexture.create({
		width,
		height
	});

	const spr = PIXI.Sprite.from(texture);
	spr.width = width;
	spr.height = height;
	renderer.render(spr, { renderTexture });

	const base64Image = await renderer.extract.base64(renderTexture);

	renderTexture.destroy();
	spr.destroy();
	renderer.destroy();

	return base64Image;
}
