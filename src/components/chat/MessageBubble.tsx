import React from 'react';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  role: Message['role'];
  content: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp
}) => {
  const isUser = role === 'user';

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;

    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 mt-1 px-2 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-xs text-gray-500">
            {formatTimestamp(timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
