import { BigNumber } from 'bignumber.js';

// export const handleApproveGemTransfer = (
//   _contract,
//   _approvedContract,
//   _tokenId
// ) =>
//   new Promise((resolve, reject) => {
//     _contract.approve(_approvedContract, _tokenId, (error, result) => {
//       if (!error) resolve(_tokenId, result);
//       else reject(error);
//     });
//   });

export const ethToWei = eth => Number((eth * 1000000000000000000).toFixed(20));

export const daysToMilliseconds = days => Number((days * 86400000).toFixed(20));

export const daysToSeconds = days => Number(days * 86400);

     // converts BigNumber representing Solidity uint256 into String representing Solidity bytes
const toBytes = (uint256) => {
        let s = uint256.toString(16);
        const len = s.length;
        // 256 bits must occupy exactly 64 hex digits
        if (len > 64) {
            s = s.substr(0, 64);
        }
        for (let i = 0; i < 64 - len; i += 1) {
            s = `0${s}`;
        }
        return `0x${s}`;
    }

    // @notice creates an auction
export const createAuction = async (
    _tokenId,
    _duration, _startPriceInWei, _endPriceInWei, _contract, _currentAccount
) => {
  
    // construct auction parameters
    const token = Number(_tokenId)
    const tokenId = new BigNumber(token)
    const t0 = (Math.round(new Date().getTime() / 1000)) || 0;
    const t1 = t0 + _duration;
    const p0 = _startPriceInWei;
    const p1 = _endPriceInWei;
    const two = new BigNumber(2)

    const data = toBytes(two.pow(224).times(tokenId)
        .plus(two.pow(192).times(t0))
        .plus(two.pow(160).times(t1))
        .plus(two.pow(80).times(p0))
        .plus(p1))

    const auctionContract = '0xdd229423db08b1e9a0add49986e358dab72b7f54'

    _contract.methods.safeTransferFrom(
        _currentAccount, auctionContract, token, data
    ).send()

};