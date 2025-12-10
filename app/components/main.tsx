import CardContainer from "./utils/card-container";
import MainTop from "./utils/main-top";

const Main = () => {
  return (
    <div className="w-full max-w-full flex flex-col gap-4 lg:px-2 pt-2 sm:px-1">
      <div className="lg:px-2.5 flex flex-col gap-4 sm:gap-6 sm:px-1">
        <MainTop />
        <CardContainer />
      </div>
    </div>
  );
};

export default Main;
