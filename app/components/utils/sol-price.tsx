import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchSolPrice } from "@/lib/fetch-oracle-price";
import Link from "next/link";
import { CiGlobe } from "react-icons/ci";
import { FaExternalLinkAlt } from "react-icons/fa";

export async function SolPrice() {

  const price = await fetchSolPrice();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="cursor-pointer bg-none! px-0! py-0!">
          <span className="outline-none flex size-7 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 hover:text-[#c7f284] hover:border-[#c7f284]">
            <CiGlobe />
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#0d151e]! width-[350px]!">
        <div className="flex flex-col w-[350px]">
          <h2 className="flex items-center gap-2 border-b border-neutral-800 p-4 pb-2 text-sm">
            Oracle
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://solscan.io/account/6QBKbRU6bgjDxLeP8XwZmrikkRR5v913b7xwLPVoeNQ5"
              className="flex items-center gap-1.5 text-[#c7f284]"
            >
              <span className="whitespace-nowrap" translate="no">
                6QBK…eNQ5
              </span>
              <FaExternalLinkAlt color="#c7f284" />
            </Link>
          </h2>
          <div className="flex flex-col gap-2 border-b border-neutral-800 p-4 pt-2 text-sm">
            <h2>Feeds</h2>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Pyth</span>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://solscan.io/account/7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE"
                className="flex items-center gap-1.5 text-xs text-[#c7f284]"
              >
                <span className="whitespace-nowrap" translate="no">
                  7UVi…jLiE
                </span>
                <FaExternalLinkAlt color="#c7f284" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 pt-2 text-sm">
            <h2>Oracle price</h2>
            <span className="text-[#c7f284]">
              1 SOL ={" "}
              <span className="relative inline-flex items-center rounded-sm">
                <span translate="no">{price.toFixed(2)} USDC</span>
              </span>
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
