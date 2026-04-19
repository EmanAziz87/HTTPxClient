import * as http from "http";

interface RequestConfig {
  url: string;
  headers?: Record<string, string>;
}

interface PostConfig extends RequestConfig {
  body: unknown;
}

interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

function get<T>(config: RequestConfig): Promise<HttpResponse<T>> {
  return new Promise((resolve, reject) => {
    const url = new URL(config.url);

    const req = http.request(
      // establishing connection with the server
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "GET",
        headers: config.headers ?? {},
      },
      // receiving data from the server and resolving it to our Promise return type (HttpResponse<T>)
      (res: http.IncomingMessage) => {
        let raw = "";

        res.on("data", (chunk: Buffer) => {
          raw += chunk;
        });

        res.on("end", () => {
          resolve({
            data: JSON.parse(raw) as T,
            status: res.statusCode ?? 0,
            headers: res.headers as Record<string, string>,
          });
        });
      },
    );

    req.on("error", reject);
    req.end();
  });
}

function post<T>(config: PostConfig): Promise<HttpResponse<T>> {
  return new Promise((resolve, reject) => {});
}
