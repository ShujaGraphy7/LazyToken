node matic-gatherer-v2 `0xF65378DdA5656c91e5Ae12EB2c66BE6d8170a585`
import fetch from ‘node-fetch’;
const getAddress = () => {
const address = process.argv[2];
if (!address) {
console.log(`Please add the address as script argument`);
process.exit(1);
}
return address;
};
const getMatic = async (address) => {
console.log(`fetching matic to ‘${address}’`);
fetch(`https://api.faucet.matic.network/transferTokens`, {
method: post,
body: JSON.stringify({
network: mumbai,
address: address,
token: maticToken,
}),
headers: { ‘Content-Type’: application/json },
}).then(res => res.json()).then(console.log)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
// const delay = async (ms) => setTimeout(resolve, ms);
console.log(`waiting 2 minutes`);
await delay(2 * 60000);
};
const address = getAddress();