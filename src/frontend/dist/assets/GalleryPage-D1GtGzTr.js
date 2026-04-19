import { d as useWallet, j as jsxRuntimeExports, L as Link, f as Skeleton, r as reactExports, e as createActor, P as Principal } from "./index-DMW22NCG.js";
import { c as createLucideIcon, u as useActor, i as useQuery, L as Layout, B as Button, C as CircleAlert, b as Card } from "./Layout-IDsHCkmV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = createLucideIcon("image-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
function useNFTImage(tokenId, enabled, actor) {
  const [imageUrl, setImageUrl] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!actor) {
      setLoading(false);
      return;
    }
    let revoked = false;
    let createdUrl = null;
    setLoading(true);
    actor.getTokenImage(tokenId).then((blob) => {
      if (revoked) return;
      if (blob && blob.length > 0) {
        const bytes = new Uint8Array(blob);
        const mimeType = bytes[0] === 255 && bytes[1] === 216 ? "image/jpeg" : bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 ? "image/png" : "image/octet-stream";
        const objUrl = URL.createObjectURL(
          new Blob([bytes], { type: mimeType })
        );
        createdUrl = objUrl;
        setImageUrl(objUrl);
      } else {
        setImageUrl(null);
      }
    }).catch(() => {
      if (!revoked) setImageUrl(null);
    }).finally(() => {
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
  actor
}) {
  const { imageUrl, loading } = useNFTImage(nft.id, true, actor);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden group transition-smooth hover:shadow-lg hover:-translate-y-0.5 bg-card border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square bg-muted relative overflow-hidden", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "absolute inset-0 rounded-none" }) : imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imageUrl,
          alt: nft.name,
          className: "w-full h-full object-cover transition-smooth group-hover:scale-105"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "No image" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border", children: [
        "#",
        nft.id.toString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "font-display font-semibold text-foreground truncate text-sm",
          title: nft.name,
          children: nft.name
        }
      ),
      nft.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-0.5", children: nft.description })
    ] })
  ] });
}
const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
function SkeletonGrid() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: SKELETON_KEYS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "overflow-hidden bg-card border border-border",
      "data-ocid": "gallery.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
        ] })
      ]
    },
    id
  )) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-24 px-6 text-center",
      "data-ocid": "gallery.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-8 h-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "No NFTs yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "You haven't minted any NFTs yet. Create your first one now!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "gallery.mint_first_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/mint", children: "Mint Your First NFT" }) })
      ]
    }
  );
}
function NotConnectedState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-24 px-6 text-center",
      "data-ocid": "gallery.not_connected_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Connect your wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Connect your wallet to view your minted NFTs." })
      ]
    }
  );
}
function GalleryPage() {
  const { principal, connected, walletType, plugActor } = useWallet();
  const { actor: iiActor, isFetching: actorLoading } = useActor(createActor);
  const actor = walletType === "plug" ? plugActor : iiActor;
  const isActorReady = walletType === "plug" ? !!plugActor : !!iiActor && !actorLoading;
  const {
    data: nfts,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["nfts-by-owner", principal],
    queryFn: async () => {
      if (!principal || !actor) return [];
      const p = Principal.fromText(principal);
      return actor.getNFTsByOwner(p);
    },
    enabled: connected && !!principal && isActorReady,
    staleTime: 3e4
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "My NFTs" }),
        connected && nfts && nfts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
          nfts.length,
          " NFT",
          nfts.length !== 1 ? "s" : "",
          " minted"
        ] })
      ] }),
      connected && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", "data-ocid": "gallery.mint_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/mint", children: "+ Mint NFT" }) })
    ] }),
    !connected ? /* @__PURE__ */ jsxRuntimeExports.jsx(NotConnectedState, {}) : isLoading || walletType !== "plug" && actorLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonGrid, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 gap-4",
        "data-ocid": "gallery.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "Failed to load NFTs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Something went wrong while fetching your NFTs." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => refetch(),
              "data-ocid": "gallery.retry_button",
              children: "Try Again"
            }
          )
        ]
      }
    ) : !nfts || nfts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
        "data-ocid": "gallery.list",
        children: nfts.map((nft) => /* @__PURE__ */ jsxRuntimeExports.jsx(NFTCard, { nft, actor }, nft.id.toString()))
      }
    )
  ] }) }) });
}
export {
  GalleryPage
};
