import CryptoJS from 'crypto-js';

export function encryptPrompt(prompt: string, secretKey: string): string {
  return CryptoJS.AES.encrypt(prompt, secretKey).toString();
}

export function decryptPrompt(ciphertext: string, secretKey: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
