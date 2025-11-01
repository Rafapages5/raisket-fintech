/**
 * Tipos para el sistema de chat con IA de Raisket
 */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  chat_id: string;
  sources?: Array<{
    id: string;
    score: number;
    text: string;
    metadata?: Record<string, unknown>;
  }>;
  context_used: boolean;
}

export interface ChatRequest {
  message: string;
  chat_id?: string;
  use_rag?: boolean;
  chat_history?: Array<{
    role: string;
    content: string;
  }>;
}

export interface ChatError {
  message: string;
  code?: string;
  details?: string;
}
