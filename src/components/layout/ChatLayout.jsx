import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import Sidebar from "./Sidebar.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import ChatList from "../chat/ChatList.jsx";
import ChatWindow from "../chat/ChatWindow.jsx";
import DetailsPanel from "../chat/DetailsPanel.jsx";

export default function ChatLayout() {
  const [showDetails, setShowDetails] = useState(true);
  const { activeChatId, setActiveChatId } = useApp();
  const showChatOnMobile = !!activeChatId;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <Sidebar />

      {/* Chat list: full width on mobile, sidebar width on desktop */}
      <div className={`${showChatOnMobile ? "hidden" : "flex"} h-full w-full flex-col md:flex md:w-80 md:shrink-0`}>
        <ChatList />
      </div>

      {/* Chat window: full screen on mobile when chat selected */}
      <div className={`${showChatOnMobile ? "flex" : "hidden"} h-full w-full flex-1 flex-col md:flex`}>
        <ChatWindow
          onToggleDetails={() => setShowDetails((v) => !v)}
          onBack={() => setActiveChatId(null)}
        />
      </div>

      {showDetails && <DetailsPanel onClose={() => setShowDetails(false)} />}

      <MobileBottomNav />
    </div>
  );
}
