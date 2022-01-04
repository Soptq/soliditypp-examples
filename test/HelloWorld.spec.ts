import { describe } from "mocha";
import { expect } from "chai";
import * as compiler from "../src/compiler";
import * as vite from "../src/vite";
import config from "./vite.config.json";

let provider: any;
let deployer: any;

describe('test HelloWorld', () => {
  before(async function() {
    provider = vite.localProvider();
    deployer = vite.newAccount(config.networks.local.mnemonic, 0);
    // console.log('deployer', deployer.address);
  });

  it('test contract', async () => {
    // compile
    const compiledContracts = await compiler.compile('HelloWorld.solpp');
    expect(compiledContracts).to.have.property('HelloWorld');

    // deploy
    let helloWorld = compiledContracts.HelloWorld;
    helloWorld.setDeployer(deployer).setProvider(provider);
    await helloWorld.deploy({});
    expect(helloWorld.address).to.be.a('string');
    console.log(helloWorld.address);

    // check default value of data
    let result = await helloWorld.query('data', []);
    console.log('return', result);
    expect(result).to.be.an('array').with.lengthOf(1);
    expect(result![0]).to.be.equal('123');

    // call HelloWorld.set(456);
    await helloWorld.call('set', ['456'], {});

    // check value of data
    result = await helloWorld.query('data', []);
    console.log('return', result);
    expect(result).to.be.an('array').with.lengthOf(1);
    expect(result![0]).to.be.equal('456');
  });
});