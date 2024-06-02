import type { Entity } from '@ppog/shared';
import { vec2 } from 'gl-matrix';
import { Container } from 'pixi.js';
import type { Component } from '../engine/components/Component';
import { gameApp } from '../main';
export abstract class GameEntity<T extends Entity | undefined = Entity> extends Container {
	private _id!: string;
	private _name: string;
	public components: Map<string, Component> = new Map();
	public state: T;

	protected _serverPosition: vec2;

	constructor(name: string, state: T = undefined) {
		super();
		this._name = name;
		this.state = state;
		this.parentLayer = gameApp.layerManager.get('root');
		this.setupEvent();
	}

	setupEvent() {
		this.state.position.onChange(() => {
			this._serverPosition = [this.state.position.x, this.state.position.y];
		});
	}

	get id(): string {
		return this._id;
	}

	set id(id: string) {
		this._id = id;
	}

	get name(): string {
		return this._name;
	}

	/**
	 * Update container position
	 * @param x
	 * @param y
	 */
	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	kill() {
		this.components = new Map();
		this.destroy({ children: true });
	}

	update(deltaTime: number) {
		this.getAllComponents().forEach((component) => component.update(deltaTime));

		const newPosition: vec2 = [0, 0];
		vec2.lerp(
			newPosition,
			[this.position.x, this.position.y],
			this._serverPosition,
			0.6 * deltaTime * 1000
		);

		let direction = vec2.sub(
			[0, 0],
			[newPosition[0], newPosition[1]],
			[this.position.x, this.position.y]
		);

		if (vec2.length(direction) < 0.01) direction = [0, 0];

		this.position.x = newPosition[0];
		this.position.y = newPosition[1];
	}

	addComponent<T extends Component>(component: T): void {
		this.components.set(component.constructor.name, component);
	}

	hasComponent(componentName: string): boolean {
		return this.components.has(componentName) && !!this.components.get(componentName);
	}

	removeComponent(componentName: string): void {
		this.components.delete(componentName);
	}

	getComponent<T extends Component>(componentName: string): T | undefined {
		return this.components.get(componentName) as T;
	}

	getAllComponents() {
		return Array.from(this.components.values());
	}
}
