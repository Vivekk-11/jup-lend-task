import Card from "./card";
import LastCard from "./last-card";

const CardContainer = () => {
  return (
    <div className="grid gap-5 lg:grid-cols-3 sm:grid-cols-2">
      <Card
        title="Supplied Collateral"
        tokenSymbol="SOL"
        tokenAmount={0.09412254}
        tokenAmountFormatted="0.094122"
        usdValue={12.49}
        usdValueFormatted="$12.49"
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/sol.png"
        tokenName="Wrapped SOL"
        apyFormatted="6.3%"
        type="collateral"
      />

      <Card
        title="Borrowed Debt"
        tokenSymbol="USDC"
        tokenAmount={8.7708}
        tokenAmountFormatted="8.7708"
        usdValue={8.7701}
        usdValueFormatted="$8.7701"
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/usdc.png"
        tokenName="USD Coin"
        apyFormatted="4.6%"
        type="debt"
      />

      <LastCard />
    </div>
  );
};

export default CardContainer;
