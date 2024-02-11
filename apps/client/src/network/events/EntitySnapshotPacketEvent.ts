import type { EntitySnapshotPacket } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { ComponentNames } from '../../engine/components/Component';
import type { NetworkEntityComponent } from '../../engine/components/NetworkEntityComponent';
import { PlayerControllerComponent } from '../../engine/components/PlayerControllerComponent';
import { gameApp } from '../../main';
import type { Client } from '../Client';

export default function EntitySnapshotPacketEvent(_client: Client, packet: EntitySnapshotPacket) {
	const entity = gameApp.getEntity(packet.data.id);

	if (!entity) return;

	if (entity.id === _client.entityId) {
		entity
			.getComponent<PlayerControllerComponent>(ComponentNames.PlayerController)
			?.onNetworkUpdate(packet.data);
	} else {
		entity
			.getComponent<NetworkEntityComponent>(ComponentNames.NetworkEntity)
			?.onNetworkUpdate(packet.data);
	}
}
