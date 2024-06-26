import {decodeMap} from "./codec/MapCodec";
import {GameMap} from "./GameMap";

const mapRegistry: EncodedMapData[] = [];

type EncodedMapData = {
	name: string;
	data: Uint8Array;
}

// noinspection JSUnusedLocalSymbols
function registerMap(name: string, base64Data: string) {
	mapRegistry.push({
		name: name,
		data: Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
	});
}

export function mapFromId(id: number): GameMap {
	const data = mapRegistry[id];
	if (!data) {
		throw new Error(`Map with id ${id} not found`);
	}
	const decoded = decodeMap(data.data);
	const map = new GameMap(data.name, decoded.width, decoded.height);
	for (let i = 0; i < decoded.tiles.length; i++) {
		map.setTileId(i, decoded.tiles[i]);
	}
	return map;
}

// The following lines are filled in by the build process
// BUILD_MAPS_REGISTER
// End of map register block