export function getScriptLengthError(length: number): string | null {
  if (!length) return 'Please enter a script first';
  if (length < 1000 || length > 1500) {
    return `Your script must be between 1000 and 1500 characters. Current length: ${length}.`;
  }
  return null;
}

