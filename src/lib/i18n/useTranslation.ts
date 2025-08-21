import { messages, getMessage, MessageKey } from './messages';

// Simple translation hook for future i18n support
export const useTranslation = () => {
  // For now, just return the English messages
  // In the future, this could check a language context/state
  const t = (key: MessageKey): string => {
    return getMessage(key);
  };

  // Helper for direct access to the messages object
  const getMessages = () => messages;

  // Helper for formatting the WhatsApp message
  const formatWhatsAppMessage = (productName: string, productSlug: string): string => {
    return messages.whatsApp.messageTemplate(productName, productSlug);
  };

  return {
    t,
    messages: getMessages(),
    formatWhatsAppMessage,
  };
};

// Export default messages for direct access when hook isn't needed
export { messages, getMessage } from './messages';