import type { Metadata } from 'next'
import { Web3Modal } from "../context/Web3Modal";
import './globals.css'

export const metadata: Metadata = {
    title: 'Insperse',
    description: 'distribute bnb-48 inscriptions to multiple addresses.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="flex items-center justify-center">
                <div className="max-w-2xl flex-1 min-h-screen">
                    <Web3Modal>{children}</Web3Modal>
                </div>
            </body>
        </html>
    )
}
