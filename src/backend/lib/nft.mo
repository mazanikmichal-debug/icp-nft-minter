import Types "../types/nft";
import CommonTypes "../types/common";
import Map "mo:core/Map";

module {
  public type State = {
    tokens : Map.Map<Types.TokenId, Types.NFT>;
    var nextTokenId : Nat;
  };

  /// Create a fresh empty state
  public func newState() : State {
    {
      tokens = Map.empty<Types.TokenId, Types.NFT>();
      var nextTokenId = 0;
    };
  };

  /// Mint a new NFT to the given principal
  public func mint(
    state : State,
    owner : Principal,
    name : Text,
    description : Text,
    image : Blob,
    mintedAt : CommonTypes.Timestamp,
  ) : Types.TokenId {
    let tokenId = state.nextTokenId;
    let nft : Types.NFT = {
      id = tokenId;
      name;
      description;
      image;
      owner;
      mintedAt;
    };
    state.tokens.add(tokenId, nft);
    state.nextTokenId += 1;
    tokenId;
  };

  /// Get an NFT by token ID
  public func getToken(state : State, tokenId : Types.TokenId) : ?Types.NFT {
    state.tokens.get(tokenId);
  };

  /// Get all token IDs (paginated via prev/take)
  public func listTokenIds(
    state : State,
    prev : ?Types.TokenId,
    take : ?Nat,
  ) : [Types.TokenId] {
    let limit = switch (take) { case (?n) n; case null 100 };
    var iter = state.tokens.keys();
    // Skip all IDs up to and including prev
    switch (prev) {
      case (?prevId) {
        iter := iter.filter(func(id) { id > prevId });
      };
      case null {};
    };
    iter.take(limit).toArray();
  };

  /// Get the owner (as ICRC-7 Account) of a token
  public func ownerOf(state : State, tokenId : Types.TokenId) : ?CommonTypes.Account {
    switch (state.tokens.get(tokenId)) {
      case (?nft) ?{ owner = nft.owner; subaccount = null };
      case null null;
    };
  };

  /// Get the balance (number of tokens) for an account
  public func balanceOf(state : State, account : CommonTypes.Account) : Nat {
    state.tokens.values().filter(func(nft) {
      nft.owner == account.owner
    }).size();
  };

  /// Get all token IDs owned by a principal
  public func tokensByOwner(state : State, owner : Principal) : [Types.TokenId] {
    state.tokens.values()
      .filter(func(nft) { nft.owner == owner })
      .map<Types.NFT, Types.TokenId>(func(nft) { nft.id })
      .toArray();
  };

  /// Build ICRC-7 metadata for a token
  public func tokenMetadata(
    state : State,
    tokenId : Types.TokenId,
  ) : ?[(Text, CommonTypes.MetadataValue)] {
    switch (state.tokens.get(tokenId)) {
      case (?nft) {
        ?[
          ("icrc97:name", #Text(nft.name)),
          ("icrc97:description", #Text(nft.description)),
          ("icrc97:image", #Blob(nft.image)),
          ("icrc7:owner", #Text(nft.owner.toText())),
          ("icrc7:token_id", #Nat(nft.id)),
          ("icrc97:minted_at", #Int(nft.mintedAt)),
        ];
      };
      case null null;
    };
  };

  /// Get image blob for a token
  public func getTokenImage(state : State, tokenId : Types.TokenId) : ?Blob {
    switch (state.tokens.get(tokenId)) {
      case (?nft) ?nft.image;
      case null null;
    };
  };

  /// Total supply of minted NFTs
  public func totalSupply(state : State) : Nat {
    state.tokens.size();
  };
};
