export class AirlineService {
    constructor(contract) {
        this.contract = contract;
    }

    async getFlights(){
        let total = await this.getTotalFlights();
        let flights = [];
        for(var i = 0; i < total; i++){
            let flight = await this.contract.flights(i);
            flights.push(flight);
        }
        return this.mapFlights(flights);
    }

    async getTotalFlights(){
        return (await this.contract.totalFlights()).toNumber();
    }

    async buyFlight(flightIndex, from, value) {
        await this.contract.buyFlight(flightIndex, {from: from, value: value});   
    }

    mapFlights(flights) {
        return flights.map(flight => {
            return {
            name: flight[0], 
            price: flight[1].toNumber()}
        });
    }
}