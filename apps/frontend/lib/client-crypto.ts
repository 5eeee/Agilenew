"use client";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function randomBase64(bytes = 16) {
  const value = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...value));
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), char => char.charCodeAt(0));
}

function toBase64(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

async function key(passphrase: string, salt: string, iterations = 600_000) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: fromBase64(salt), iterations, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function encryptText(value: string, passphrase: string, salt: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(passphrase, salt), encoder.encode(value));
  return { ciphertext: toBase64(ciphertext), iv: toBase64(iv.buffer) };
}

export async function decryptText(ciphertext: string, iv: string, passphrase: string, salt: string) {
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(iv) }, await key(passphrase, salt), fromBase64(ciphertext));
  return decoder.decode(plaintext);
}

export async function chatSalt(channelId: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`agile-chat:${channelId}`));
  return toBase64(digest.slice(0, 16));
}
