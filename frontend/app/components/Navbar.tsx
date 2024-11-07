"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard, faTable, faUsers, faClipboardList, faUserCircle, faHandHolding, faExclamationTriangle, faHistory } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar({ userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "", email: "", id: "" });
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Fetch counts for pending, approved, and rejected peminjaman
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pendingResponse = await fetch("http://localhost:5000/api/peminjaman/count/pending");
        const pendingData = await pendingResponse.json();
        setPendingCount(pendingData.pendingCount);

        const approvedResponse = await fetch(`http://localhost:5000/api/peminjaman/count/approved/${userId}`);
        const approvedData = await approvedResponse.json();
        setApprovedCount(approvedData.approvedCount);

        const rejectedResponse = await fetch(`http://localhost:5000/api/peminjaman/count/rejected/${userId}`);
        const rejectedData = await rejectedResponse.json();
        setRejectedCount(rejectedData.rejectedCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/login");
    }
  }, [router, userId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="bg-gray-100 h-[100px]">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        <div onClick={() => router.push("/")} className="text-white font-bold text-lg cursor-pointer hover:text-gray-300">
          HALO BAU
        </div>

        <nav className="flex space-x-6">
          {user.role === "Admin" ? (
            <>
              {/* Admin menus */}
              <Link href="/data-barang" className={`${pathname === "/data-barang" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Data Barang
              </Link>

              <Link href="/data-peminjaman" className={`${pathname === "/data-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Peminjaman
                {pendingCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
              </Link>

              <Link href="/data-pengaduan" className={`${pathname === "/data-pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Pengaduan
              </Link>
              <Link href="/data-pegawai" className={`${pathname === "/data-pegawai" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Data Pengguna
              </Link>
            </>
          ) : (
            <>
              {/* Non-admin menus */}
              <Link href="/peminjaman" className={`${pathname === "/peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHandHolding} className="mr-2" />
                Peminjaman
              </Link>

              <Link href="/pengaduan" className={`${pathname === "/pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                Pengaduan
              </Link>

              <Link href="/riwayat-peminjaman" className={`${pathname === "/riwayat-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Peminjaman
                {/* <span className={`ml-2 text-sm font-bold ${approvedCount > 0 ? "text-green-500" : "text-gray-300"}`}>{approvedCount > 0 ? approvedCount : 0}</span> */}
                {/* <span className={`ml-2 text-sm font-bold ${rejectedCount > 0 ? "text-red-500" : "text-gray-300"}`}>{rejectedCount > 0 ? rejectedCount : 0}</span> */}
              </Link>

              <Link href="/riwayat-pengaduan" className={`${pathname === "/riwayat-pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Pengaduan
              </Link>
            </>
          )}

          <div className="relative">
            <button onClick={toggleUserMenu} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-full">
              <FontAwesomeIcon icon={faUserCircle} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="px-4 py-2 text-gray-700">
                  <div className="font-bold py-1">{user.email || "Email"}</div>
                  <div className="text-sm font-bold text-gray-500">{user.role || "Role"}</div>
                </div>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
