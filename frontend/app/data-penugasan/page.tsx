import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import PelaksanaTable from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <PelaksanaTable />
      <Footer />
    </>
  );
}
