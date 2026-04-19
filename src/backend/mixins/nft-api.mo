import Types "../types/nft";
import CommonTypes "../types/common";
import NftLib "../lib/nft";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (state : NftLib.State) {

  // ── Mint ────────────────────────────────────────────────────────────────────

  /// Mint one NFT to the calling principal.
  /// Returns the new token ID on success or an error message.
  public shared ({ caller }) func mint(
    name : Text,
    description : Text,
    image : Blob,
  ) : async Types.MintResult {
    if (caller.isAnonymous()) {
      return #err("Anonymous callers cannot mint NFTs");
    };
    if (name.size() == 0 or name.size() > 100) {
      return #err("Name must be between 1 and 100 characters");
    };
    if (description.size() > 500) {
      return #err("Description must be at most 500 characters");
    };
    if (image.size() == 0) {
      return #err("Image blob cannot be empty");
    };
    if (image.size() > 5_000_000) {
      return #err("Image exceeds 5 MB limit");
    };
    let tokenId = NftLib.mint(state, caller, name, description, image, Time.now());
    #ok(tokenId);
  };

  // ── ICRC-7 collection metadata ───────────────────────────────────────────────

  public query func icrc7_name() : async Text {
    "ICP NFT Minter";
  };

  public query func icrc7_symbol() : async Text {
    "ICPNFT";
  };

  public query func icrc7_total_supply() : async Nat {
    NftLib.totalSupply(state);
  };

  public query func icrc7_collection_metadata() : async [(Text, CommonTypes.MetadataValue)] {
    [
      ("icrc7:name", #Text("ICP NFT Minter")),
      ("icrc7:symbol", #Text("ICPNFT")),
      ("icrc7:total_supply", #Nat(NftLib.totalSupply(state))),
      ("icrc7:description", #Text("Simple NFT minting dApp on the Internet Computer")),
    ];
  };

  public query func icrc7_max_query_batch_size() : async ?Nat {
    ?100;
  };

  public query func icrc7_max_update_batch_size() : async ?Nat {
    ?1;
  };

  public query func icrc7_default_take_value() : async ?Nat {
    ?100;
  };

  public query func icrc7_max_take_value() : async ?Nat {
    ?1000;
  };

  // ── ICRC-7 token queries ─────────────────────────────────────────────────────

  /// List token IDs with optional pagination
  public query func icrc7_tokens(prev : ?Types.TokenId, take : ?Nat) : async [Types.TokenId] {
    NftLib.listTokenIds(state, prev, take);
  };

  /// Get metadata for a batch of tokens
  public query func icrc7_token_metadata(token_ids : [Types.TokenId]) : async [?[(Text, CommonTypes.MetadataValue)]] {
    token_ids.map<Types.TokenId, ?[(Text, CommonTypes.MetadataValue)]>(func(id) {
      NftLib.tokenMetadata(state, id)
    });
  };

  /// Get owners for a batch of tokens
  public query func icrc7_owner_of(token_ids : [Types.TokenId]) : async [?CommonTypes.Account] {
    token_ids.map<Types.TokenId, ?CommonTypes.Account>(func(id) {
      NftLib.ownerOf(state, id)
    });
  };

  /// Get balance for a batch of accounts
  public query func icrc7_balance_of(accounts : [CommonTypes.Account]) : async [Nat] {
    accounts.map<CommonTypes.Account, Nat>(func(account) {
      NftLib.balanceOf(state, account)
    });
  };

  /// List all token IDs owned by a given account (with pagination)
  public query func icrc7_tokens_of(
    account : CommonTypes.Account,
    prev : ?Types.TokenId,
    take : ?Nat,
  ) : async [Types.TokenId] {
    let all = NftLib.tokensByOwner(state, account.owner);
    let limit = switch (take) { case (?n) n; case null 100 };
    let limitInt = limit.toInt();
    switch (prev) {
      case (?prevId) {
        all.filter(func(id) { id > prevId }).sliceToArray(0, limitInt);
      };
      case null {
        all.sliceToArray(0, limitInt);
      };
    };
  };

  // ── Gallery helper ───────────────────────────────────────────────────────────

  /// Return all NFT info (without image) for the given principal — used by gallery
  public query func getNFTsByOwner(owner : Principal) : async [Types.NFTInfo] {
    let ids = NftLib.tokensByOwner(state, owner);
    ids.filterMap<Types.TokenId, Types.NFTInfo>(func(id) {
      switch (NftLib.getToken(state, id)) {
        case (?nft) ?{
          id = nft.id;
          name = nft.name;
          description = nft.description;
          owner = nft.owner;
          mintedAt = nft.mintedAt;
        };
        case null null;
      }
    });
  };

  /// Return image blob for a single token
  public query func getTokenImage(tokenId : Types.TokenId) : async ?Blob {
    NftLib.getTokenImage(state, tokenId);
  };
};
