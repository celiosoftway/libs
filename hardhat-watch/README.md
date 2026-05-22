# hardhat-observer

Realtime event monitor and transaction logger for Hardhat projects.

Designed to simplify debugging, monitoring and observability during smart contract development.

---

# Features

* Realtime contract event monitoring
* Automatic ABI decoding
* Multi-contract support
* Transaction event inspection
* Automatic contract registration via ENV
* Generic event rendering
* Compatible with ethers v5
* Works with local Hardhat node

---

# Installation

```bash
npm install
```

or

```bash
yarn
```

---

# Start Hardhat Node

```bash
npx hardhat node
```

---

# Deploy Contracts

Example:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

# Environment Convention

The monitor automatically discovers contracts using ENV variables.

Example:

```env
ADDR_LG_USDT=0x...
ABI_LG_USDT=MockERC20

ADDR_LG_DAI=0x...
ABI_LG_DAI=MockERC20

ADDR_LG_MOCK_DEX=0x...
ABI_LG_MOCK_DEX=MockDex
```

---

# Realtime Monitor

```bash
npx hardhat run backend/logs.js --network localhost
```

Example:

```txt
============================================================
[USDT] Transfer
------------------------------------------------------------
from: 0x0000000000000000000000000000000000000000
to:   0x70997970C51812dc3A010C7d01b50e0d17dc79C8
value: 1000000000
```

---

# Basic Usage

## Create Monitor

```js
const hre = require("hardhat");

const {
    EventMonitor
} = require("./lib/event-monitor");

const monitor =
    new EventMonitor(hre);
```

---

## Automatic Registration

```js
await monitor.autoRegister();
```

---

## Start Monitor

```js
monitor.start();
```

---

# Manual Registration

```js
monitor.register("USDT", usdt);

monitor.register("DAI", dai);

monitor.register("MOCK_DEX", mockDex);
```

---

# Transaction Inspection

Useful for scripts, deploys and tests.

```js
const tx = await contract.transfer(...);

await monitor.inspectTx(tx);
```

---

# Example Architecture

```txt
/scripts
    deploy.js
    tests.js

/backend
    logs.js

/lib
    event-monitor.js
```

---

# Recommended Workflow

## Terminal 1

Run Hardhat node:

```bash
npx hardhat node
```

## Terminal 2

Run monitor:

```bash
npx hardhat run backend/logs.js --network localhost
```

## Terminal 3

Execute tests/scripts:

```bash
npx hardhat run scripts/teste.js --network localhost
```

---

# Supported Event Types

The monitor is ABI-based and works with any contract event.

Examples:

* ERC20 Transfer
* ERC20 Approval
* Custom DEX events
* Lending protocol events
* Generic EVM logs

---

# Current Goals

* Simple
* Generic
* Reusable
* Hardhat-first
* Low configuration
* Fast debugging

---

# Future Improvements

* Transaction grouping
* Address aliases
* Colored logs
* Token metadata formatting
* Event filtering
* File persistence
* Trace support
* Gas metrics
* Multi-network support

---

# License

MIT
