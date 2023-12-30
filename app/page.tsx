"use client"
import ConnectButton from "./ConnectButton"
import { useEffect, useState } from "react";
import { FaRedo } from 'react-icons/fa';
import { getTickBalance, getAccountBalance } from "./actions";
import { InscriptionVO } from "./models";
import InscriptionInfo from "./InscriptionInfo";

import {
    useAccount,
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
} from 'wagmi'
import { parseEther } from 'viem'

interface RecipientList {
    [key: string]: number;
}

export default function Home() {
    const { address, isConnected } = useAccount()
    const [walletAddress, setWalletAddress] = useState('');
    // const [tickHash, setTickHash] = useState('0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2');
    const [tickHash, setTickHash] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0);
    const [balance, setBalance] = useState<InscriptionVO>();
    // const [recipients, setRecipients] = useState('0xb7633Eff55cCF5B6E8515819477beeBEf66a1C33 1');
    const [recipients, setRecipients] = useState('');
    const [recipientList, setRecipientList] = useState<RecipientList>();
    const [totalAmount, setTotalAmount] = useState(0);
    const [remainAmount, setRemainAmount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [balances, setBalances] = useState<InscriptionVO[]>([])

    const [dataUri, setDataUri] = useState('');
    const { config } = usePrepareSendTransaction({
        data: `0x${Buffer.from(dataUri).toString('hex')}`,
        to: address,
        value: parseEther("0"),
    })
    const { data, sendTransaction } = useSendTransaction(config)
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        setWalletAddress(address || '');
        const updateBalances = async () => {
            const balances = await getAccountBalance(address || '');
            const inscriptionVOs = balances.map(item => new InscriptionVO(item));
            setBalances(inscriptionVOs);
        }
        updateBalances()
    }, [address, isConnected])

    useEffect(() => {
        const updateViews = async () => {
            const balance = await getTickBalance(address?.toString() || '', tickHash?.toString());
            console.log("balance", balance);
            setBalance(balance ? new InscriptionVO(balance) : undefined);
        }
        updateViews()
    }, [tickHash, walletAddress, forceUpdate])

    useEffect(() => {
        const recipientList: RecipientList = recipients.split('\n').reduce((obj: RecipientList, item) => {
            const [recipient, amount] = item.trim().split(/[\s,=]+/);
            const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient);
            const minAmount = 10 ** (0 - Number(balance?.decimals) ?? 0);
            const isValidNumber = !isNaN(Number(amount)) && Number(amount) >= minAmount;
            if (isValidAddress && isValidNumber) {
                obj[recipient] = Number(amount);
            }
            return obj;
        }, {});
        const totalAmount = Object.values(recipientList).reduce((sum, amount) => sum + amount, 0);
        setRecipientList(recipientList);
        setTotalAmount(totalAmount);
        if (balance && balance.id && totalAmount > 0) {
            console.log("balance", balance?.getDisplayBalance(), Number(balance?.getDisplayBalance()));
            const remainAmount = Number(balance?.getDisplayBalance()) - totalAmount;
            setRemainAmount(remainAmount);
            if (remainAmount >= 0) {
                const transfers = [];
                for (const [address, amount] of Object.entries(recipientList)) {
                    const op = {
                        p: 'bnb-48',
                        op: "transfer",
                        'tick-hash': tickHash,
                        to: address,
                        amt: (amount * 10 ** (balance.decimals ?? 0)).toString(),
                    };
                    transfers.push(op);
                }
                const dataUri = `data:,${JSON.stringify(transfers)}`;
                console.log(dataUri);
                setDataUri(dataUri);
            } else {
                setDataUri('');
            }
        }
    }, [recipients, balance])

    return (
        <div className='m-8 mb-16'>
            <div className="relative">
                <h1 className='mt-12 mb-8 text-2xl'>Insperse<sup className="text-sm ml-2">bnb-48</sup></h1>
            </div>
            <p>
                <i>verb</i> distribute inscriptions to multiple addresses.
            </p>
            <h2 className='mt-8 mb-4 text-xl'><i>connect to wallet</i></h2>
            {!walletAddress && <>
                <ConnectButton />
                <div className="my-4">please unlock metamask</div>
            </>}
            {walletAddress && (
                <>
                    <div className="my-4">logged in as {walletAddress}</div>
                    <h3 className="mt-8 mb-4 text-xl"><i>tick hash</i></h3>
                    <div className="relative flex flex-col w-full">
                        <input type="text" className='w-full bg-transparent border border-gray-400 rounded-sm p-2 mr-4'
                            value={tickHash}
                            onChange={(e) => setTickHash(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 500)}
                            placeholder="Input Tick Hash" />
                        {showDropdown && balances && balances.length > 0 && (
                            <div className="absolute top-10 left-0 mt-2 w-full border border-gray-400 rounded-sm p-2 z-10 max-h-60 overflow-auto theme-bg">
                                {balances.map(balance => (
                                    <div key={balance.tickHash} className="cursor-pointer hover:bg-gray-300 p-2" onClick={() => {
                                        setTickHash(balance.tickHash);
                                        setShowDropdown(false);
                                    }}>
                                        <InscriptionInfo ins={balance} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {balance && balance.id && (
                        <>
                            <div className="my-4 flex items-center">
                                <span>you have {balance.getDisplayBalance()} {balance.tick}</span>
                                <FaRedo className="cursor-pointer ml-2 text-gray-600" onClick={() => setForceUpdate(forceUpdate + 1)} />
                            </div>
                            {balance && Number(balance.balance) > 0 && (
                                <>
                                    <h3 className="mt-8 mb-4 text-xl"><i>recipients and amounts</i></h3>
                                    <p>enter one address and amount in {balance.tick} on each line. supports any format.</p>
                                    <textarea className='w-full bg-transparent border border-gray-400 rounded-sm p-2 mt-4 mb-4' rows={5}
                                        placeholder="0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592
                                                            0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.71828
                                                            0x141ca95b6177615fb1417cf70e930e102bf8f584=1.41421"
                                        value={recipients}
                                        onChange={(e) => setRecipients(e.target.value)}
                                    />
                                    {recipientList && Object.keys(recipientList).length > 0 && (
                                        <>
                                            <h3 className="mt-8 mb-4 text-xl"><i>confirm</i></h3>
                                            <div className="flex mb-2">
                                                <div className="flex-grow p-1 mr-2"><i>address</i></div>
                                                <div className="p-1 rounded-sm"><i>amount</i></div>
                                            </div>
                                            {Object.entries(recipientList).map(([address, amount]) => (
                                                <div className="flex mb-2" key={address}>
                                                    <div className="flex-grow mr-2 p-1 rounded-sm">{address}</div>
                                                    <div className="p-1 rounded-sm">{amount.toString()} {balance.tick}</div>
                                                </div>
                                            ))}
                                            <div className="flex mb-2">
                                                <div className="flex-grow p-1 mr-2"><i>total</i></div>
                                                <div className="p-1 rounded-sm"><i>{totalAmount.toString()} {balance.tick}</i></div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="flex-grow p-1 mr-2"><i>your balance</i></div>
                                                <div className="p-1 rounded-sm"><i>{balance.getDisplayBalance()} {balance.tick}</i></div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="flex-grow p-1 mr-2"><i>remaining</i></div>
                                                <div className="p-1 rounded-sm"><i>{remainAmount.toString()} {balance.tick}</i></div>
                                            </div>
                                            <button className="mt-4 py-2 px-4 bg-gray-700 text-white rounded-sm"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    sendTransaction?.()
                                                }} disabled={isLoading || !sendTransaction || !dataUri || remainAmount <0}>
                                                <div className="flex items-center">
                                                    <span>{isLoading ? 'Sending...' : 'Send Inscriptions'}</span>
                                                </div>
                                            </button>
                                            {isSuccess && (
                                                <div className="mt-4">
                                                    Successfully sent!
                                                    <div>
                                                        View on <a href={`https://bscscan.com/tx/${data?.hash}`} className="underline">BscScan</a>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}