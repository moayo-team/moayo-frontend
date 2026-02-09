import { apiClient } from "../lib/apiClient";
import type {
	ChatMessageResponse,
	ChatRoomSummary
} from "../types/message";

// 공통 응답 래퍼 타입
type ApiResponse<T> = {
	isSuccess: boolean;
	code: string;
	message: string;
	timestamp?: string;
	result: T;
};

// 1) 내 채팅방 목록 조회
export const fetchMyChatRooms = async (): Promise<ChatRoomSummary[]> => {
	const res = await apiClient.get<ApiResponse<ChatRoomSummary[]>>(
		"/api/v1/chat/rooms"
	);
	// 방어 코드도 같이
	return Array.isArray(res.data.result) ? res.data.result : [];
};

// 2) 특정 채팅방 메시지 조회
export const fetchRoomMessages = async (
	roomId: number
): Promise<ChatMessageResponse[]> => {
	const res = await apiClient.get<ApiResponse<ChatMessageResponse[]>>(
		`/api/v1/chat/rooms/${roomId}/messages`
	);
	return Array.isArray(res.data.result) ? res.data.result : [];
};

// 3) 읽음 처리
export const markRoomAsRead = async (roomId: number): Promise<void> => {
	await apiClient.post(`/api/v1/chat/rooms/${roomId}/read`);
};

// 4) 채팅방 생성(또는 조회)
export type CreateChatRoomRequest = {
	targetUserId: number;
	postId?: number;
};

export type CreateChatRoomResponse = {
	roomId: number;
};

export const createChatRoom = async (
	body: CreateChatRoomRequest
): Promise<CreateChatRoomResponse> => {
	const res = await apiClient.post<ApiResponse<CreateChatRoomResponse>>(
		"/api/v1/chat/rooms",
		body
	);
	return res.data.result;
};
