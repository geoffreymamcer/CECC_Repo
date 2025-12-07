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

const DASHBOARD_LOADING_DURATION = 500;

const DashboardNavContext = createContext();
export const useDashboardNav = () => useContext(DashboardNavContext);

const WelcomeBanner = ({ user }) => {
  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good Morning" : time < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-gradient-to-r from-[#7F0000] to-[#5a0000] rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user?.firstName || "Patient"}!
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            You have full access to your records, test results, and
            appointments.
          </p>
        </div>
        <div className="hidden md:block bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
            Current Date
          </p>
          <p className="text-xl font-mono font-bold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = ({ unreadNotifications, user }) => (
  <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
    <WelcomeBanner user={user} />

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-8 animate-fadeIn">
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-gray-800">Next Visit</h3>
          </div>
          <AppointmentCard />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-gray-800">My Records</h3>
          </div>
          <MedicalRecords />
        </section>
      </div>

      <div
        className="space-y-8 animate-fadeIn"
        style={{ animationDelay: "0.1s" }}
      >
        <QuickActions unreadNotifications={unreadNotifications} />

        <ColorVisionTest />

        <ProductPreview />
      </div>
    </div>
  </main>
);

const DashboardLayout = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (activeNav === "home") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, DASHBOARD_LOADING_DURATION);
      return () => clearTimeout(timer);
    }
  }, [activeNav]);

  const handleNotificationRead = async (notificationId) => {
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
    if (lastMsg && !lastMsg.isRead && lastMsg.sender.role !== "patient") {
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

      try {
        await instance.patch(`/messages/${lastMsg._id}/read`);
      } catch (err) {
        console.error("Failed to mark message as read on server:", err);
      }
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const sortedConversations = conversations
    .filter((c) => c.lastMessage)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  return (
    <DashboardNavContext.Provider value={providerValue}>
      <div className="flex h-screen bg-gray-100 ">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 ml-0 md:ml-72 flex flex-col h-screen overflow-hidden">
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

          {activeNav === "home" && isLoading ? (
            <main className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7F0000]"></div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">
                  Preparing your dashboard...
                </p>
              </div>
            </main>
          ) : activeNav === "home" ? (
            <DashboardHome
              unreadNotifications={unreadNotifications}
              user={user}
            />
          ) : null}
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
