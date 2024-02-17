import { Container } from 'pixi.js';
import type { Component } from '../engine/components/Component';
import { gameApp } from '../main';
export abstract class GameEntity extends Container {
	private _id!: string;
	private _name: string;
	public components: Map<string, Component> = new Map();

	constructor(name: string) {
		super();
		this._name = name;
		this.parentLayer = gameApp.layerManager.get('root');
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
