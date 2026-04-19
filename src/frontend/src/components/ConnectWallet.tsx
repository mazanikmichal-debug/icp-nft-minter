import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/providers/WalletProvider";
import { Loader2, Shield, Wallet } from "lucide-react";

export function ConnectWallet() {
  const { connectPlug, connectII, isConnecting, error } = useWallet();

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-4">
        {/* Hero area */}
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
            <Wallet className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Connect your wallet
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect to mint and manage your NFTs on the Internet Computer.
          </p>
        </div>

        {/* Primary CTA — Plug wallet */}
        <Card className="card-shadow border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <span className="text-lg">🔌</span>
              Plug Wallet
            </CardTitle>
            <CardDescription className="text-xs">
              Recommended — browser extension wallet for ICP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              data-ocid="connect.plug_button"
              className="w-full font-display transition-smooth"
              size="lg"
              onClick={connectPlug}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="mr-2">🔌</span>
              )}
              Connect with Plug
            </Button>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Secondary CTA — Internet Identity */}
        <Button
          data-ocid="connect.ii_button"
          variant="outline"
          className="w-full font-display transition-smooth"
          size="lg"
          onClick={connectII}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Shield className="w-4 h-4 mr-2" />
          )}
          Use Internet Identity
        </Button>

        {/* Error state */}
        {error && (
          <div
            data-ocid="connect.error_state"
            className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pt-1">
          Don't have Plug?{" "}
          <a
            href="https://plugwallet.ooo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline transition-smooth"
          >
            Get it here
          </a>
        </p>
      </div>
    </div>
  );
}
