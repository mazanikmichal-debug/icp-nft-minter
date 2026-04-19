module {
  public type TokenId = Nat;
  public type Timestamp = Int;

  /// ICRC-7 standard value type for metadata
  public type MetadataValue = {
    #Text : Text;
    #Nat : Nat;
    #Int : Int;
    #Blob : Blob;
    #Array : [MetadataValue];
    #Map : [(Text, MetadataValue)];
  };

  /// ICRC-7 account type
  public type Account = {
    owner : Principal;
    subaccount : ?Blob;
  };
};
