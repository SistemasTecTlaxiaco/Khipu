/**
 * 🔐 Crypto Utils for Khipu - Wallet Encryption
 * 
 * Simple encryption utilities for storing Soroban wallet keys
 * Uses Web Crypto API (browser native)
 */

// Simple XOR encryption for demo purposes (replace with proper crypto in production)
export function simpleEncrypt(email, text) {
  const key = btoa(email).slice(0, 16); // Use email as key base
  let encrypted = '';
  
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  
  return btoa(encrypted);
}

export function simpleDecrypt(email, encryptedText) {
  const key = btoa(email).slice(0, 16);
  const encrypted = atob(encryptedText);
  let decrypted = '';
  
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(
      encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  
  return decrypted;
}

// More secure encryption using Web Crypto API
export async function encrypt(password, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Create key from password
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );
  
  // Combine salt + iv + encrypted data
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return btoa(String.fromCharCode(...result));
}

export async function decrypt(password, encryptedData) {
  const data = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  );
  
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
