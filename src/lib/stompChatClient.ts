import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type Handlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (e: unknown) => void;
};

export class StompChatClient {
  private httpUrl: string;               // ✅ wsUrl이 아니라 httpUrl
  private handlers: Handlers;
  private client: Client;
  private sub?: StompSubscription;
  private accessToken?: string;

  constructor(httpUrl: string, handlers: Handlers = {}) {
    this.httpUrl = httpUrl;
    this.handlers = handlers;

    this.client = new Client({

      webSocketFactory: () => new SockJS(this.httpUrl),

      reconnectDelay: 2000,
      debug: () => {},

      onConnect: () => {
        console.log("[STOMP] ✅ CONNECTED (SockJS)", this.httpUrl);
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
    // ✅ 이 Authorization은 "HTTP 헤더"가 아니라 STOMP CONNECT 프레임 헤더로 전송됨
    this.client.connectHeaders = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};

    console.log("[STOMP] connect() SockJS url =", this.httpUrl);
    this.client.activate();
  }

  async disconnect() {
    this.sub?.unsubscribe();
    this.sub = undefined;
    await this.client.deactivate();
  }

  subscribeRoom(roomId: string, onMessage: (body: any, raw: IMessage) => void) {
    const topic = `/topic/chat/rooms/${roomId}`;

    this.sub?.unsubscribe();
    this.sub = this.client.subscribe(topic, (msg) => {
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

  publish(roomId: string, payload: unknown) {
    this.client.publish({
      destination: `/app/chat/rooms/${roomId}`,
      body: JSON.stringify(payload),
    });
  }
}
