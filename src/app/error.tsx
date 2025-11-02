'use client';

import { messages } from '@/lib/i18n';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {messages.states.error.somethingWentWrong}
        </h2>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {messages.ui.buttons.tryAgain}
        </button>
      </div>
    </div>
  );
}