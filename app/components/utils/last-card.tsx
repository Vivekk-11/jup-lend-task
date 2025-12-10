interface LastCardProps {
  suppliedAmount: number;
  suppliedToken: string;
  suppliedAPY: number;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedAPY: number;
  solPrice?: number;
}

const LastCard = ({
  suppliedAmount,
  suppliedAPY,
  borrowedAmount,
  borrowedToken,
  borrowedAPY,
  solPrice = 132,
}: LastCardProps) => {
  const LIQUIDATION_THRESHOLD = 0.8;

  const collateralValue = suppliedAmount * solPrice;
  const netAPY =
    suppliedAPY - (borrowedAPY * borrowedAmount) / collateralValue || 0;

  const liquidationPrice =
    suppliedAmount > 0
      ? borrowedAmount / (suppliedAmount * LIQUIDATION_THRESHOLD)
      : 0;

  const offsetPercentage =
    liquidationPrice > 0 ? ((solPrice - liquidationPrice) / solPrice) * 100 : 0;

  const healthPercentage =
    collateralValue > 0
      ? Math.min((borrowedAmount / collateralValue) * 100, 100)
      : 0;

  const getRiskStatus = () => {
    if (healthPercentage >= 80)
      return {
        text: "Liquidated",
        color: "text-red-500",
        bgColor: "bg-red-400/20",
        barColor: "bg-red-500",
      };
    if (healthPercentage >= 60)
      return {
        text: "Risky",
        color: "text-amber-400",
        bgColor: "bg-amber-400/20",
        barColor: "bg-amber-400",
      };
    if (healthPercentage >= 30)
      return {
        text: "Moderate",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20",
        barColor: "bg-yellow-400",
      };
    return {
      text: "Safe",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/20",
      barColor: "bg-emerald-500",
    };
  };

  const riskStatus = getRiskStatus();

  return (
    <div className="relative flex flex-col justify-between gap-2 overflow-hidden rounded-xl border border-[#19242e] p-4">
      {/* Net APY */}
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-neutral-400 sm:text-[10px]">
          <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4">
            Net APY
          </span>
          <span className="text-xs">%</span>
        </span>
        <span
          className={`text-neutral-200 ${
            netAPY >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {netAPY >= 0 ? "+" : ""}
          {netAPY.toFixed(2)}%
        </span>
      </div>

      {/* Liq. Price/Offset */}
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-neutral-400 sm:text-[10px]">
          <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4">
            Liq. Price/Offset
          </span>
        </span>
        <span className="text-sm text-neutral-200 sm:text-[10px]">
          <span className="relative inline-flex items-center rounded-sm">
            <span translate="no">
              {liquidationPrice.toFixed(2)} {borrowedToken}
            </span>
          </span>{" "}
          <span>/</span> {offsetPercentage.toFixed(2)}%
        </span>
      </div>

      {/* Position Health */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-neutral-400 sm:text-[10px]">
            <span className="text-neutral-400 underline decoration-neutral-600 decoration-dashed decoration-from-font underline-offset-4">
              Position Health
            </span>
          </span>
          <span className="flex items-center gap-2 text-neutral-200 sm:text-[10px]">
            <div className="flex items-center gap-2">
              <span className={riskStatus.color}>{riskStatus.text}</span>
              <span>{healthPercentage.toFixed(2)}%</span>
            </div>
          </span>
        </div>

        {/* Health Progress Bar */}
        <div className="flex flex-col gap-2">
          <div
            role="progressbar"
            aria-valuenow={healthPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`relative h-1.5 w-full overflow-hidden rounded-xl ${riskStatus.bgColor}`}
          >
            <div
              className={`h-full transition-all duration-300 ${riskStatus.barColor}`}
              style={{ width: `${Math.min(healthPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{healthPercentage.toFixed(2)}%</span>
            <span>Max: L.T. {(LIQUIDATION_THRESHOLD * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastCard;
