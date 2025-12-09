import Header from "./components/header";
import Main from "./components/main";
import TopHeader from "./components/utils/top-header";

export default function Home() {
  return (
    <main className="h-screen bg-[#0b0e13] py-5 px-2.5 flex flex-col gap-y-5">
      <Header />
      <TopHeader />
      <Main />
    </main>
  );
}
