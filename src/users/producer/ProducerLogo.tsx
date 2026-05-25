import {Building2} from "lucide-react";
import {useEffect, useMemo, useState} from "react";

type ProducerLogoProps = {
  logo?: number[] | null;
  name?: string;
  className?: string;
  iconClassName?: string;
};

const textDecoder = new TextDecoder();

const getLogoMimeType = (bytes: Uint8Array): string | null => {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 12) {
    const riff = String.fromCharCode(...bytes.slice(0, 4));
    const webp = String.fromCharCode(...bytes.slice(8, 12));
    if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  }
  if (bytes.length >= 4) {
    const start = textDecoder.decode(bytes.slice(0, Math.min(bytes.length, 256))).trimStart();
    if (start.startsWith("<svg") || start.startsWith("<?xml")) return "image/svg+xml";
  }
  return null;
};

const parseTextByteList = (bytes: Uint8Array): Uint8Array | null => {
  if (bytes.length === 0 || bytes[0] !== 0x5b) return null;

  try {
    const parsed = JSON.parse(textDecoder.decode(bytes));
    if (!Array.isArray(parsed) || !parsed.every(Number.isInteger)) return null;
    return new Uint8Array(parsed);
  } catch {
    return null;
  }
};

export function ProducerLogo({
  logo,
  name = "Producer",
  className = "h-12 w-12",
  iconClassName = "h-7 w-7",
}: ProducerLogoProps) {
  const [src, setSrc] = useState<string | null>(null);
  const hasLogo = useMemo(() => Array.isArray(logo) && logo.length > 0, [logo]);

  useEffect(() => {
    if (!hasLogo || !logo) {
      setSrc(null);
      return;
    }

    let bytes = new Uint8Array(logo);
    let mimeType = getLogoMimeType(bytes);
    if (!mimeType) {
      const parsedBytes = parseTextByteList(bytes);
      const parsedMimeType = parsedBytes ? getLogoMimeType(parsedBytes) : null;
      if (parsedBytes && parsedMimeType) {
        bytes = parsedBytes;
        mimeType = parsedMimeType;
      }
    }

    if (!mimeType) {
      if (import.meta.env.DEV) {
        console.warn(`Producer logo bytes are not a supported image format: length=${logo.length}; first16=${JSON.stringify(logo.slice(0, 16))}`);
      }
      setSrc(null);
      return;
    }

    const blob = new Blob([bytes], {type: mimeType});
    const objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [hasLogo, logo]);

  return (
    <div className={`${className} flex-shrink-0 overflow-hidden rounded-lg bg-[color:var(--color-muted)] flex-center border border-token`}>
      {src ? (
        <img src={src} alt={`${name} logo`} className="h-full w-full object-contain p-1" onError={() => setSrc(null)} />
      ) : (
        <Building2 className={`${iconClassName} text-[color:var(--color-fg)]`} aria-hidden="true" />
      )}
    </div>
  );
}

export default ProducerLogo;
