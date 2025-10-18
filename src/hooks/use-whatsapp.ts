import { useCallback } from "react";
import { Product } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface WhatsAppConfig {
  phoneNumber: string;
}

/**
 * Custom hook for WhatsApp integration
 * Generates WhatsApp URLs with pre-filled messages for products
 * Uses internationalization for messages
 *
 * @param config - WhatsApp configuration (phone number)
 * @returns Function to generate WhatsApp URL for a product
 */
export function useWhatsApp(config: WhatsAppConfig) {
  const { phoneNumber } = config;
  const { messages } = useTranslation();

  const generateWhatsAppUrl = useCallback(
    (product: Product): string => {
      const price = `$ ${product.basePrice.toFixed(2)}`;
      const message = messages.whatsApp.messageTemplate(
        product.name,
        price,
        product.description
      );

      const encodedMessage = encodeURIComponent(message);
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },
    [phoneNumber, messages]
  );

  const openWhatsApp = useCallback(
    (product: Product) => {
      const url = generateWhatsAppUrl(product);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [generateWhatsAppUrl]
  );

  return {
    generateWhatsAppUrl,
    openWhatsApp,
  };
}
