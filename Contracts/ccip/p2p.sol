// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import { Attestation } from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import { DataLocation } from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/ERC20.sol";


interface P2PUSDC{
      function startRound(
        uint256 tradeId,
        uint256 amount
    ) external ;
}
contract P2POFFRAMP is FunctionsClient, ConfirmedOwner,P2PUSDC {
    using FunctionsRequest for FunctionsRequest.Request;
  using SafeERC20 for ERC20;

    IERC20 public usdcToken;
    //ISP public spInstance; //0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
     //ISP public spInstance = ISP(0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD);
     ISP public spInstance = ISP(0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5);

    uint64 public schemaId;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    string public characters;

    // Unique identifier for the Chainlink DON
    bytes32 private constant donID = 0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000;
    // Price feed address for ETH/USD
    address private constant priceFeedAddress = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165;
    // Router address for Sepolia
    address private constant router = 0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C;

    // Callback gas limit
    uint32 private constant gasLimit = 300000;

   error ConfirmationAddressMismatch(); 
   error UnexpectedRequestID(bytes32 requestId);

    // Mappings to store trade details and role-based access
    mapping(uint256 => Trade) public trades;
    mapping(address => bool) public isMerchant;
    mapping(address => bool) public isSeller;
    mapping(bytes32 => uint256) private requestIdToTradeId;

    // Structures to store trade-related data
    struct Merchant {
        address addr;
        uint256 cryptoLock;
    }

    struct Trade {
        Merchant buyer;
        Merchant seller;
        string Trx_Money;
        uint256 InrAmount;
        uint256 usdcLock;
        uint256 INR_Paid_to_Seller;
        bytes32 s_lastRequestId;
        bool agreed;
    }
address public i_usdcToken;
    // Events to log actions
    event CHAR(string ans);
    event attestationEvent (uint64 id);
    event startedround(uint256 tradeId,address seller,uint256 usdclock);
    event Response(bytes32 indexed requestId, string character, bytes response, bytes err);

    // Constructor to initialize FunctionsClient and ConfirmedOwne
constructor(address _usdcAddress) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    usdcToken = IERC20(_usdcAddress); // Assign address directly to the IERC20 token
}

    function setSchemaID(uint64 schemaId_) external onlyOwner {
        schemaId = schemaId_;
    }

    // Modifier to check if both buyer and seller are ready for trade
modifier onlyParticipant(uint256 tradeId) {
     Trade storage trade = trades[tradeId];  // Retrieve the trade once from storage
    require(
        (trade.buyer.addr == msg.sender || trade.seller.addr == msg.sender) &&
        trade.agreed == true,
        "Not authorized or trade not agreed"
    );
    _;
}

modifier OnlySeller(uint256 tradeId) {
    require(trades[tradeId].seller.addr == msg.sender, "you are not the authorized seller to claim");
    _;
}
    function buyer(address _buyer) external {
        isMerchant[_buyer] = true;
    }

    function seller(address _seller) external {
        isSeller[_seller] = true;
    }

    function getPrice(uint256 LockUSDC) internal pure returns (uint256) {
        uint256 usdValue = (LockUSDC * 83) / 1e6; // Convert ETH to USD
        return usdValue;
    }

    function startRound  (
        uint256 tradeId,
        uint256 amount
    ) external  {
         usdcToken.transferFrom(msg.sender, address(this), amount);
         trades[tradeId].usdcLock=amount;
          trades[tradeId].InrAmount = getPrice(amount);
    }

     function submitProposal(uint256 tradeId,uint256 tradeUsdc ) external {
        trades[tradeId].seller= Merchant(msg.sender, tradeUsdc);
        trades[tradeId].usdcLock = tradeUsdc;
    }

    function confimrUsdcLock(address sellerAddress,uint256 tradeId, string memory _data) external returns (uint64) {
        address partyB = msg.sender;
        if (trades[tradeId].seller.addr==sellerAddress) {
            bytes[] memory recipients = new bytes[](2);
            recipients[0] = abi.encode(sellerAddress);
            recipients[1] = abi.encode(partyB);
             bytes memory data = abi.encode(sellerAddress, partyB,trades[tradeId].usdcLock, _data);
            Attestation memory a = Attestation({
                schemaId: schemaId,
                linkedAttestationId: 0,
                attestTimestamp: 0,
                revokeTimestamp: 0,
                attester: address(this),
                validUntil: 0,
                dataLocation: DataLocation.ONCHAIN,
                revoked: false,
                recipients: recipients,
                data: data 
             });
          uint64 attestationId = spInstance.attest(a, "", "", "");
          emit attestationEvent(attestationId);
           trades[tradeId].agreed=true;
          trades[tradeId].buyer = Merchant(msg.sender, trades[tradeId].usdcLock);
            return attestationId;//for this attestationid -> both parties match modifier
        } else {
            revert ConfirmationAddressMismatch();
        }
    }
     
    // Function to claim ETH for the seller
    function claim(uint256 tradeId)  external OnlySeller(tradeId){
        Trade storage trade = trades[tradeId];
        uint256 amount = trade.usdcLock;
        require(amount > 0, "No USDC available to claim");
        require(trade.INR_Paid_to_Seller > trade.InrAmount, "you didnt transfer enough funds to your seller" );
        require(usdcToken.transfer(trade.buyer.addr, amount), "Failed to transfer USDC to seller");
           trade.usdcLock = 0;
    }

    // Function to send a request for character information
    function sendRequest (
        uint256 tradeId,
        uint64 subscriptionId,
        string[] calldata args
    ) external  OnlySeller(tradeId) returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (args.length > 0) req.setArgs(args);
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        requestIdToTradeId[s_lastRequestId] = tradeId;
        trades[tradeId].s_lastRequestId = s_lastRequestId;
        return s_lastRequestId;
    }

function Read(uint256 tradeId)
    public
    view
    returns (
        address buyerAddress,
        uint256 buyerCryptoLock,
        address sellerAddress,
        uint256 sellerCryptoLock,
        string memory trxMoney,
        uint256 inrAmount,
        uint256 usdcLock,
        uint256 INR_Paid_to_Seller,
        bytes32 lastRequestId,
        bool agreed
    )
{
    // Retrieve the Trade struct for the given tradeId
    Trade storage trade = trades[tradeId];
    return (
        trade.buyer.addr,
        trade.buyer.cryptoLock,
        trade.seller.addr,
        trade.seller.cryptoLock,
        trade.Trx_Money,
        trade.InrAmount,
        trade.usdcLock,
        trade.INR_Paid_to_Seller,
        trade.s_lastRequestId,
        trade.agreed
    );
}
    // Function to extract the amount from the response
    function extractAmount(string memory input)  internal pure returns (uint256) {
        bytes memory inputBytes = bytes(input);
        uint256 colonIndex = 0;
        for (uint256 i = 0; i < inputBytes.length; i++) {
            if (inputBytes[i] == ":") {
                colonIndex = i;
                break;
            }
        }
        bytes memory amountBytes = new bytes(colonIndex);
        for (uint256 i = 0; i < colonIndex; i++) {
            amountBytes[i] = inputBytes[i];
        }
        return stringToUint(string(amountBytes));
    }

    // Helper function to convert string to uint256
    function stringToUint(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] >= 0x30 && b[i] <= 0x39) {
                result = result * 10 + (uint256(uint8(b[i])) - 48);
            }
        }
        return result;
    }

    // Callback function for fulfilling a request
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {

        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }

        uint256 tradeId = requestIdToTradeId[requestId];
        trades[tradeId].Trx_Money = string(response);
         trades[tradeId].INR_Paid_to_Seller=extractAmount(trades[tradeId].Trx_Money);
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, trades[tradeId].Trx_Money, s_lastResponse, s_lastError);
    }

    // Inline JavaScript source code for the Chainlink request
    string private constant source = "const characterId = args[0];"
        "const characterId2 = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${characterId}/`, "
        "headers: { "
        "Authorization: `Bearer ${characterId2}`"
        "}"
        "});"
        "if (apiResponse.error) {"
        "return Functions.encodeString('Error: ' + apiResponse.error.message);"
        "}"
        "const { data } = apiResponse;"
        "const snippet = data.snippet;"
        "const amountRegex = /(?:\\u20B9\\s?|Paid to\\s?\\w+\\s?\\w+\\s?\\u20B9\\s?)(\\d+)/;"
        "const txnIdRegex = /Txn\\.\\s?ID\\s?:\\s?(\\w+)/;"
        "const amountMatch = snippet.match(amountRegex);"
        "const amount = amountMatch ? amountMatch[1] : 'Amount not found';"
        "const txnIdMatch = snippet.match(txnIdRegex);"
        "const txnId = txnIdMatch ? txnIdMatch[1] : 'Txn ID not found';"
        "return Functions.encodeString(amount + ':' + txnId);";

}