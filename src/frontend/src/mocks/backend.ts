import type { backendInterface } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

// A tiny 1x1 px grey PNG as a Uint8Array for image mock data
const sampleImageBytes = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
  0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84,
  8, 215, 99, 136, 136, 136, 0, 0, 0, 4, 0, 1, 166, 248, 134, 209, 0, 0, 0,
  0, 73, 69, 78, 68, 174, 66, 96, 130,
]);

const sampleNFTs = [
  {
    id: BigInt(1),
    owner: { toString: () => "aaaaa-aa" } as unknown as Principal,
    name: "Cosmic Horizon #1",
    description: "A stunning NFT from the cosmos",
    mintedAt: BigInt(Date.now()) * BigInt(1_000_000),
  },
  {
    id: BigInt(2),
    owner: { toString: () => "aaaaa-aa" } as unknown as Principal,
    name: "Digital Dream #2",
    description: "Abstract digital art",
    mintedAt: BigInt(Date.now()) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    owner: { toString: () => "aaaaa-aa" } as unknown as Principal,
    name: "Neon Pulse #3",
    description: "Vibrant neon artwork",
    mintedAt: BigInt(Date.now()) * BigInt(1_000_000),
  },
];

export const mockBackend: backendInterface = {
  getNFTsByOwner: async (_owner: Principal) => sampleNFTs,
  getTokenImage: async (_tokenId: bigint) => sampleImageBytes,
  icrc7_balance_of: async (_accounts) => [BigInt(3)],
  icrc7_collection_metadata: async () => [
    ["icrc7:name", { __kind__: "Text", Text: "ICP NFT Collection" }],
    ["icrc7:symbol", { __kind__: "Text", Text: "ICPNFT" }],
  ],
  icrc7_default_take_value: async () => BigInt(10),
  icrc7_max_query_batch_size: async () => BigInt(100),
  icrc7_max_take_value: async () => BigInt(100),
  icrc7_max_update_batch_size: async () => BigInt(100),
  icrc7_name: async () => "ICP NFT Collection",
  icrc7_owner_of: async (_token_ids) => [
    { owner: { toString: () => "aaaaa-aa" } as unknown as Principal },
  ],
  icrc7_symbol: async () => "ICPNFT",
  icrc7_token_metadata: async (_token_ids) => [
    [
      ["icrc7:metadata:uri:name", { __kind__: "Text", Text: "Cosmic Horizon #1" }],
    ],
  ],
  icrc7_tokens: async (_prev, _take) => [BigInt(1), BigInt(2), BigInt(3)],
  icrc7_tokens_of: async (_account, _prev, _take) => [BigInt(1), BigInt(2), BigInt(3)],
  icrc7_total_supply: async () => BigInt(3),
  mint: async (_name: string, _description: string, _image: Uint8Array) => ({
    __kind__: "ok",
    ok: BigInt(4),
  }),
};
