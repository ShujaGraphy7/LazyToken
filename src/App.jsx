import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import abi from "./abi.json";
function App() {
  let signer = null;
  let provider;

  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setTokenPrice] = useState("0");
  const [resp, setResp] = useState([]);
  const SIGNING_DOMAIN_NAME = "Voucher-Domain";
  const SIGNING_DOMAIN_VERSION = "1";
  const contractAddress = "0xED95e59CFd2a19AdcbCb15A2276a731F52755d80";
  const domain = {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: contractAddress,
    chainId: 80001,
  };

  const createVoucher = async (tokenId, price, uri) => {
    const voucher = { tokenId, price, uri };
    const types = {
      LazyNFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "uri", type: "string" },
      ],
    };

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const signature = await signer._signTypedData(domain, types, voucher);
    setAddress(await signer.getAddress());
    return {
      ...voucher,
      signature,
    };
  };

  

  const handleJSONsubmission = async () => {
    try {
      await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: {
          tokenId: tokenId,
          price: price,
        },
        headers: {
          pinata_api_key: `5d84861fe44c09daaab5`,
          pinata_secret_api_key: `caf6aed134e58581ee9bff08d9bec1ec9564125d131802ad3a9bba663d75ab8a`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        console.log("asgasfsafd", res);
        const voucher = await createVoucher(
          tokenId,
          price,
          "https://ipfs.io/ipfs/" + res.data.IpfsHash
        );

        setResp(oldArray=>[...oldArray,JSON.parse(`[${voucher.tokenId}, ${voucher.price}, "${
          "https://ipfs.io/ipfs/" + res.data.IpfsHash
        }", "${voucher.signature}"]`)]
        );

        console.log(resp);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const buyNFT = async (id,price,uri,sign) => {
    
    const x = `[${id},${price},"${uri}","${sign}"]`
    console.log(JSON.parse(x))
    
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    let contractInstance = new ethers.Contract(contractAddress, abi, signer);
    await contractInstance.recover([id,price,uri,sign])
    .then(async (res) => {
      if (res == address) {
        console.log("success:", res);
        await contractInstance.safeMint([id,price,uri,sign], address, {
          value: price,
        });
      } else {
        console.error("invalid Signature:", res);
      }
    });
  };

  const tokenIdHandeler = (e) => {
    setTokenId(e.target.value);
  };

  const tokenPriceHandeler = (e) => {
    setTokenPrice(e.target.value);
  };

  return (
    <>
      <div className="my-32">
        <div className="grid gap-5">
          <input
            className="p-2 border-2 mx-auto placeholder:font-light font-black"
            onChange={tokenIdHandeler}
            placeholder="Token Id"
            type="text"
            name="TokenId"
            id="TokenId"
          />
          <input
            className="p-2 border-2 mx-auto placeholder:font-light font-black"
            onChange={tokenPriceHandeler}
            placeholder="Token Price"
            type="text"
            name="TokenPrice"
            id="TokenPrice"
          />

          <button
            className="mx-auto bg-black p-2 rounded-md text-white px-4"
            onClick={handleJSONsubmission}
          >
            Create Voucher
          </button>
        </div>
        <div className="border mx-auto my-20 ">
          {resp.map((item, index) => (
            <div className="m-4 w-fit p-4 border-2" key={index}>
              <p>Token Id: {item[0]}</p>
              <p>Token Price: {item[1]}</p>
              <p>Token URI: {item[2]}</p>
              <p>sign: {item[3]}</p>

              <button
                onClick={()=>{buyNFT(item[0],item[1],item[2],item[3])}}
                className="w-full bg-black text-white p-2 px-4 my-2"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
