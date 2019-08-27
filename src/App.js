import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from './getWeb3';
import AirlineContrat from './ariline';

export class App extends Component {

    constructor(props) {
        super(props);

        // inicializmamo el estado del componente react con la cuenta como no definida
        this.state = {
            account: undefined,
            balance: 0
        };
    }

    /**
     * Una vez montado el documento
     */
    async componentDidMount(){
        this.web3 = await getWeb3();
        this.airline = await AirlineContrat(this.web3.currentProvider);

        var account = (await this.web3.eth.getAccounts())[0].toLowerCase();
       
        this.setState({
            account : account
        }, () => {
            this.load();
        });
    }

    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({ balance : weiBalance});
    }

    async load() {
        this.getBalance();
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