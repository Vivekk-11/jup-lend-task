"use client"

import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="px-2.5 flex items-center justify-between h-[50px] border-b border-[#19242e]">
      <Link className="flex h-9 items-center pr-1.5 xs:pr-2 sm:pr-2.5" href="/">
        <Image
          alt="Jupiter"
          loading="lazy"
          width="22"
          height="22"
          decoding="async"
          src="/jupiter-logo.webp"
        />
        <div className="relative ml-2.5 text-sm font-semibold text-neutral-100 max-[1550px]:hidden">
          Jupiter
        </div>
      </Link>

      {/* TODO: might change the UI of the wallet integration! */}

      {/* <button
        type="button"
        className="cursor-pointer flex h-8 min-w-8 items-center justify-center rounded-full border border-transparent focus-visible:outline focus-visible:outline-primary md:h-9 md:min-w-9 bg-[#c7f2841a] px-3 text-xs font-semibold text-[#c7f284] hover:border-[#c7f284] hover:bg-[#c7f2841a] hover:text-[#c7f284]"
      >
        Connect
      </button> */}

      <UnifiedWalletButton />
    </div>
  );
};

export default Header;
