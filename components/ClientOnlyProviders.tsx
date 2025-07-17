"use client";

import { useState, useEffect } from "react";
import { Providers } from "@/app/providers"; // Adjust the import path if needed

/**
 * This component acts as a wrapper that ensures its children (including any
 * style-injecting providers) are only ever rendered on the client side.
 * This is a reliable way to prevent server-client hydration mismatches
 * caused by CSS-in-JS libraries like Material-UI or Emotion.
 */
export default function ClientOnlyProviders({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // While the component has not yet mounted on the client, we render nothing.
  // This guarantees that the server output is an empty shell.
  if (!hasMounted) {
    return null;
  }

  // Once mounted on the client, we render the actual providers and children.
  return <Providers>{children}</Providers>;
}
