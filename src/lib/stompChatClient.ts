import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

type Handlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (e: unknown) => void;
};

export class StompChatClient {
  publish(_roomId: string, _payload: { content: string; }) {
      throw new Error("Method not implemented.");
  }
  private client: Client;
  private subscription?: StompSubscription;

  private wsUrl: string;
  private handlers: Handlers;
  private accessToken?: string;

  constructor(wsUrl: string, handlers: Handlers = {}) {
    this.wsUrl = wsUrl;
    this.handlers = handlers;

    this.client = new Client({
      brokerURL: this.wsUrl, // 예: ws://localhost:8080/ws-chat
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: undefined,
    });

    this.client.onConnect = () => this.handlers.onConnected?.();
    this.client.onDisconnect = () => this.handlers.onDisconnected?.();

    this.client.onStompError = (frame) => this.handlers.onError?.(frame);
    this.client.onWebSocketError = (evt) => this.handlers.onError?.(evt);
  }

  setAccessToken(token?: string) {
    this.accessToken = token;
  }

  connect() {
    this.client.connectHeaders = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};

    if (!this.client.active) this.client.activate();
  }

  async disconnect() {
    this.unsubscribe();
    if (this.client.active) await this.client.deactivate();
  }

  subscribeRoom(roomId: string, onMessage: (body: unknown, raw: IMessage) => void) {
    if (!this.client.connected) {
      throw new Error("STOMP not connected. Wait for onConnected before subscribe.");
    }

    const topic = `/topic/chat/rooms/${roomId}`;

    this.unsubscribe();
    this.subscription = this.client.subscribe(topic, (msg) => {
      try {
        onMessage(JSON.parse(msg.body), msg);
      } catch {
        onMessage(msg.body, msg);
      }
    });
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  publishToRoom(roomId: string, payload: unknown) {
    if (!this.client.connected) throw new Error("STOMP not connected.");

    const destination = `/app/chat/rooms/${roomId}`;
    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }
}
