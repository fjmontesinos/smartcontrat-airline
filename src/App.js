import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from './getWeb3';
import AirlineContrat from './ariline';
import { AirlineService } from './airlineService';


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

    async load() {
        this.getBalance();
        this.getFlights();
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

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map( (flight, i) => {
                            return <div key={i}>
                                <span>{i} # {flight.name} - cost: {this.toEther(flight.price)}</span>
                            </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}