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

export const fetchMyChatRooms = async (): Promise<ChatRoomSummary[]> => {
	const res = await apiClient.get<ApiResponse<ChatRoomSummary[]>>(
		"/api/v1/chat/rooms"
	);
	return Array.isArray(res.data.result) ? res.data.result : [];
};

export const fetchRoomMessages = async (
	roomId: number
): Promise<ChatMessageResponse[]> => {
	const res = await apiClient.get<ApiResponse<ChatMessageResponse[]>>(
		`/api/v1/chat/rooms/${roomId}/messages`
	);
	return Array.isArray(res.data.result) ? res.data.result : [];
};

export const markRoomAsRead = async (roomId: number): Promise<void> => {
	await apiClient.post(`/api/v1/chat/rooms/${roomId}/read`);
};

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
