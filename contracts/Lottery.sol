// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
 
   uint public lotteryId;
   uint public entryFees;

   address public owner;

   address payable[] participants;
   address payable[] winners;
   
   event WinnerPicked(address payable winner);
   event TicketBought(address player);

   constructor(){
      owner = msg.sender;
      lotteryId=0;
      entryFees=1000000000000000;
   }
   
   modifier onlyOwner {
      require ( msg.sender == owner );
      _;
   }
   
   // Returns the current balance of the contract
   function getBalance() onlyOwner public view returns(uint){
      return address(this).balance;
   }
   
   // Enter in the lottery
   function enter() public payable {
      require ( msg.value == entryFees, "Invalid amount, send atleast 0.001 ether" );
      participants.push(payable(msg.sender));
      emit TicketBought(msg.sender);
   }
   
   // Returns list of participants
   function getParticipants() public view returns( address payable[] memory ) {
      return participants;
   }
   
   // Return last winner
   function getLastWinner() public view returns(address){
      require ( lotteryId > 0, "No one has won the lottery yet!" );
      return winners[lotteryId-1];
   }

   //Picks winner
   function pickWinner() onlyOwner public payable {

      address payable winner;

      // getting random winner
      uint index = random() % participants.length;
      winner = participants[index];

      // transfer amout to winner
      winner.transfer(transferAmount());

      // pushing winner to winners array
      winners.push(winner);
      //transfer some remaining amount to owner
      payable(owner).transfer(address(this).balance);

      // increasing the lotteryId
      lotteryId++;

      // reset participants
      participants = new address payable[](0);

      emit WinnerPicked(winner);
   }

   // Return 90 % of the contract balance
   function transferAmount() private view returns(uint) {
      uint amount = (getBalance()*90)/100;
      return amount;
   }
   
   // Returns random number
   function random() onlyOwner private view returns(uint){
      return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, participants.length)));
   }


}