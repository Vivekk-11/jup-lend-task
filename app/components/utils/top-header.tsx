import Link from "next/link";
import { IoIosInformationCircleOutline } from "react-icons/io";

const TopHeader = () => {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-1.5 p-4 ring-1 bg-[#121616] rounded-2xl border border-[#c7f2841a]">
      <h2 className="flex items-center gap-1.5 text-sm text-[#B3D977]">
        <IoIosInformationCircleOutline color="#B3D977" />

        <span>Jupiter Lend: Public Beta Now Live 🥳</span>
      </h2>

      <p className="text-xs text-neutral-200">
        Better for Borrowers, Simpler for Lenders - now with $2m+ in incentives
        and a bunch of new assets. This is just the beginning though, we need
        your feedback to improve: {" "}

        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#B3D977]"
          href="https://feedback.jup.ag/b/lend-feedback"
        >
          feedback.jup.ag
        </Link>
      </p>
    </div>
  );
};

export default TopHeader;
