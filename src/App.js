import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from './getWeb3';
import AirlineContrat from './ariline';
import { AirlineService } from './airlineService';

import { ToastContainer} from 'react-toastr';


const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);

        // inicializmamo el estado del componente react con la cuenta como no definida
        this.state = {
            account: undefined,
            balance: 0,
            flights: [],
            customerFlights: [],
            refundableEther: 0
        };
    }

    /**
     * Una vez montado el documento
     */
    async componentDidMount(){
        this.web3 = await getWeb3();
        this.airline = await AirlineContrat(this.web3.currentProvider);
        this.toEther = converter(this.web3);
        this.airlineService = new AirlineService(this.airline);

        var account = (await this.web3.eth.getAccounts())[0].toLowerCase();
       
        let flightPurchased = this.airline.FlightPurchased();
        flightPurchased.watch(function(err, result){
            const {customer, price, flight} = result.args;
            if(customer === this.state.account) {
                console.log('You purchased a flight to ' + flight + ' with a cost of ' + this.toEther(price) + ' eth');
            } else {
                this.container.success('Last purchased flight to ' + flight + ' with a cost of ' + this.toEther(price) + ' eth', 'Flight Purchased');
            }
        }.bind(this));

        // suscribirnos a un evento de metamask de actualización para refrescar un cambio de cuenta
        this.web3.currentProvider.publicConfigStore.on('update', async function(event) {
            this.setState({
                account: event.selectedAddress.toLowerCase()
            }, () => {
                this.load();
            });
        }.bind(this));

        this.setState({
            account : account
        }, () => {
            this.load();
        });
    }

    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({ balance : this.toEther(weiBalance)});
    }

    async getFlights(){
        let flights = await this.airlineService.getFlights();
        this.setState({ flights: flights});
    }

    async getCustomerFlights(){
        let customerFlights = await this.airlineService.getCustomerFlights(this.state.account);
        this.setState({ customerFlights});
    }

    async getRefundableEther(){
        let refundableEther = await this.airlineService.getRefundableEther(this.state.account);
        this.setState({refundableEther: this.toEther(refundableEther)});
    }

    async buyFlight(flightIndex, flight){
        // console.log("Buy flight index: " + flightIndex + ", flight: " + flight.name + ", cost: " + flight.price);
        await this.airlineService.buyFlight(flightIndex, this.state.account, flight.price);
    }

    async redeemLoyaltyPoints(){
        // console.log("Buy flight index: " + flightIndex + ", flight: " + flight.name + ", cost: " + flight.price);
        await this.airlineService.redeemLoyaltyPoints(this.state.account);
    }


    async load() {
        this.getBalance();
        this.getFlights();
        this.getCustomerFlights();
        this.getRefundableEther();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Account Balance">
                        <p><strong>Account:</strong> {this.state.account}</p>
                        <span><strong>Balance:</strong> {this.state.balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">        
                        <span>Refundable Ether: {this.state.refundableEther} eth</span>
                        <button className="btn btn-sm btn-success text-white" 
                        onClick={() => this.redeemLoyaltyPoints()}>Refund</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map( (flight, i) => {
                            return <div key={i}>
                                <span>{i} # {flight.name} - cost: {this.toEther(flight.price)} eth</span>
                                <button className="btn btn-sm btn-success text-white" onClick={() => this.buyFlight(i, flight)}>Buy</button>
                            </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        {this.state.customerFlights.map( (flight, i) => {
                            return <div key={i}>
                                <span>{i} # {flight.name} - cost: {this.toEther(flight.price)} eth</span>
                            </div>
                        })}
                    </Panel>
                </div>
            </div>

            <ToastContainer ref={(input) => this.container = input} className="toast-top-right" />

        </React.Fragment>
    }
}