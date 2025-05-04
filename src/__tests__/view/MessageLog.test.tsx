import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import MessageLog from '../../view/MessageLog';

describe('MessageLog', () => {
  test('renders empty message log', () => {
    render(<MessageLog messages={[]} />);

    // Should render the container but have no messages
    const messageLogElement = screen.getByTestId('message-log') || screen.getByRole('generic');
    expect(messageLogElement).toHaveClass('message-log');
    expect(messageLogElement.children.length).toBe(0);
  });

  test('renders single message', () => {
    const messages = ['Test message'];
    render(<MessageLog messages={messages} />);

    // Should render one message
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders multiple messages', () => {
    const messages = ['First message', 'Second message', 'Third message'];
    render(<MessageLog messages={messages} />);

    // Should render all messages
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });

  test('limits display to last 6 messages', () => {
    const messages = [
      'Message 1',
      'Message 2',
      'Message 3',
      'Message 4',
      'Message 5',
      'Message 6',
      'Message 7',
      'Message 8',
    ];
    render(<MessageLog messages={messages} />);

    // Should only show the last 6 messages
    expect(screen.queryByText('Message 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Message 2')).not.toBeInTheDocument();
    expect(screen.getByText('Message 3')).toBeInTheDocument();
    expect(screen.getByText('Message 4')).toBeInTheDocument();
    expect(screen.getByText('Message 5')).toBeInTheDocument();
    expect(screen.getByText('Message 6')).toBeInTheDocument();
    expect(screen.getByText('Message 7')).toBeInTheDocument();
    expect(screen.getByText('Message 8')).toBeInTheDocument();
  });

  test('handles long messages', () => {
    const longMessage =
      'This is a very long message that should still be displayed correctly in the message log component without any issues or truncation.';
    render(<MessageLog messages={[longMessage]} />);

    // Should render the long message
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
