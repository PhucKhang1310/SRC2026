import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      remove: (widgetId: string) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback": () => void;
          "expired-callback": () => void;
          theme?: "auto" | "dark" | "light";
        },
      ) => string;
    };
  }
}

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  resetKey?: number;
};

const loadTurnstileScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(), { once: true });
    document.head.appendChild(script);
  });

const TurnstileWidget = ({ onTokenChange, resetKey = 0 }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [isScriptFailed, setIsScriptFailed] = useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string || '0x4AAAAAADgcZdql8gcd20q9';

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    let isMounted = true;
    onTokenChangeRef.current("");

    if (!siteKey || !containerRef.current) {
      return undefined;
    }

    loadTurnstileScript()
      .then(() => {
        if (!isMounted || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token) => onTokenChangeRef.current(token),
          "error-callback": () => onTokenChangeRef.current(""),
          "expired-callback": () => onTokenChangeRef.current(""),
        });
      })
      .catch(() => {
        if (isMounted) {
          setIsScriptFailed(true);
        }
      });

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [resetKey, siteKey]);

  if (!siteKey) {
    return (
      <p className="text-sm text-amber-200/80">
        Turnstile is not configured. Add VITE_TURNSTILE_SITE_KEY to enable
        submissions.
      </p>
    );
  }

  if (isScriptFailed) {
    return (
      <p className="text-sm text-red-400">
        Verification could not load. Please refresh and try again.
      </p>
    );
  }

  return <div ref={containerRef} />;
};

export default TurnstileWidget;
