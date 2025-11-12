import React, { useState, createContext, useContext, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Appointments from "../AppointmentInterface/Appointment";
import AppointmentCard from "./AppointmentCard";
import MedicalRecords from "./MedicalRecords";
import ColorVisionTest from "./ColorVisionTest";
import QuickActions from "./QuickActions";
import ProductPreview from "./ProductPreview";
import ProfilePage from "../PatientProfileInterface/ProfilePage";
import ProductInterface from "../ProductInteface/ProductLayout";
import instance from "../../api/axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import PatientMessageModal from "./PatientMessageModal";

// --- 1. Create a Navigation Context ---
// This will be our new centralized control system for navigation.
const DashboardNavContext = createContext();

// --- 2. Create a custom hook for easy access ---
// Any child component can now use `useDashboardNav()` to get the navigation state and setter.
export const useDashboardNav = () => useContext(DashboardNavContext);

const DashboardHome = ({ unreadNotifications }) => (
  <main className="flex-1 overflow-y-auto p-4 md:p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Dashboard Overview
    </h2>
    <AppointmentCard />
    <MedicalRecords />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <ColorVisionTest />
      <QuickActions unreadNotifications={unreadNotifications} />
    </div>
    <ProductPreview />
  </main>
);

const DashboardLayout = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const providerValue = { activeNav, setActiveNav };
  const { user } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await instance.get("/notifications/my-notifications");
          setNotifications(res.data);
          setHasUnread(res.data.some((n) => !n.isRead));
        } catch (err) {
          console.error("Could not fetch notifications", err);
        }
      };
      const fetchConversations = async () => {
        try {
          const res = await instance.get("/messages/my-conversations");
          setConversations(res.data);
          // Check if any conversation has an unread last message sent by an admin
          setHasUnreadMessages(
            res.data.some(
              (c) =>
                c.lastMessage &&
                !c.lastMessage.isRead &&
                c.lastMessage.sender.role !== "patient"
            )
          );
        } catch (err) {
          console.error("Could not fetch conversations", err);
        }
      };
      fetchConversations();
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setHasUnread(true);
      });
      socket.on("new_message_reply", (newReply) => {
        // Find the conversation this reply belongs to and update it
        setConversations((prevConvos) =>
          prevConvos.map((convo) =>
            convo._id === newReply.conversation
              ? { ...convo, lastMessage: { ...newReply, isRead: false } }
              : convo
          )
        );
        setHasUnreadMessages(true);
      });
      return () => {
        socket.off("new_notification");
        socket.off("new_message_reply");
      };
    }
  }, [socket]);

  const handleNotificationRead = async (notificationId) => {
    // First, optimistically update the UI to feel instant
    const updatedNotifications = notifications.map((n) =>
      n._id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    setHasUnread(updatedNotifications.some((n) => !n.isRead));

    try {
      await instance.patch(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read on server:", err);
      setNotifications(notifications);
      setHasUnread(notifications.some((n) => !n.isRead));
      alert("Could not mark notification as read. Please try again.");
    }
  };

  const handleMessageClick = async (conversation) => {
    setSelectedConvo(conversation);
    setIsMsgModalOpen(true);

    const lastMsg = conversation.lastMessage;
    // If the last message is an unread reply from an admin, mark it as read
    if (lastMsg && !lastMsg.isRead && lastMsg.sender.role !== "patient") {
      // Optimistic UI update
      const updatedConversations = conversations.map((c) =>
        c._id === conversation._id
          ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
          : c
      );
      setConversations(updatedConversations);
      setHasUnreadMessages(
        updatedConversations.some(
          (c) =>
            c.lastMessage &&
            !c.lastMessage.isRead &&
            c.lastMessage.sender.role !== "patient"
        )
      );

      // API call to update the backend
      try {
        await instance.patch(`/messages/${lastMsg._id}/read`);
      } catch (err) {
        console.error("Failed to mark message as read on server:", err);
        // Revert UI on failure if needed
      }
    }
  };

  // Filter for only unread notifications to pass to QuickActions
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const sortedConversations = conversations
    .filter((c) => c.lastMessage) // Ensure conversation has a last message to display
    .sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  return (
    <DashboardNavContext.Provider value={providerValue}>
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 ml-0 md:ml-64 bg-gray-100 flex flex-col">
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            notifications={notifications}
            hasUnread={hasUnread}
            onNotificationRead={handleNotificationRead}
            conversations={sortedConversations}
            hasUnreadMessages={hasUnreadMessages}
            onMessageClick={handleMessageClick}
          />
          {/* The rendering logic remains the same, but it's now controlled
              by a state that is accessible everywhere. */}
          {activeNav === "home" && (
            <DashboardHome unreadNotifications={unreadNotifications} />
          )}
          {activeNav === "appointments" && <Appointments />}
          {activeNav === "products" && <ProductInterface />}
          {activeNav === "profile" && <ProfilePage />}
        </div>
        <PatientMessageModal
          isOpen={isMsgModalOpen}
          onClose={() => setIsMsgModalOpen(false)}
          conversation={selectedConvo}
        />
      </div>
    </DashboardNavContext.Provider>
  );
};

export default DashboardLayout;
