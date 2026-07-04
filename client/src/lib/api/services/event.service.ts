import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  Event,
  CreateEventData,
  UpdateEventData,
  EventFilters,
} from '@/types';

export const eventService = {
  async getEvents(filters?: EventFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'Semua') {
          params.append(key, String(value));
        }
      });
    }
    const { data } = await apiClient.get<PaginatedResponse<Event>>(
      `/events?${params.toString()}`
    );
    return data;
  },

  async getEventById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
    return data;
  },

  async createEvent(eventData: CreateEventData) {
    const { data } = await apiClient.post<ApiResponse<Event>>('/events', eventData);
    return data;
  },

  async updateEvent(id: string, eventData: UpdateEventData) {
    const { data } = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    return data;
  },

  async deleteEvent(id: string) {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/events/${id}`);
    return data;
  },

  async joinEvent(id: string) {
    const { data } = await apiClient.post<ApiResponse<Event>>(`/events/${id}/join`);
    return data;
  },

  async leaveEvent(id: string) {
    const { data } = await apiClient.post<ApiResponse<Event>>(`/events/${id}/leave`);
    return data;
  },

  async getMyEvents() {
    const { data } = await apiClient.get<ApiResponse<Event[]>>('/events/myevents');
    return data;
  },
};
