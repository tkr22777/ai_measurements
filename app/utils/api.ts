/**
 * Centralized API utilities for frontend-backend communication
 * Separates API logic from UI components
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Generic API request wrapper with error handling
 */
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Image API utilities
 */
export const imageAPI = {
  async upload(
    formData: FormData
  ): Promise<ApiResponse<{ imageUrl: string; contentType: string }>> {
    return fetch('/api/images', {
      method: 'POST',
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error,
      };
    });
  },

  async get(
    userId: string,
    type?: string
  ): Promise<ApiResponse<{ imageUrl: string; uploadedAt: string }>> {
    const params = new URLSearchParams({ userId });
    if (type) params.append('type', type);

    return apiRequest(`/api/images?${params.toString()}`);
  },

  async delete(imageUrl: string, userId: string): Promise<ApiResponse> {
    return apiRequest('/api/images', {
      method: 'DELETE',
      body: JSON.stringify({
        url: imageUrl,
        pathname: new URL(imageUrl).pathname,
        userId,
      }),
    });
  },
};

/**
 * Measurement API utilities
 */
export const measurementAPI = {
  async process(userId: string, height?: number): Promise<ApiResponse> {
    return apiRequest('/api/process', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        height,
        timestamp: new Date().toISOString(),
      }),
    });
  },

  async get(userId: string): Promise<ApiResponse> {
    return apiRequest(`/api/process?userId=${encodeURIComponent(userId)}`);
  },
};
