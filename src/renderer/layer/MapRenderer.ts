import {CachedLayer} from "./CachedLayer";
import {gameMap} from "../../game/Game";
import {MapMoveListener, MapScaleListener, mapTransformHandler} from "../../event/MapTransformHandler";
import {getSetting} from "../../util/UserSettingManager";

/**
 * Map background renderer.
 * All static map tiles (and possibly other static objects) should be rendered here.
 * @internal
 */
class MapRenderer extends CachedLayer implements MapMoveListener, MapScaleListener {
	constructor() {
		super();
		mapTransformHandler.move.register(this);
		mapTransformHandler.scale.register(this);
	}

	invalidateCaches(): void {
		this.resizeCanvas(gameMap.width, gameMap.height);
		const imageData = this.context.getImageData(0, 0, gameMap.width, gameMap.height);
		for (let i = 0; i < gameMap.width * gameMap.height; i++) {
			getSetting("theme").getTileColor(gameMap.getTile(i)).writeToBuffer(imageData.data, i * 4);
		}
		this.context.putImageData(imageData, 0, 0);
	}

	onMapMove(x: number, y: number): void {
		this.dx = x;
		this.dy = y;
	}

	onMapScale(scale: number): void {
		this.scale = scale;
	}
}

export const mapRenderer = new MapRenderer();