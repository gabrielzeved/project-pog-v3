import { MapSchema, ArraySchema, Schema, type } from '@colyseus/schema';

export class ChatMessage extends Schema {
  @type('string') sender: string = '';
  @type('string') message: string = '';
  @type('number') timestamp: number = 0.0;
  @type('number') createdAt: number = Date.now();
}

export class ChatRoomState extends Schema {
  @type({ array: ChatMessage }) chatMessages = new ArraySchema<ChatMessage>();
}
