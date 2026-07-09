import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackSuggestion from './FeedbackSuggestion';

describe('FeedbackSuggestion', () => {
  it('opens the widget, accepts a suggestion, and shows a success tick after sending', () => {
    render(<FeedbackSuggestion />);

    fireEvent.click(screen.getByRole('button', { name: /open feedback/i }));

    fireEvent.change(screen.getByPlaceholderText(/share your suggestion/i), {
      target: { value: 'Add dark mode' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText(/thanks for your suggestion/i)).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
