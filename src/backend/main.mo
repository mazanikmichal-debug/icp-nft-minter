import NftLib "lib/nft";
import NftApi "mixins/nft-api";

actor {
  let state = NftLib.newState();
  include NftApi(state);
};
