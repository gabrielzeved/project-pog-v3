export interface WorldData {
  height: number;
  width: number;
  layers: Layer[];
  tileWidth: number;
  tileHeight: number;
  tilesets: Tileset[];
}

export interface Tileset {
  firstId: number;
  image: string;
  name: string;
  objects?: Object[];
}

export interface Layer {
  data: number[];
  objects?: Object[];
  id: number;
  name: string;
  visible: boolean;
  properties?: Partial<Properties>;
}

export interface Properties {
  solid: boolean;
  zIndex: number;
}

export interface Object {
  id: number;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: Partial<Properties>;
}
