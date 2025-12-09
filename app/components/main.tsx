import CardContainer from "./utils/card-container";
import FixedButton from "./utils/fixed-button";
import MainTop from "./utils/main-top";

const Main = () => {
  return (
    <div className="w-full max-w-full flex flex-col gap-4 px-2 pt-2">
      <MainTop />
      <CardContainer />
      <FixedButton />
    </div>
  );
};

export default Main;
