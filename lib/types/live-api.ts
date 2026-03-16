
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: string;
}

export interface CryptoResult {
  symbol: string;
  price: string;
  change24h: string;
}

export interface MapLocationResult {
  location: string;
  lat: string;
  lng: string;
  address: string;
  context: string;
}

export interface SearchWebResult {
  results: Array<{
    title: string;
    snippet: string;
    url: string;
  }>;
  context: string;
}

export interface MemoryResult {
  status: "success" | "error";
  message?: string;
  memories?: Array<{
    id: string;
    content: string;
    importance: number;
    timestamp: any;
    category: string;
  }>;
}

export interface ProjectResult {
  status: "success" | "error";
  projects?: any[];
  message?: string;
}

export interface WorkspaceResult {
  status: "simulation";
  message: string;
  action: string;
  data: string;
}

export interface GenericToolResponse {
  [key: string]: unknown;
}

export type ToolResult =
  | WeatherResult
  | CryptoResult
  | MapLocationResult
  | SearchWebResult
  | MemoryResult
  | ProjectResult
  | WorkspaceResult
  | GenericToolResponse;

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: "OBJECT";
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface Tool {
  googleSearch?: Record<string, never>;
  functionDeclarations?: FunctionDeclaration[];
}
