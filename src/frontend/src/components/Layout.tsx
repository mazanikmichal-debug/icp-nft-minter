import { ConnectWallet } from "@/components/ConnectWallet";
import { Header } from "@/components/Header";
import { useWallet } from "@/providers/WalletProvider";

interface LayoutProps {
  children: React.ReactNode;
  /** If true, page is accessible without a wallet connection */
  public?: boolean;
}

export function Layout({ children, public: isPublic = false }: LayoutProps) {
  const { connected } = useWallet();
  const showContent = isPublic || connected;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        {showContent ? children : <ConnectWallet />}
      </main>
      <footer className="bg-card border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-smooth"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
