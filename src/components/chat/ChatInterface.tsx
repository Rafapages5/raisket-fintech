'use client';

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message, ChatResponse, ChatRequest, ChatError } from '@/types/chat';

interface ChatInterfaceProps {
  apiUrl?: string;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  apiUrl,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll a último mensaje
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendMessage = async (): Promise<void> => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Limpiar error previo
    setError(null);

    // Optimistic UI: agregar mensaje del usuario inmediatamente
    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Construir URL de API
      const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoint = `${baseUrl}/chat/message`;

      // Preparar request
      const requestBody: ChatRequest = {
        message: trimmedInput,
        chat_id: chatId || undefined,
        use_rag: true
      };

      // Hacer fetch a la API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `Error del servidor: ${response.status} ${response.statusText}`
        }));

        throw new Error(errorData.detail || 'Error al procesar tu mensaje');
      }

      const data: ChatResponse = await response.json();

      // Guardar chat_id para siguientes mensajes
      if (data.chat_id && !chatId) {
        setChatId(data.chat_id);
      }

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error en chat:', err);

      // Mostrar error al usuario
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión con el servidor';
      setError(errorMessage);

      // Agregar mensaje de error como asistente
      const errorAssistantMessage: Message = {
        role: 'assistant',
        content: `⚠️ Lo siento, ocurrió un error: ${errorMessage}\n\nPor favor, intenta de nuevo.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorAssistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    // Enter envía, Shift+Enter nueva línea
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const handleClearChat = (): void => {
    setMessages([]);
    setChatId(null);
    setError(null);
    setInput('');
  };

  return (
    <div className={`flex flex-col h-[600px] max-w-3xl mx-auto border border-gray-200 rounded-lg shadow-lg bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Raisket AI</h3>
            <p className="text-xs text-blue-100">Tu asesor financiero inteligente</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-xs text-white/80 hover:text-white px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Limpiar conversación"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-6xl mb-4">💰</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Hola! Soy Raisket AI
            </h4>
            <p className="text-gray-600 max-w-md mb-4">
              Tu asesor financiero inteligente. Puedo ayudarte con presupuestos,
              deudas, inversiones y más.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm text-sm">
              <button
                onClick={() => setInput('¿Cómo puedo hacer un presupuesto?')}
                className="text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                💡 ¿Cómo hacer un presupuesto?
              </button>
              <button
                onClick={() => setInput('¿Qué son los CETES?')}
                className="text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📈 ¿Qué son los CETES?
              </button>
              <button
                onClick={() => setInput('¿Cómo salir de deudas?')}
                className="text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                💳 ¿Cómo salir de deudas?
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${index}-${message.timestamp.getTime()}`}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-600">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-800">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta sobre finanzas..."
              disabled={loading}
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
              style={{ maxHeight: '120px', minHeight: '48px' }}
              aria-label="Mensaje de chat"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              Enter para enviar
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Enviar mensaje"
          >
            {loading ? (
              <span className="inline-block">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              <span>Enviar</span>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Presiona Shift+Enter para crear una nueva línea
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
