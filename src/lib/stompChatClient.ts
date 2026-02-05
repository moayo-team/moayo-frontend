import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type Handlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (e: unknown) => void;
};

export class StompChatClient {
  private httpUrl: string;
  private handlers: Handlers;
  private client: Client;
  private sub?: StompSubscription;
  private accessToken?: string;

  // 연결 완료를 기다리는 Promise 관리
  private readyPromise: Promise<void> | null = null;
  private readyResolve: (() => void) | null = null;
  private readyReject: ((e: unknown) => void) | null = null;

  constructor(httpUrl: string, handlers: Handlers = {}) {
    this.httpUrl = httpUrl;
    this.handlers = handlers;

    this.client = new Client({
      webSocketFactory: () => new SockJS(this.httpUrl),
      reconnectDelay: 2000,
      debug: () => {},

      onConnect: () => {
        console.log("[STOMP] ✅ CONNECTED (SockJS)", this.httpUrl);

        // 연결 대기 중이면 resolve
        this.readyResolve?.();
        this.readyPromise = null;
        this.readyResolve = null;
        this.readyReject = null;

        this.handlers.onConnected?.();
      },
      onDisconnect: () => {
        console.log("[STOMP] ⛔ DISCONNECTED");
        this.handlers.onDisconnected?.();
        // disconnect되면 다시 대기 상태로
        this.resetReady();
      },
      onStompError: (frame) => {
        console.error("[STOMP] ❌ STOMP ERROR", frame);
        this.handlers.onError?.(frame);
        this.readyReject?.(frame);
      },
      onWebSocketError: (evt) => {
        console.error("[STOMP] ❌ WS ERROR", evt);
        this.handlers.onError?.(evt);
        this.readyReject?.(evt);
      },
      onWebSocketClose: () => {
        // close도 disconnect와 유사 처리
        this.resetReady();
      },
    });

    // 초기 ready 상태 세팅
    this.resetReady();
  }

  private resetReady() {
    // 이미 연결되어 있으면 굳이 만들지 않음
    if (this.client.connected) return;

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
  }

  setAccessToken(token?: string) {
    this.accessToken = token;
    // 토큰이 바뀌었는데 이미 연결 중/연결됨이면,
    // 보통은 재연결이 필요할 수 있음
  }

  connect() {
    this.client.connectHeaders = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};

    console.log("[STOMP] connect() SockJS url =", this.httpUrl);

    // 연결 대기 Promise 준비
    this.resetReady();

    this.client.activate();
  }

  async disconnect() {
    this.sub?.unsubscribe();
    this.sub = undefined;
    await this.client.deactivate();
    this.resetReady();
  }

  private async waitUntilConnected(timeoutMs = 8000) {
    if (this.client.connected) return;

    if (!this.readyPromise) this.resetReady();

    const p = this.readyPromise!;
    const timeout = new Promise<void>((_, reject) => {
      const t = setTimeout(() => {
        clearTimeout(t);
        reject(new Error("STOMP connect timeout"));
      }, timeoutMs);
    });

    await Promise.race([p, timeout]);
  }

  async subscribeRoom(roomId: string, onMessage: (body: any, raw: IMessage) => void) {
    // 연결될 때까지 대기
    await this.waitUntilConnected();

    const topic = `/topic/chat/rooms/${roomId}`;
    console.log("[STOMP] 🔔 subscribe topic =", topic);

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

  async publish(roomId: string, payload: unknown) {
    // 연결될 때까지 대기
    await this.waitUntilConnected();

    this.client.publish({
      destination: `/app/chat/rooms/${roomId}`,
      body: JSON.stringify(payload),
    });
  }
}
