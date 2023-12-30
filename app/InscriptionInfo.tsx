"use client";

import { InscriptionModel, InscriptionVO } from "@/app/models";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface InscriptionInfoProps {
    ins: InscriptionVO;
}

const verifiedTicks = {
    '0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2': {
        icon: 'https://raw.githubusercontent.com/48Club/web3_app/main/public/static/avatar/0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2.png',
    }
}

const InscriptionInfo: React.FC<InscriptionInfoProps> = (props) => {
    const ins = props.ins;
    const verified = verifiedTicks[ins.tickHash as keyof typeof verifiedTicks];
    const icon = verified ? verified.icon || 'https://web3.48.club/assets/avatar-WDhAETOR.svg' : 'https://web3.48.club/assets/avatar-WDhAETOR.svg';
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(ins.tickHash);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy text');
        }
    };

    return (
        <div className="flex items-center">
            <div className="pr-2">
                <Image src={icon} alt="tick icon" className="object-cover rounded-full w-10 h-10" width={40} height={40} quality={100} />
            </div>
            <div className="flex-grow p2 w-24 overflow-hidden overflow-ellipsis whitespace-nowrap">
                <div className="flex items-center">
                    <span className="mr-1">{ins.tick}</span>
                    {verified &&
                        <svg height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g fill="none" fill-rule="evenodd"><path d="M256 472.153L176.892 512l-41.725-81.129-86.275-16.654 11.596-91.422L0 256l60.488-66.795-11.596-91.422 86.275-16.654L176.892 0 256 39.847 335.108 0l41.725 81.129 86.275 16.654-11.596 91.422L512 256l-60.488 66.795 11.596 91.422-86.275 16.654L335.108 512z" fill="#4285f4" /><path d="M211.824 284.5L171 243.678l-36 36 40.824 40.824-.063.062 36 36 .063-.062.062.062 36-36-.062-.062L376.324 192l-36-36z" fill="#fff" /></g></svg>
                    }
                </div>
                <div className="text-sm text-gray-500 mt-1">{ins.getShortHash()}</div>
            </div>
            {ins.balance && (
                <div className="flex-grow p2 text-right ml-4 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    <span>{ins.getDisplayBalance()} {ins.tick}</span>
                </div>
            )}
            {ins.holders && (
                <div className="flex-grow m-2 text-center">
                    <div>{ins.holders}</div>
                    <div className="text-gray-600 text-xs">hodlers</div>
                </div>
            )}
            {ins.minted && (
                <div className="">
                    <div className="text-xs text-right">{ins.getProgress()}%</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div style={{ width: `${ins.getProgress()}%` }} className="h-full bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default InscriptionInfo;