// SPDX-License-Identifier : MIT

pragma solidity 0.8.20;

contract PerpsMain {
    struct position {
        uint256 entryPrice;
        uint256 collateral;
        address user;
        bool isLong;
        uint256 leverage;
        uint size;
    }

    mapping(address => position) public positions;

    function openingPosition(uint256 _entryPrice, uint256 _collateral, bool _isLong, uint256 _leverage) public {
        uint256 positionSize = _collateral * _leverage;
        positions[msg.sender] = position(_entryPrice, _collateral, msg.sender, _isLong, _leverage, positionSize);
    }

    function getProfitNLoss(address user, uint256 currentPrice) public view returns (int256) {
        position memory userPosition = positions[user];
        if(userPosition.isLong) {
            return int256(currentPrice - userPosition.entryPrice) * int256(userPosition.size);
        }
        else {
            return int256(userPosition.entryPrice - currentPrice) * int256(userPosition.size);
        }
    }

    function shouldLiquidate(address user, uint256 currentPrice) public view returns (bool) {
        int256 pnl = getProfitNLoss(user, currentPrice);
        if(pnl < 0 && uint(-pnl) >= positions[user].collateral){
            return false;
        }
        return true;
    }
}