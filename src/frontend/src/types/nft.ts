import type { Principal } from "@icp-sdk/core/principal";

export type TokenId = bigint;
export type Timestamp = bigint;

export interface NFTInfo {
  id: TokenId;
  owner: Principal;
  name: string;
  description: string;
  mintedAt: Timestamp;
}

export interface MintResult {
  ok?: TokenId;
  err?: string;
}

export interface WalletState {
  connected: boolean;
  principal: string | null;
  walletType: "plug" | "ii" | null;
}
