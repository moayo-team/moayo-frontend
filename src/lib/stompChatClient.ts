import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

type Handlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (e: unknown) => void;
};

export class StompChatClient {
  private wsUrl: string;
  private handlers: Handlers;
  private client: Client;
  private sub?: StompSubscription;
  private accessToken?: string;

  constructor(wsUrl: string, handlers: Handlers = {}) {
    this.wsUrl = wsUrl;
    this.handlers = handlers;

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 2000,
      debug: () => {},

      onConnect: () => {
        console.log("[STOMP] ✅ CONNECTED", wsUrl);
        this.handlers.onConnected?.();
      },
      onDisconnect: () => {
        console.log("[STOMP] ⛔ DISCONNECTED");
        this.handlers.onDisconnected?.();
      },
      onStompError: (frame) => {
        console.error("[STOMP] ❌ STOMP ERROR", frame);
        this.handlers.onError?.(frame);
      },
      onWebSocketError: (evt) => {
        console.error("[STOMP] ❌ WS ERROR", evt);
        this.handlers.onError?.(evt);
      },
    });
  }

  setAccessToken(token?: string) {
    this.accessToken = token;
  }

  connect() {
    this.client.connectHeaders = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};

    console.log("[STOMP] connect() brokerURL =", this.wsUrl);
    this.client.activate();
  }

  async disconnect() {
    this.sub?.unsubscribe();
    this.sub = undefined;
    await this.client.deactivate();
  }

  // ✅ 구독: /topic/chat/rooms/{roomId}
  subscribeRoom(roomId: string, onMessage: (body: any, raw: IMessage) => void) {
    const topic = `/topic/chat/rooms/${roomId}`;
    console.log("[STOMP] subscribe topic =", topic);

    this.sub?.unsubscribe();
    this.sub = this.client.subscribe(topic, (msg) => {
      console.log("[STOMP] 📩 RAW BODY =", msg.body);
      try {
        onMessage(JSON.parse(msg.body), msg);
      } catch {
        onMessage(msg.body, msg);
      }
    });
  }

  unsubscribe() {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  // ✅ 전송: /app/chat/rooms/{roomId}
  publish(roomId: string, payload: unknown) {
    const destination = `/app/chat/rooms/${roomId}`;

    console.log("[STOMP] 📤 publish destination =", destination);
    console.log("[STOMP] 📤 publish payload =", payload);

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }
}
