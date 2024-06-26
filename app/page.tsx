// pages/index.js or any other page
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen text-white flex-col md:flex-row">
      <div
        className="flex flex-1 items-center justify-center bg-cover bg-center hidden md:flex"
        style={{ backgroundImage: 'url(https://zakwallet.netlify.app/assets/media/bg-blank.png)' }}
      >
        <div className="text-center">
          <img src="/assets/logo.svg" alt="E-Wallet Logo" className="mx-auto mb-4 w-1/2" />
        </div>
      </div>
      <div className="flex flex-col w-full md:w-1/2 h-screen md:h-auto">
        <Link href={"/auth/signin"}  className="flex-1 bg-yellow-600 flex items-center justify-center h-1/2 md:h-full">
          
            <div className="text-center">
              <p className="text-2xl font-bold">Platform</p>
              <h1>EWallet User</h1>
            </div>
      
        </Link>
        <Link href={"/auth/signin"} className="flex-1 bg-black flex items-center justify-center h-1/2 md:h-full">
       
            <div className="text-center text-white">
              <p className="text-2xl font-bold">Platform</p>
              <h1>Cobrand</h1>
            </div>
         
        </Link>
      </div>
    </div>
  );
}
