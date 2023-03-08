const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class FileServerApiClient {
  base_url: string;
  constructor() {
    this.base_url = BASE_API_URL + "/api";
  }

  async request(options: {
    query: any;
    url: string;
    method: any;
    headers: HeadersInit | undefined;
    body?: any;
  }) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("_auth")}`,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error: any) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  // Get method
  async get(url: any, query?: any, options?: any) {
    return this.request({
      method: "GET",
      url,
      query,
      ...options,
    });
  }

  // Post method
  async post(url: any, body: any, options?: any) {
    return this.request({
      method: "POST",
      url,
      body,
      ...options,
    });
  }

  // Put method
  async put(url: any, body: any, options: any) {
    return this.request({
      method: "PUT",
      url,
      body,
      ...options,
    });
  }

  // Delete method
  async delete(url: any, options?: any) {
    return this.request({
      method: "DELETE",
      url,
      ...options,
    });
  }

  // login method
  async login(email: string, password: string) {
    const response = await this.post("/auth/login", { email, password });
    if (!response.ok) {
      return response.status === 401 ? response : "error";
    }
    console.log(response, "I have a response");
    return response;
  }

  // post form data
  async postFormData(url: string, formData: FormData) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("_auth")}`,
    };
    let response;
    try {
      response = await fetch(this.base_url + url, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch (error: any) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }
    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  // post form data
  async putFormData(url: string, formData: FormData) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("_auth")}`,
    };
    let response;
    try {
      response = await fetch(this.base_url + url, {
        method: "PUT",
        headers,
        body: formData,
      });
    } catch (error: any) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }
    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }
}
