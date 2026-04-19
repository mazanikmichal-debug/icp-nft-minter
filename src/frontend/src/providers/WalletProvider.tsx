import { Backend } from "@/backend";
import { idlFactory } from "@/declarations/backend.did";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Noop file helpers required by Backend constructor (Plug doesn't use object storage)
const noopUpload = async (_file: unknown): Promise<Uint8Array> =>
  new Uint8Array();
const noopDownload = async (_file: unknown) => ({
  _blob: new Uint8Array(),
  directURL: "",
  getBytes: async () => new Uint8Array(),
  getDirectURL: () => "",
  withUploadProgress: function () {
    return this;
  },
});

interface WalletContextType {
  connected: boolean;
  principal: string | null;
  walletType: "plug" | "ii" | null;
  isConnecting: boolean;
  plugActor: Backend | null;
  connectPlug: () => Promise<void>;
  connectII: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect(opts?: {
          whitelist?: string[];
        }): Promise<boolean | { kind: string }>;
        isConnected(): Promise<boolean>;
        disconnect(): Promise<void>;
        agent?: unknown;
        principalId?: string;
        sessionManager?: {
          sessionData?: {
            principalId?: string;
          };
        };
        getPrincipal(): Promise<{ toText(): string }>;
        createActor<T>(opts: {
          canisterId: string;
          interfaceFactory: unknown;
        }): Promise<T>;
      };
    };
  }
}

/** Build a typed Backend instance backed by the Plug agent. */
async function buildPlugActor(): Promise<Backend | null> {
  if (!window.ic?.plug?.createActor) {
    console.warn("[Plug] createActor is not available on window.ic.plug");
    return null;
  }
  try {
    console.log(
      "[Plug] Creating actor via window.ic.plug.createActor for canister:",
      "zqdrq-zqaaa-aaaam-afzhq-cai",
    );
    const rawActor = await window.ic.plug.createActor<
      Record<string, (...args: unknown[]) => Promise<unknown>>
    >({
      canisterId: "zqdrq-zqaaa-aaaam-afzhq-cai",
      interfaceFactory: idlFactory,
    });
    console.log(
      "[Plug] actor created for canister:",
      "zqdrq-zqaaa-aaaam-afzhq-cai",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backend = new Backend(
      rawActor as any,
      noopUpload as any,
      noopDownload as any,
    );
    console.log("[Plug] Actor created successfully, backend:", backend);
    return backend;
  } catch (err) {
    console.error("[Plug] Failed to create actor:", err);
    return null;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<"plug" | "ii" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plugActor, setPlugActor] = useState<Backend | null>(null);

  const {
    login: iiLogin,
    clear: iiClear,
    identity,
    isAuthenticated,
  } = useInternetIdentity();

  // Restore II session from hook state (covers both interactive login & restored sessions)
  useEffect(() => {
    if (isAuthenticated && identity) {
      const p = identity.getPrincipal().toText();
      setPrincipal(p);
      setConnected(true);
      setWalletType("ii");
    }
  }, [isAuthenticated, identity]);

  // Check for existing Plug session on mount and restore actor
  useEffect(() => {
    const checkPlug = async () => {
      if (window.ic?.plug) {
        try {
          const isConnected = await window.ic.plug.isConnected();
          if (isConnected) {
            const p = await window.ic.plug.getPrincipal();
            const principalText = p.toText();
            console.log(
              "[Plug] Restoring existing session for principal:",
              principalText,
            );
            // Rebuild actor for restored session
            const actor = await buildPlugActor();
            if (actor) {
              setPlugActor(actor);
              console.log("[Plug] Actor restored for existing session.");
            } else {
              console.warn(
                "[Plug] Could not restore actor for existing session.",
              );
            }
            setPrincipal(principalText);
            setConnected(true);
            setWalletType("plug");
          }
        } catch {
          // Plug not available or error — ignore
        }
      }
    };
    checkPlug();
  }, []);

  const connectPlug = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      if (!window.ic?.plug) {
        throw new Error(
          "Plug wallet not detected. Please install the Plug browser extension.",
        );
      }

      // EXACT whitelist pattern required — literal array, no host field
      const WHITELIST = ["zqdrq-zqaaa-aaaam-afzhq-cai"];
      console.log("[Plug] whitelist:", WHITELIST);
      console.log("[Plug] Connecting with whitelist:", WHITELIST);

      const result = await window.ic.plug.requestConnect({
        whitelist: WHITELIST,
      });

      console.log(
        "[Plug] requestConnect result:",
        result,
        "type:",
        typeof result,
      );

      // Accept BOTH success forms: boolean true OR object {kind: string}
      const connected =
        result === true || (typeof result === "object" && result !== null);
      if (!connected) {
        throw new Error("User rejected Plug connection");
      }
      console.log("[Plug] requestConnect approved by user.");

      const p = await window.ic.plug.getPrincipal();
      const principalText = p.toText();
      console.log("[Plug] Connected principal:", principalText);

      // Create backend actor using Plug's authenticated agent
      const actor = await buildPlugActor();
      if (!actor) {
        throw new Error(
          "Plug wallet connected but failed to create backend actor. Please refresh and try again.",
        );
      }

      setPlugActor(actor);
      setPrincipal(principalText);
      setConnected(true);
      setWalletType("plug");
      console.log("[Plug] Wallet connection complete.");
    } catch (err) {
      console.error("[Plug] Connection error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect Plug wallet.",
      );
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectII = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      await iiLogin();
      // identity updates via hook effect above
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect Internet Identity.",
      );
    } finally {
      setIsConnecting(false);
    }
  }, [iiLogin]);

  const disconnect = useCallback(() => {
    if (walletType === "plug" && window.ic?.plug) {
      window.ic.plug.disconnect().catch(() => {});
    }
    if (walletType === "ii") {
      iiClear();
    }
    setConnected(false);
    setPrincipal(null);
    setWalletType(null);
    setPlugActor(null);
    setError(null);
  }, [walletType, iiClear]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        principal,
        walletType,
        isConnecting,
        plugActor,
        connectPlug,
        connectII,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
