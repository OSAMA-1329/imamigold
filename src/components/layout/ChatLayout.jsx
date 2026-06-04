import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import ChatList from "../chat/ChatList.jsx";
import ChatWindow from "../chat/ChatWindow.jsx";
import DetailsPanel from "../chat/DetailsPanel.jsx";

export default function ChatLayout() {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <ChatList />
      <ChatWindow onToggleDetails={() => setShowDetails((v) => !v)} />
      {showDetails && <DetailsPanel onClose={() => setShowDetails(false)} />}
    </div>
  );
}
