// MessageLog.tsx
// View: Game message log
import React from 'react';

interface MessageLogProps {
  messages: string[];
}

const MessageLog: React.FC<MessageLogProps> = ({ messages }) => (
  <div className="message-log" data-testid="message-log">
    {messages.slice(-6).map((msg, idx) => (
      <div key={idx}>{msg}</div>
    ))}
  </div>
);

export default MessageLog;
