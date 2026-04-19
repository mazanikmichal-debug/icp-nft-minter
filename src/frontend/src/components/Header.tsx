import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

function truncatePrincipal(p: string): string {
  if (p.length <= 12) return p;
  return `${p.slice(0, 5)}...${p.slice(-4)}`;
}

const NAV_ITEMS = [
  { label: "Mint NFT", to: "/mint" as const },
  { label: "My NFTs", to: "/gallery" as const },
];

export function Header() {
  const { connected, principal, disconnect } = useWallet();
  const {
    location: { pathname },
  } = useRouterState();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border card-shadow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/mint"
          data-ocid="header.logo_link"
          className="flex items-center gap-2 shrink-0 transition-smooth hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              N
            </span>
          </div>
          <span className="hidden sm:block font-display font-semibold text-foreground text-base">
            NFT Mint
          </span>
        </Link>

        {/* Nav tabs — only shown when connected */}
        {connected && (
          <nav
            className="flex items-center gap-1 flex-1 justify-center sm:justify-start sm:ml-6"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={`header.nav_${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm font-display font-medium transition-smooth",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Wallet area */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {connected && principal ? (
            <div className="flex items-center gap-2">
              <div
                data-ocid="header.wallet_address"
                className="hidden sm:flex items-center gap-2 bg-muted rounded-full px-3 py-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="font-mono text-xs text-foreground">
                  {truncatePrincipal(principal)}
                </span>
              </div>
              <Button
                data-ocid="header.disconnect_button"
                variant="ghost"
                size="icon"
                onClick={disconnect}
                aria-label="Disconnect wallet"
                className="w-8 h-8 text-muted-foreground hover:text-destructive transition-smooth"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
