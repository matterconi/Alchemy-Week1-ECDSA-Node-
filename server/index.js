const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { _getPrivateKey, _getPublicKey, _getAddress, formatValue } = require("./scripts/generate");

app.use(cors());
app.use(express.json());

const privateKeys = [];

for (let i = 0; i < 3; i++) {
  privateKeys.push(_getPrivateKey());
}

const addresses = privateKeys.map(_getAddress);

const balances = {
};

for (let address of addresses) {
  balances[address] = Math.floor(Math.random() * 1000);
}

const formatPrivateKeys = privateKeys.map((privateKey) => formatValue(privateKey));

const publicKeys = privateKeys.map(privateKey => formatValue(_getPublicKey(privateKey)));

const privateAndPublic = {
}

for (let i = 0; i < privateKeys.length; i++) {
    privateAndPublic[formatPrivateKeys[i]] = addresses[i];
  }

console.log(balances);

console.log(privateAndPublic);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  let balance = 0;
  if (balances[privateAndPublic[address]]) {
    balance = balances[privateAndPublic[address]];
  }
  else if (balances[address]) {
    balance = balances[address];
  }
  else {
    balance = 0;
  }
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[privateAndPublic[sender]] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!balances[privateAndPublic[sender]]) {
    res.status(400).send({ message: "Permission denied!" });
  }
  else {
    balances[privateAndPublic[sender]] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[privateAndPublic[sender]] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}