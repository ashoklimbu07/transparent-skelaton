import { getScriptLengthError } from './validateScriptLength';

export function onScriptChangeImpl(args: {
  value: string;
  setScriptState: (value: string) => void;
  setError: (value: string | null) => void;
}) {
  const { value, setScriptState, setError } = args;
  setScriptState(value);

  const trimmed = value.trim();
  const length = trimmed.length;

  if (!length) {
    setError(null);
    return;
  }

  setError(getScriptLengthError(length));
}

