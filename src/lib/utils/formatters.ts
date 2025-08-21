import { Gender } from "@/lib/types/product";
import { WHATSAPP_PHONE } from "./constants";
import { messages } from "@/lib/i18n";

export const genderLabel = (gender?: Gender): string => {
  switch (gender) {
    case Gender.MALE:
      return messages.product.genders.male;
    case Gender.FEMALE:
      return messages.product.genders.female;
    case Gender.UNISEX:
    default:
      return messages.product.genders.unisex;
  }
};

export const formatPrice = (price: number): string => {
  return `$ ${price.toFixed(2)}`;
};

export const generateWhatsAppURL = (productName: string, productSlug: string): string => {
  const message = messages.whatsApp.messageTemplate(productName, productSlug);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};