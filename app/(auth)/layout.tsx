import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import '../globals.css';

export const metadata = {
    title: 'Svitlo',
    description: 'A Next.js 13 Svitlo Aplication'
}

const inter = Inter({subsets:['latin']});

export default function RootLayout( 
    {children}: {
        children: React.ReactNode
    }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={' ${inter.className} bg-gradient-to-br from-primary-experimental to-secondary-experimental'}>
                    <div className="w-full flex flex-col justify-center items-center min-h-screen">
                        <h1 className="mb-2 text-heading1-bold text-primary-experimental">Svitlo</h1>
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}