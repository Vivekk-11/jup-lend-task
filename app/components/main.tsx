import CardContainer from "./utils/card-container";
import MainTop from "./utils/main-top";

const Main = () => {
  return (
    <div className="w-full max-w-full flex flex-col gap-4 px-2 pt-2">
      <div className="px-2.5 flex flex-col gap-4 sm:gap-6">
        <MainTop />
        <CardContainer />
      </div>
    </div>
  );
};

export default Main;
