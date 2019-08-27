import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from './getWeb3';

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account: undefined,
        };
    }

    /**
     * Una vez montado el documento
     */
    async componentDidMount(){
        this.web3 = await getWeb3();
        
        var account = (await this.web3.eth.getAccounts())[0].toLowerCase();
       
        this.setState({
            account : account
        }, () => {
            this.load();
        });
    }

    async load() {
        console.log(this.state.account);
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">

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