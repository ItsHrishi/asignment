import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"

function Layout() {
  return (
    <div className="h-screen">
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout