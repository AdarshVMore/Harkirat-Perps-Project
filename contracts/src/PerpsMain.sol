// SPDX-License-Identifier : MIT

pragma solidity 0.8.20;

contract PerpsMain {
    struct Position {
        uint256 entryPrice;
        uint256 collateral;
        address user;
        bool isLong;
        uint256 leverage;
        uint size;
    }

    mapping(address => Position) public positions;

    uint256 public price = 1000;

    function setPrice(uint256 _price) external {
        price = _price;
    }

    function openingPosition(
        uint256 _entryPrice,
        uint256 _collateral,
        bool _isLong,
        uint256 _leverage
    ) public {
        uint256 positionSize = _collateral * _leverage;
        positions[msg.sender] = Position({
            entryPrice: _entryPrice,
            collateral: _collateral,
            user: msg.sender,
            isLong: _isLong,
            leverage: _leverage,
            size: positionSize
        });
    }

    function getProfitNLoss(
        address user,
        uint256 currentPrice
    ) public view returns (int256) {
        Position memory userPosition = positions[user];
        if (userPosition.isLong) {
            return
                int256(int256(currentPrice) - int256(userPosition.entryPrice)) *
                int256(userPosition.size);
        } else {
            return
                int256(int256(userPosition.entryPrice) - int256(currentPrice)) *
                int256(userPosition.size);
        }
    }

    function shouldLiquidate(
        address user,
        uint256 currentPrice
    ) public view returns (bool) {
        int256 pnl = getProfitNLoss(user, currentPrice);
        if (pnl < 0 && uint256(-pnl) >= positions[user].collateral) {
            return false;
        }
        return true;
    }
}
