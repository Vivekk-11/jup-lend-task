import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";

const MainTop = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-4">
          <FaAngleLeft color="white" />
          <div className="flex items-center -space-x-4">
            <Image
              src="https://cdn.instadapp.io/icons/jupiter/tokens/sol.png"
              height={32}
              width={32}
              alt="Wrapped Sol"
              className="z-10 size-9 object-cover"
            />
            <Image
              src="https://cdn.instadapp.io/icons/jupiter/tokens/usdc.png"
              height={32}
              width={32}
              alt="USD coin"
              className="z-10 size-9 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xl">
              <h2 className="text-xl font-semibold text-neutral-200 sm:text-2xl">
                SOL/USDC
              </h2>
              <span className="text-sm text-neutral-500 sm:text-base">#1</span>
            </div>
            <span className="text-xs text-neutral-500">
              Supply SOL to Borrow USDC
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="outline-none flex size-7 items-center justify-center rounded-full border border-neutral-800 text-neutral-400">
            <CiGlobe />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-neutral-850 p-4 lg:ml-auto lg:justify-normal lg:gap-8 lg:border-0 lg:p-0 cz-color-16777215 cz-color-3023897">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3 cz-color-16777215 cz-color-15460325">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:ri:"
            data-state="closed"
            className="outline-none cz-color-16777215 cz-color-15460325"
          >
            <span className="text-xs text-neutral-500 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-9336679 cz-color-15460325">
              LTV
            </span>
          </button>
          <span className="font-semibold text-neutral-200 cz-color-15788258 cz-color-15460325">
            75%
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3 cz-color-16777215 cz-color-15460325">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:rj:"
            data-state="closed"
            className="outline-none cz-color-16777215 cz-color-15460325"
          >
            <span className="text-xs text-neutral-500 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-9336679 cz-color-15460325">
              Liq. Threshold
            </span>
          </button>
          <span className="font-semibold text-neutral-200 cz-color-15788258 cz-color-15460325">
            80%
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 lg:flex-row lg:items-center lg:gap-3 cz-color-16777215 cz-color-15460325">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:rk:"
            data-state="closed"
            className="outline-none cz-color-16777215 cz-color-15460325"
          >
            <span className="text-xs text-neutral-500 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-9336679 cz-color-15460325">
              Liq. Penalty
            </span>
          </button>
          <span className="font-semibold text-neutral-200 cz-color-15788258 cz-color-15460325">
            1%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainTop;
