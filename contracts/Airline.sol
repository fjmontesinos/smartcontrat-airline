pragma solidity ^0.4.24;

contract Airline {

    address public owner;

    struct Customer {
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint price;
    }

    uint etherPerPoint = 0.5 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint) public customerTotalFlights;

    event FlightPurchased(address indexed customer, uint price, string flight);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight('Tokyo', 4 ether));
        flights.push(Flight('Germany', 5 ether));
        flights.push(Flight('Madrid', 6 ether));
    }

    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price, 'Debe enviar el valor necesario de moneda');

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;

        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price, flight.name);
    }

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        // todo verificar que se dispone de balnace suficiente para cambiar los puntos por ether
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        // todo verificar que se dispone de balnace suficiente para cambiar los puntos por ether
        Customer memory customer = customers[msg.sender];
        return (etherPerPoint * customer.loyaltyPoints);
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airLineAddress = this;
        return airLineAddress.balance;
    }

    modifier isOwner(){
        require(msg.sender == owner, 'Sin permiso');
        _;
    }

}