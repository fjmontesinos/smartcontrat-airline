// todo como importaremos esto si no tenemos este fichero json?
import AirlineContract from "../build/contracts/Airline.json";
import contract from "truffle-contract";

/**
 * Nos permite crear una instancia de nuestro Smart Contract
 */
export default async(provider) => {
    const airline = contract(AirlineContract);
    airline.setProvider(provider);

    let instance = await airline.deployed();
    return instance;
};