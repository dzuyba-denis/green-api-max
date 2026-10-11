import {
  GreenApiCredentials,
  SendMessageRequest,
  SendMessageResponse,
  ReceiveNotificationResponse,
  DeleteNotificationResponse,
  StateInstanceResponse,
} from './types';
import { DEFAULT_API_URL, RECEIVE_TIMEOUT_SECONDS } from '@/shared/config/constants';

export class GreenApiClient {
  private static getEndpoint(path: string, credentials: GreenApiCredentials): { url: string; headers: HeadersInit } {
    const apiUrl = credentials.apiUrl?.trim() || DEFAULT_API_URL;
    const proxyUrl = `/api/green-api/${path.replace(/^\/+/, '')}`;
    return {
      url: proxyUrl,
      headers: { 'x-api-url': apiUrl },
    };
  }

  /**
   * Send a text message to MAX chat
   * https://green-api.com/v3/docs/api/sending/SendMessage/
   */
  public static async sendMessage(
    credentials: GreenApiCredentials,
    request: SendMessageRequest
  ): Promise<SendMessageResponse> {
    const { idInstance, apiTokenInstance } = credentials;
    const path = `waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const { url, headers } = this.getEndpoint(path, credentials);

    console.log("sendMessage URL!!!: ", url, request);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Failed to send message (HTTP ${response.status})`);
    }

    return response.json();

  }

  /**
   * Receive a notification from the queue
   * https://green-api.com/v3/docs/api/receiving/technology-http-api/ReceiveNotification/
   */
  public static async receiveNotification(
    credentials: GreenApiCredentials,
    timeout: number = RECEIVE_TIMEOUT_SECONDS
  ): Promise<ReceiveNotificationResponse | null> {
    const { idInstance, apiTokenInstance } = credentials;
    const path = `waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${timeout}`;
    const { url, headers } = this.getEndpoint(path, credentials);

    console.log("receiveNotification URL!!!: ", url);
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    console.log("receiveNotification Response!!!: ", response);
    if (!response.ok) {
      if (response.status === 400) {
        const err = await response.json().catch(() => ({}));
        // If custom webhook URL is configured in cabinet, notify user
        throw new Error(err.message || err.error || 'ReceiveNotification bad request');
      }
      return null;
    }

    const data = await response.json().catch(() => null);
    if (!data || !data.receiptId) {
      return null;
    }

    return data as ReceiveNotificationResponse;
  }

  /**
   * Acknowledge and delete notification from the queue
   * https://green-api.com/v3/docs/api/receiving/technology-http-api/DeleteNotification/
   */
  public static async deleteNotification(
    credentials: GreenApiCredentials,
    receiptId: number
  ): Promise<DeleteNotificationResponse> {
    const { idInstance, apiTokenInstance } = credentials;
    const path = `waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    const { url, headers } = this.getEndpoint(path, credentials);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      return { result: false, reason: `HTTP error ${response.status}` };
    }

    return response.json();
  }

  /**
   * Check connection and credentials validity
   */
  public static async getStateInstance(
    credentials: GreenApiCredentials
  ): Promise<StateInstanceResponse> {
    const { idInstance, apiTokenInstance } = credentials;
    const path = `waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    const { url, headers } = this.getEndpoint(path, credentials);

    console.log("getStateInstance URL!!!: ", url, headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log("getStateInstance Response!!!: ", response);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Invalid credentials or server error (HTTP ${response.status})`);
    }

    return response.json();
  }
}
