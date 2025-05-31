
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  User, 
  ClipboardList,
  Briefcase
} from "lucide-react";

export function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t bg-white p-3 shadow-lg z-50">
      <button 
        onClick={() => navigate("/")}
        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all transform hover:scale-105 ${
          isActive("/") 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600"
        }`}
      >
        <ShoppingBag className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">BuyForMe</span>
      </button>
      
      <button 
        onClick={() => navigate("/makeforme")} 
        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all transform hover:scale-105 ${
          isActive("/makeforme") 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600"
        }`}
      >
        <Briefcase className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">MakeForMe</span>
      </button>
      
      <button 
        onClick={() => navigate("/orders")}
        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all transform hover:scale-105 ${
          isActive("/orders") 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600"
        }`}
      >
        <ClipboardList className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">Pedidos</span>
      </button>
      
      <button 
        onClick={() => navigate("/account")}
        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all transform hover:scale-105 ${
          isActive("/account") 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600"
        }`}
      >
        <div className="w-5 h-5 mb-1 bg-gray-400 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-medium">Conta</span>
      </button>
    </div>
  );
}
