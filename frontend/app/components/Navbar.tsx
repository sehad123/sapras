"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard, faTable, faUsers, faClipboardList, faUserCircle, faHandHolding, faExclamationTriangle, faHistory } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link"; // Import Link from Next.js
import { usePathname, useRouter } from "next/navigation"; // Use both useRouter and usePathname for routing and checking current route

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "", email: "" }); // State to store user data
  const [pendingCount, setPendingCount] = useState(0); // State untuk menyimpan jumlah peminjaman pending

  const router = useRouter(); // Use Next.js router for navigation
  const pathname = usePathname(); // Get current route for active menu highlighting

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Fetch jumlah peminjaman pending
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/peminjaman/count/pending");
        const data = await response.json();
        setPendingCount(data.pendingCount); // Set jumlah peminjaman pending
      } catch (error) {
        console.error("Error fetching pending count:", error);
      }
    };

    fetchPendingCount(); // Panggil saat komponen pertama kali dirender

    // Fetch user data from localStorage (or any other storage method)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set user data from storage
    } else {
      // If no user is found, redirect to login page
      router.push("/login");
    }
  }, [router]); // Include router in the dependency array

  // Logout function
  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("user");
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="bg-gray-100 h-[100px]">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        {/* HALO BAU - clickable and redirects to home */}
        <div onClick={() => router.push("/")} className="text-white font-bold text-lg cursor-pointer hover:text-gray-300">
          HALO BAU
        </div>

        {/* Navigation Menu */}
        <nav className="flex space-x-6">
          {user.role === "Admin" ? (
            <>
              {/* Admin-only menus */}
              <Link href="/data-barang" className={`${pathname === "/data-barang" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Data Barang
              </Link>

              <Link href="/data-peminjaman" className={`${pathname === "/data-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Peminjaman
                {/* Badge angka kecil merah untuk status pending */}
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
              </Link>

              <Link href="/riwayat-pengaduan" className={`${pathname === "/riwayat-pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Pengaduan
              </Link>
            </>
          )}

          {/* User Icon with dropdown */}
          <div className="relative">
            <button onClick={toggleUserMenu} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-full">
              <FontAwesomeIcon icon={faUserCircle} />
            </button>

            {/* Dropdown menu for user information */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="px-4 py-2 text-gray-700">
                  {/* <div className="font-bold">Nama : {user.name || "User"}</div> */}
                  <div className="font-bold py-1"> {user.email || "Email"}</div>
                  <div className="text-sm font-bold text-gray-500">{user.role || "Role"}</div>
                </div>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 text-gray-700 hover:bg-gray-100">
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
