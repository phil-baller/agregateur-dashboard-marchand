// Environment variable configuration
export const config = {
  // Support Links
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/fastpay_support",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/1234567890",
  
  // Documentation
  docsUrl: process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.fastpay.com",
  docsTransfersUrl: process.env.NEXT_PUBLIC_DOCS_TRANSFERS_URL || "https://docs.fastpay.com/transfers",
  
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://agregateur-rest.onrender.com",
};
