import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique client ID based on random words string confirmation.
 * The client must provide a random word string to be confirmed by other clients.
 */
export function generateClientId(): string {
  const words = ['quick', 'brown', 'fox', 'lazy', 'dog', 'cat', 'happy', 'jump', 'run', 'fast'];
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  const wordString = shuffledWords.join(' ');
  
  return `${uuidv4()}|${wordString}`;
}

/**
 * Generates a unique session ID for WebSocket connections.
 */
export function generateSessionId(): string {
  return uuidv4();
}
