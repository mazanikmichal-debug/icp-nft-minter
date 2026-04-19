import Common "common";

module {
  public type TokenId = Common.TokenId;
  public type Account = Common.Account;
  public type MetadataValue = Common.MetadataValue;

  /// Internal NFT record stored in the canister
  public type NFT = {
    id : TokenId;
    name : Text;
    description : Text;
    image : Blob;
    owner : Principal;
    mintedAt : Common.Timestamp;
  };

  /// Public NFT info returned to callers (no raw blob for listing)
  public type NFTInfo = {
    id : TokenId;
    name : Text;
    description : Text;
    owner : Principal;
    mintedAt : Common.Timestamp;
  };

  /// ICRC-7 transfer args (minimal — for completeness, not implemented)
  public type TransferArg = {
    token_id : TokenId;
    from_subaccount : ?Blob;
    to : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  /// ICRC-7 transfer error variants
  public type TransferError = {
    #NonExistingTokenId;
    #InvalidRecipient;
    #Unauthorized;
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #GenericBatchError : { error_code : Nat; message : Text };
  };

  /// Mint result
  public type MintResult = {
    #ok : TokenId;
    #err : Text;
  };
};
