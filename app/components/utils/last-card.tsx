import React from "react";

const LastCard = () => {
  return (
    <div className="relative flex flex-col justify-between gap-2 overflow-hidden rounded-xl border border-[#19242e] p-4">
      <div className="flex w-full items-center justify-between cz-color-16777215 cz-color-15460325">
        <span className="flex items-center gap-1.5 text-sm text-neutral-400 cz-color-12165520 cz-color-15460325">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:rp:"
            data-state="closed"
            className="outline-none cz-color-12165520 cz-color-15460325"
          >
            <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-12165520 cz-color-15460325">
              Net APY
            </span>
          </button>
          <span className="iconify ph--percent cz-color-12165520 cz-color-15460325"></span>
        </span>
        <span className="text-neutral-200 cz-color-15788258 cz-color-15460325">
          +10.39%
        </span>
      </div>
      <div className="flex w-full items-center justify-between cz-color-16777215 cz-color-15460325">
        <span className="flex items-center gap-1.5 text-sm text-neutral-400 cz-color-12165520 cz-color-15460325">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:rq:"
            data-state="closed"
            className="outline-none cz-color-12165520 cz-color-15460325"
          >
            <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-12165520 cz-color-15460325">
              Liq. Price/Offset
            </span>
          </button>
          <span className="iconify ph--align-left cz-color-12165520 cz-color-15460325"></span>
        </span>
        <span className="text-sm text-neutral-200 cz-color-15788258 cz-color-15460325">
          <span
            className="relative inline-flex items-center rounded-sm cz-color-15788258 cz-color-15460325"
            data-num="116.48121021677763"
          >
            <span translate="no" className="cz-color-15788258 cz-color-15460325">
              116.48 USDC
            </span>
          </span>{" "}
          <span className="cz-color-15788258 cz-color-15460325">/</span> 12.39%
        </span>
      </div>
      <div className="flex flex-col gap-3 cz-color-16777215 cz-color-15460325">
        <div className="flex w-full items-center justify-between cz-color-16777215 cz-color-15460325">
          <span className="flex items-center gap-1.5 text-sm text-neutral-400 cz-color-12165520 cz-color-15460325">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:rr:"
              data-state="closed"
              className="outline-none cz-color-12165520 cz-color-15460325"
            >
              <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4 cz-color-12165520 cz-color-15460325">
                Position Health
              </span>
            </button>
            <span className="iconify ph--shield-check cz-color-12165520 cz-color-15460325"></span>
          </span>
          <span className="flex items-center gap-2 text-neutral-200 cz-color-15788258 cz-color-15460325">
            <div className="flex items-center gap-2 cz-color-15788258 cz-color-15460325">
              <span className="text-amber-400 cz-color-47615 cz-color-15460325">
                Risky
              </span>
              <span className="cz-color-15788258 cz-color-15460325">70.09%</span>
            </div>
          </span>
        </div>
        <div className="flex flex-col gap-2 cz-color-16777215 cz-color-15460325">
          {/* <div
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow="70.09097180509262"
            aria-valuetext="70%"
            role="progressbar"
            data-state="loading"
            data-value="70.09097180509262"
            data-max="100"
            className="relative h-1.5 w-full overflow-hidden rounded-xl bg-amber-400/20 cz-color-16777215 cz-color-47615 cz-color-15460325"
          >
            <div
              data-state="loading"
              data-value="70.09097180509262"
              data-max="100"
              className="h-full w-full bg-amber cz-color-16777215 cz-color-47615 cz-color-15460325"
            ></div>
          </div> */}
          <div className="flex items-center justify-between text-xs text-neutral-500 cz-color-9336679 cz-color-15460325">
            <span className="cz-color-9336679 cz-color-15460325">70.09%</span>
            <span className="cz-color-9336679 cz-color-15460325">
              Max: L.T. 80%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastCard;
