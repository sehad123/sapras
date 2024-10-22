import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import PeminjamanList from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <PeminjamanList />
      <Footer />
    </>
  );
}
