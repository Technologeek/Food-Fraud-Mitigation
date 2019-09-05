const express = require("express")
const app = express()
const port = 3000
const router = express.Router()

const port = 3000 || `${process.env.PORT}`
app.get("/", (req, res) => res.send("Server Started!"))

app.listen(port, () => console.log(`Listening on port ${port}!`))

const Web3 = require("web3")

//Main-Net address goes here.
web3 = new Web3(
  new Web3.providers.HttpProvider(
    "mainnet.infura.io/v3/642cda5e8cb84382a6afe126001f92c4"
  )
)

//Primary Contract Address
const primary_address = "0xBA12fC5f0C6F7ffDA621947a26Ce5B3BEa7E050D"

let abi = [
  {
    constant: true,
    inputs: [],
    name: "foodFraudContract",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_msg", type: "bytes32" }],
    name: "foodFraudContract",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: primary_address, type: "address" },
      { indexed: true, name: "foodFraudContract", type: "bytes32" }
    ],
    name: "Event1",
    type: "event"
  }
]

const contract = new web3.eth.Contract(
  abi,
  "mainnet.infura.io/v3/642cda5e8cb84382a6afe126001f92c4"
)

router.get("/getEvents", (req, res) => {
  contract.getPastEvents(
    "Event1",
    {
      filter: { _from: req.addr },
      fromBlock: 0,
      toBlock: "latest"
    },
    (error, events) => {
      for (i = 0; i < events.length; i++) {
        var eventObj = events[i]
        res.send("Address: " + eventObj.returnValues._from)
        res.send(
          "ByteCode: " + web3.utils.hexToAscii(eventObj.returnValues._status)
        )
      }
    }
  )
  res.send("Events", contract)
})

router.post("/signTransaction", (req, res) => {
  const privateKey = new Buffer("secureKey", "hex") //PrivateKeyOmitted! On Production, this should be handled on the client side.

  const senderAddress = req.sendAddress
  const receiverAddress = req.receiverAddress
  const transactionValue = web3.utils.numberToHex(
    web3.utils.toWei("0.1", "ether")
  )
  const transactionData = web3.utils.asciiToHex("oh hai mark")

  const rawTransaction = {
    nonce: "0x0",
    gasPrice: req.gasFee,
    gasLimit: "0x55f0" || "",
    from: senderAddress,
    to: receiverAddress,
    transactionValue: transactionValue,
    transactionData: transactionData
  }

  const transaction = web3.Tx(rawTransaction)
  transaction.sign(privateKey)

  web3.eth.sendSignedTransaction("0x" + transaction.toString("hex"))
  //response is the uniquely generated transaction ID
  res.send(
    JSON.stringify(
      web3.eth.sendSignedTransaction("0x" + transaction.toString("hex"))
    )
  )
})

router.get("/getBalance", (req, res) => {
  web3.eth.getBalance(req.address, (error, result) => {
    if (error) return
    res.send("Address:", web3.utils.fromWei(result, "ether"))
  })
})
