const chalk = require("chalk");

class EventMonitor {

    constructor(hre) {

        this.hre = hre;

        this.provider =
            hre.ethers.provider;

        this.contracts = {};
    }

    //
    // REGISTER CONTRACT
    //
    register(name, contract) {

        this.contracts[
            contract.address.toLowerCase()
        ] = {
            name,
            contract
        };

        console.log(
            chalk.green("✔ Registered:"),
            chalk.cyan(name),
            chalk.gray(
                this.short(contract.address)
            )
        );
    }

    //
    // AUTO REGISTER
    //
    async autoRegister() {

        const env = process.env;

        console.log(
            chalk.yellow(
                "\n🔍 Auto registering contracts...\n"
            )
        );

        for (const key of Object.keys(env)) {

            if (!key.startsWith("ADDR_LG_")) {
                continue;
            }

            const name =
                key.replace("ADDR_LG_", "");

            const address = env[key];

            const artifact =
                env[`ABI_LG_${name}`];

            if (!artifact) {

                console.log(
                    chalk.red(
                        `✖ Missing ABI_LG_${name}`
                    )
                );

                continue;
            }

            try {

                const contract =
                    await this.hre.ethers.getContractAt(
                        artifact,
                        address
                    );

                this.register(
                    name,
                    contract
                );

            } catch (e) {

                console.log(
                    chalk.red(
                        `✖ Failed to register ${name}`
                    )
                );
            }
        }
    }

    //
    // START MONITOR
    //
    start() {

        const addresses =
            Object.keys(this.contracts);

        console.log(
            chalk.yellow(
                "\n📡 Monitoring events...\n"
            )
        );

        for (const address of addresses) {

            this.provider.on(
                {
                    address
                },
                async (log) => {

                    await this.handleLog(log);
                }
            );

            console.log(
                chalk.gray(
                    `Listening: ${this.short(address)}`
                )
            );
        }
    }

    //
    // HANDLE LOG
    //
    async handleLog(log) {

        const item =
            this.contracts[
                log.address.toLowerCase()
            ];

        if (!item) return;

        try {

            const parsed =
                item.contract.interface.parseLog(log);

            this.print(
                item.name,
                parsed,
                log
            );

        } catch (e) {

            console.log(
                chalk.red(
                    "\n[UNKNOWN EVENT]"
                )
            );
        }
    }

    //
    // PRINT EVENT
    //
    print(contractName, parsed, log = {}) {

        console.log(
            "\n" +
            chalk.gray(
                "━".repeat(60)
            )
        );

        console.log(
            chalk.cyan(`[${contractName}]`) +
            " " +
            chalk.yellow(parsed.name)
        );

        console.log(
            chalk.gray(
                "━".repeat(60)
            )
        );

        for (const [key, value]
            of Object.entries(parsed.args)) {

            if (!isNaN(key)) continue;

            console.log(
                chalk.gray(`${key}:`) +
                " " +
                chalk.green(
                    this.format(value)
                )
            );
        }

        if (log.transactionHash) {

            console.log(
                chalk.dim(
                    `tx: ${this.short(log.transactionHash)}`
                )
            );
        }

        if (log.blockNumber) {

            console.log(
                chalk.dim(
                    `block: ${log.blockNumber}`
                )
            );
        }
    }

    //
    // INSPECT TX
    //
    async inspectTx(tx) {

        const receipt = await tx.wait();

        console.log(
            chalk.yellow(
                "\n=== TRANSACTION EVENTS ==="
            )
        );

        for (const event of receipt.events || []) {

            const item =
                this.contracts[
                    event.address?.toLowerCase()
                ];

            const contractName =
                item?.name || "UNKNOWN";

            this.print(
                contractName,
                {
                    name: event.event,
                    args: event.args
                },
                {
                    transactionHash:
                        receipt.transactionHash,

                    blockNumber:
                        receipt.blockNumber
                }
            );
        }
    }

    //
    // FORMAT VALUE
    //
    format(value) {

        if (value?._isBigNumber) {
            return value.toString();
        }

        if (
            typeof value === "string" &&
            value.startsWith("0x")
        ) {
            return this.short(value);
        }

        return value;
    }

    //
    // SHORT HASH/ADDRESS
    //
    short(value) {

        if (
            typeof value !== "string" ||
            !value.startsWith("0x")
        ) {
            return value;
        }

        return (
            value.slice(0, 6) +
            "..." +
            value.slice(-4)
        );
    }
}

module.exports = {
    EventMonitor
};