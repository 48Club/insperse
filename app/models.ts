
export type InscriptionModel = {
    id?: number;
    protocol?: string;
    tick: string;
    tick_hash: string;
    balance?: string;
    decimals?: number;
    holders?: number;
    max?: number;
    minted?: number;
    lim?: string;
}

export class InscriptionVO {
    id?: number;
    p?: string;
    tick: string;
    tickHash: string;
    decimals?: number;
    balance?: string;
    holders?: string;
    max?: number;
    minted?: number;
    lim?: string;
    getShortHash: () => string;
    getDisplayBalance: () => string;
    getProgress: () => number;

    constructor({ id, protocol, tick, tick_hash, balance, decimals, holders, max, minted, lim }: InscriptionModel) {
        this.id = id;
        this.p = protocol;
        this.tick = tick;
        this.tickHash = tick_hash;
        this.balance = balance;
        this.decimals = decimals;
        this.holders = holders === 0 ? "-" : holders?.toString();
        this.max = max;
        this.minted = minted;
        this.lim = lim;

        this.getDisplayBalance = (): string => {
            return (Number(this.balance) / Math.pow(10, this.decimals || 0)).toString();
        }

        this.getShortHash = (): string => {
            return this.tickHash.slice(0, 6) + '...' + this.tickHash.slice(-4);
        }

        this.getProgress = (): number => {
            return Number((Number(this.minted) / Number(this.max) * 100).toFixed(2));
        }
    }
}
