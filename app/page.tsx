import Header from "./components/header";
import Main from "./components/main";
import FixedButton from "./components/utils/fixed-button";
import TopHeader from "./components/utils/top-header";

export default function Home() {
  return (
    <main className="lg:h-screen bg-[#0b0e13] flex flex-col gap-y-5">
      <Header />
      <div className="py-5 px-2.5 flex flex-col gap-y-5">
        <TopHeader />
        <Main />
      </div>
      <FixedButton />
    </main>
  );
}
