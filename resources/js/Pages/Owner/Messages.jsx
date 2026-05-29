import OwnerLayout from "@/Layouts/OwnerLayout";
import ChatDashboard from '../../Components/Owner/ChatDashboard';
import { useState } from "react";
import {
    Search,
    Send,
    MoreVertical,
    Paperclip,
    Smile,
    ArrowLeft,
    MessageCircle,
} from "lucide-react";

export default function Messages({conversations}) {
    // console.log(conversations);
    
    return (
        <OwnerLayout>
            <div className="min-h-screen bg-background dark:bg-dark-bg p-6">
                
                {/* PANGGIL KOMPONEN CHAT-NYA DI SINI */}
                <ChatDashboard conversations={conversations} />
            </div>
        </OwnerLayout>
    );
}