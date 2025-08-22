import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { API_CONFIG, DEFAULT_HEADERS } from '@/constants/api';
import { ApiException } from '@/lib/types/api';

// Interface for expected error response structure
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
    });

    this.setupRetry();
    this.setupInterceptors();
  }

  private setupRetry() {
    // Configure axios-retry
    axiosRetry(this.client, {
      retries: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry on network errors and 5xx server errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status ? error.response.status >= 500 : false);
      },
      onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt ${retryCount} for ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
      },
    });
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any request modifications here
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Handle successful responses
        return response;
      },
      (error: AxiosError) => {
        // Transform axios errors to our ApiException
        if (error.response) {
          // Server responded with error status
          const responseData = error.response.data as ErrorResponse;
          const errorMessage = responseData?.message || responseData?.error || error.message || 'Server error';
          
          throw new ApiException(
            errorMessage,
            error.response.status,
            error.response.statusText
          );
        } else if (error.request) {
          // Request made but no response received
          throw new ApiException(
            'Network error - no response from server',
            0,
            'Network Error'
          );
        } else {
          // Something else happened
          throw new ApiException(
            error.message || 'Request failed',
            0,
            'Request Error'
          );
        }
      }
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  // Method to get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();