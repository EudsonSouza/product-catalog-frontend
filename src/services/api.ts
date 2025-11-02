import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { API_CONFIG, DEFAULT_HEADERS } from '@/lib/utils/constants';
import { ApiException } from '@/lib/types/api';

const MIN_SERVER_ERROR_STATUS = 500;
const NETWORK_ERROR_CODE = 0;
const NETWORK_ERROR_STATUS_TEXT = 'Network Error';
const REQUEST_ERROR_STATUS_TEXT = 'Request Error';

interface ErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: DEFAULT_HEADERS,
      withCredentials: true,
    });

    this.setupRetry();
    this.setupInterceptors();
  }

  private shouldRetryRequest(error: AxiosError): boolean {
    const isNetworkError = axiosRetry.isNetworkOrIdempotentRequestError(error);
    const isServerError = error.response?.status
      ? error.response.status >= MIN_SERVER_ERROR_STATUS
      : false;

    return isNetworkError || isServerError;
  }

  private logRetryAttempt(
    retryCount: number,
    requestConfig: AxiosRequestConfig
  ): void {
    const method = requestConfig.method?.toUpperCase() || 'UNKNOWN';
    const url = requestConfig.url || 'unknown';
    console.log(`Retry attempt ${retryCount} for ${method} ${url}`);
  }

  private setupRetry(): void {
    axiosRetry(this.client, {
      retries: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => this.shouldRetryRequest(error),
      onRetry: (retryCount, _error, requestConfig) => {
        this.logRetryAttempt(retryCount, requestConfig);
      },
    });
  }

  private logRequest(config: InternalAxiosRequestConfig): void {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || 'unknown';
    console.log(`Making ${method} request to: ${url}`);
  }

  private extractErrorMessage(responseData: ErrorResponse, fallbackMessage: string): string {
    return responseData?.message || responseData?.error || fallbackMessage;
  }

  private handleServerError(error: AxiosError): never {
    if (!error.response) {
      throw new Error('Server error without response');
    }

    const responseData = error.response.data as ErrorResponse;
    const errorMessage = this.extractErrorMessage(
      responseData,
      error.message || 'Server error'
    );

    throw new ApiException(
      errorMessage,
      error.response.status,
      error.response.statusText
    );
  }

  private handleNetworkError(): never {
    throw new ApiException(
      'Network error - no response from server',
      NETWORK_ERROR_CODE,
      NETWORK_ERROR_STATUS_TEXT
    );
  }

  private handleRequestError(error: AxiosError): never {
    throw new ApiException(
      error.message || 'Request failed',
      NETWORK_ERROR_CODE,
      REQUEST_ERROR_STATUS_TEXT
    );
  }

  private handleRequestInterceptorError(error: unknown): Promise<never> {
    return Promise.reject(error);
  }

  private handleResponseError(error: AxiosError): never {
    if (error.response) {
      this.handleServerError(error);
    }

    if (error.request) {
      this.handleNetworkError();
    }

    this.handleRequestError(error);
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        this.logRequest(config);
        return config;
      },
      (error) => this.handleRequestInterceptorError(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => this.handleResponseError(error)
    );
  }

  private extractResponseData<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return this.extractResponseData(response);
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return this.extractResponseData(response);
  }

  async put<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return this.extractResponseData(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return this.extractResponseData(response);
  }

  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();