import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import {
    Home,
    Store,
    Box,
    Book,
    Tag,
    FileText,
    File,
    Settings,
    ChevronRight,
    LucideProps,
} from "lucide-react";
import logo from "./../assets/logo.png";
import profileImage from "./../assets/profile-image.jpeg";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

    const sidebarItems = [
        { name: "Home", icon: Home, path: "/" },
        { name: "Stores", icon: Store, path: "/store" },
        { name: "Products", icon: Box, path: "/products" },
        { name: "Catalogue", icon: Book, path: "/catalogue" },
        { name: "Promotions", icon: Tag, path: "/promotion" },
        { name: "Reports", icon: FileText, path: "/report" },
        { name: "Docs", icon: File, path: "/docs" },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    console.log("render check : ")
    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = sidebarItems.find((item) => item.path === currentPath);
        setActiveTab(activeItem?.name);
    }, [location.pathname]);

    const handleNavigation = (item: { name: any; icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; path: any; }) => {
        setActiveTab(item.name);
        navigate(item.path);
    };

    return (
        <div className="md:w-64 bg-white h-screen border-r w-20">
            <div className="h-full flex flex-col md:px-4 px-2">
                {/* main content */}
                <div className="flex-grow">
                    <div className="my-4 flex">
                        <img
                            className="h-12 w-auto rounded-md object-contain"
                            src={logo}
                            alt="Logo"
                        />
                    </div>

                    <nav className="mt-4 pt-4 border-t">
                        {sidebarItems.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => handleNavigation(item)}
                                className={`flex items-center px-4 py-3 cursor-pointer font-light transition-all duration-200
                                    ${activeTab === item.name
                                        ? "bg-blue-50 text-primaryBlue"
                                        : "text-gray-950 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <item.icon className="md:w-5 md:h-5 w-6 h-6" />
                                <p className="md:text-sm md:ml-3 hidden md:block">{item.name}</p>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* user profile*/}
                <div className="py-4 border-t mt-auto">
                    <div className="flex items-center">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="ml-3 min-w-0 flex-1 hidden md:block">
                            <div className="text-sm font-medium truncate">Andy Samberg</div>
                            <div className="text-xs text-gray-500 truncate">
                                andy.samberg@gmail.com
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto text-gray-400 hover:text-blue-600 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

{/* <img
    className="h-12 w-auto rounded-md object-contain"
    src={logo}
    alt="Logo"
/>

  <img
                            src={profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full flex-shrink-0"
                        /> */}