"use server";
import { InscriptionModel } from "./models";

type GetAccountBalance = (address: string) => Promise<InscriptionModel[]>;
type GetTickBalance = (address: string, tick_hash?: string) => Promise<InscriptionModel>;

export const getAccountBalance: GetAccountBalance = async (address) => {
    if (!address) {
        return [];
    }

    const formData = new FormData();
    formData.append('address', address);

    const res = await fetch(`https://inscription.48.club/bnb48_index/v1/account/balance`, {
        method: 'POST',
        body: formData,
        next: { revalidate: 5 }
    });
    
    const data = await res.json();
    console.log('getAccountBalance:', address, JSON.stringify(data));
    return data.data ? data.data.wallet : [];
}

export const getTickBalance: GetTickBalance = async (address, tick_hash) => {
    if (!address || !tick_hash) {
        return {};
    }
    const res = await fetch(`https://inscription.48.club/bnb48_index/v1/account/balance`, {
        method: 'POST',
        body: JSON.stringify({ address, tick_hash: [tick_hash] }),
        headers: {
            'Content-Type': 'application/json'
        },
        next: { revalidate: 10 }
    });
    const data = await res.json();
    console.log('getTickBalance:', JSON.stringify(data));
    return data.data ? data.data.wallet[0] : [];
}

export const getInscriptionByTickHash = async ({ tick_hash }: { tick_hash: string }): Promise<InscriptionModel> => {
    const res = await fetch(`https://inscription.48.club/bnb48_index/v1/inscription/list`, {
        method: 'POST',
        body: JSON.stringify({ tick_hash, page: 0, page_size: 1 }),
        headers: {
            'Content-Type': 'application/json'
        },
        next: { revalidate: 30 }
    });
    const data = await res.json();
    console.log('getInscriptionByTickHash:', JSON.stringify(data));
    return data.data ? data.data.list[0] : undefined;
}

export const getInscriptionListByStatus = async ({ status, page, page_size }:
    { status: number, page: number, page_size: number }): Promise<InscriptionModel[]> => {
    const res = await fetch(`https://inscription.48.club/bnb48_index/v1/inscription/list`, {
        method: 'POST',
        body: JSON.stringify({ status, page, page_size }),
        headers: {
            'Content-Type': 'application/json'
        },
        next: { revalidate: 30 }
    });
    const data = await res.json();
    console.log('getInscriptionListByStatus:', JSON.stringify(data));
    return data.data ? data.data.list : [];
}
