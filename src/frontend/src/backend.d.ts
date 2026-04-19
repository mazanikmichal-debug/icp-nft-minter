import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MetadataValue = {
    __kind__: "Int";
    Int: bigint;
} | {
    __kind__: "Map";
    Map: Array<[string, MetadataValue]>;
} | {
    __kind__: "Nat";
    Nat: bigint;
} | {
    __kind__: "Blob";
    Blob: Uint8Array;
} | {
    __kind__: "Text";
    Text: string;
} | {
    __kind__: "Array";
    Array: Array<MetadataValue>;
};
export type MintResult = {
    __kind__: "ok";
    ok: TokenId;
} | {
    __kind__: "err";
    err: string;
};
export type Timestamp = bigint;
export interface Account {
    owner: Principal;
    subaccount?: Uint8Array;
}
export type TokenId = bigint;
export interface NFTInfo {
    id: TokenId;
    owner: Principal;
    name: string;
    description: string;
    mintedAt: Timestamp;
}
export interface backendInterface {
    getNFTsByOwner(owner: Principal): Promise<Array<NFTInfo>>;
    getTokenImage(tokenId: TokenId): Promise<Uint8Array | null>;
    icrc7_balance_of(accounts: Array<Account>): Promise<Array<bigint>>;
    icrc7_collection_metadata(): Promise<Array<[string, MetadataValue]>>;
    icrc7_default_take_value(): Promise<bigint | null>;
    icrc7_max_query_batch_size(): Promise<bigint | null>;
    icrc7_max_take_value(): Promise<bigint | null>;
    icrc7_max_update_batch_size(): Promise<bigint | null>;
    icrc7_name(): Promise<string>;
    icrc7_owner_of(token_ids: Array<TokenId>): Promise<Array<Account | null>>;
    icrc7_symbol(): Promise<string>;
    icrc7_token_metadata(token_ids: Array<TokenId>): Promise<Array<Array<[string, MetadataValue]> | null>>;
    icrc7_tokens(prev: TokenId | null, take: bigint | null): Promise<Array<TokenId>>;
    icrc7_tokens_of(account: Account, prev: TokenId | null, take: bigint | null): Promise<Array<TokenId>>;
    icrc7_total_supply(): Promise<bigint>;
    mint(name: string, description: string, image: Uint8Array): Promise<MintResult>;
}
