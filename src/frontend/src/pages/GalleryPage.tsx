import { createActor } from "@/backend";
import type { Backend } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/providers/WalletProvider";
import type { NFTInfo } from "@/types/nft";
import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ImageOff, Layers } from "lucide-react";
import { useEffect, useState } from "react";

type ActorLike = Pick<Backend, "getTokenImage" | "getNFTsByOwner">;

function useNFTImage(
  tokenId: bigint,
  enabled: boolean,
  actor: ActorLike | null | undefined,
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled || !actor) {
      setLoading(false);
      return;
    }
    let revoked = false;
    let createdUrl: string | null = null;
    setLoading(true);
    actor
      .getTokenImage(tokenId)
      .then((blob) => {
        if (revoked) return;
        if (blob && blob.length > 0) {
          const bytes = new Uint8Array(blob);
          // Detect MIME type from magic bytes: JPEG = FF D8, PNG = 89 50 4E 47
          const mimeType =
            bytes[0] === 0xff && bytes[1] === 0xd8
              ? "image/jpeg"
              : bytes[0] === 0x89 &&
                  bytes[1] === 0x50 &&
                  bytes[2] === 0x4e &&
                  bytes[3] === 0x47
                ? "image/png"
                : "image/octet-stream";
          const objUrl = URL.createObjectURL(
            new Blob([bytes], { type: mimeType }),
          );
          createdUrl = objUrl;
          setImageUrl(objUrl);
        } else {
          setImageUrl(null);
        }
      })
      .catch(() => {
        if (!revoked) setImageUrl(null);
      })
      .finally(() => {
        if (!revoked) setLoading(false);
      });
    return () => {
      revoked = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [tokenId, actor, enabled]);

  return { imageUrl, loading };
}

function NFTCard({
  nft,
  actor,
}: {
  nft: NFTInfo;
  actor: ActorLike | null | undefined;
}) {
  const { imageUrl, loading } = useNFTImage(nft.id, true, actor);

  return (
    <Card className="overflow-hidden group transition-smooth hover:shadow-lg hover:-translate-y-0.5 bg-card border border-border">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {loading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="w-8 h-8 opacity-40" />
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border">
          #{nft.id.toString()}
        </div>
      </div>
      <div className="p-3">
        <p
          className="font-display font-semibold text-foreground truncate text-sm"
          title={nft.name}
        >
          {nft.name}
        </p>
        {nft.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {nft.description}
          </p>
        )}
      </div>
    </Card>
  );
}

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {SKELETON_KEYS.map((id) => (
        <Card
          key={id}
          className="overflow-hidden bg-card border border-border"
          data-ocid="gallery.loading_state"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-3 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      data-ocid="gallery.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Layers className="w-8 h-8 text-primary" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        No NFTs yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        You haven&apos;t minted any NFTs yet. Create your first one now!
      </p>
      <Button asChild data-ocid="gallery.mint_first_button">
        <Link to="/mint">Mint Your First NFT</Link>
      </Button>
    </div>
  );
}

function NotConnectedState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      data-ocid="gallery.not_connected_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Layers className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        Connect your wallet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Connect your wallet to view your minted NFTs.
      </p>
    </div>
  );
}

export function GalleryPage() {
  const { principal, connected, walletType, plugActor } = useWallet();
  const { actor: iiActor, isFetching: actorLoading } = useActor(createActor);

  // Use Plug actor when connected via Plug; fall back to II actor
  const actor: ActorLike | null | undefined =
    walletType === "plug" ? plugActor : iiActor;
  const isActorReady =
    walletType === "plug" ? !!plugActor : !!iiActor && !actorLoading;

  const {
    data: nfts,
    isLoading,
    isError,
    refetch,
  } = useQuery<NFTInfo[]>({
    queryKey: ["nfts-by-owner", principal],
    queryFn: async () => {
      if (!principal || !actor) return [];
      const p = Principal.fromText(principal);
      return actor.getNFTsByOwner(p);
    },
    enabled: connected && !!principal && isActorReady,
    staleTime: 30_000,
  });

  return (
    <Layout>
      <div className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                My NFTs
              </h1>
              {connected && nfts && nfts.length > 0 && (
                <p className="text-muted-foreground text-sm mt-0.5">
                  {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} minted
                </p>
              )}
            </div>
            {connected && (
              <Button asChild size="sm" data-ocid="gallery.mint_button">
                <Link to="/mint">+ Mint NFT</Link>
              </Button>
            )}
          </div>

          {/* Content area */}
          {!connected ? (
            <NotConnectedState />
          ) : isLoading || (walletType !== "plug" && actorLoading) ? (
            <SkeletonGrid />
          ) : isError ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="gallery.error_state"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-foreground font-medium">Failed to load NFTs</p>
              <p className="text-muted-foreground text-sm">
                Something went wrong while fetching your NFTs.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                data-ocid="gallery.retry_button"
              >
                Try Again
              </Button>
            </div>
          ) : !nfts || nfts.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="gallery.list"
            >
              {nfts.map((nft) => (
                <NFTCard key={nft.id.toString()} nft={nft} actor={actor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
