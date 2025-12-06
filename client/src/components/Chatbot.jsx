import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

const Chatbot = ({ userEmail, userComplaints }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 I'm here to help. Ask me anything about your complaints or the website.", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Greeting responses
    if (lowerMessage.match(/^(hello|hi|hey|greetings|what's up|sup|howdy)/)) {
      return "Hello! 👋 Welcome to the Complaint Portal. I'm here to help you with any questions about your complaints, how to use the website, or anything else. What can I help you with today?";
    }

    if (lowerMessage.includes("how") && lowerMessage.includes("use")) {
      return `Welcome to the Complaint Portal! Here's how to use it:\n\n1. **Dashboard** - View all your filed complaints and their status\n2. **File New Complaint** - Report a new issue (location, department, description, image)\n3. **My Profile** - Check your account details and chat with me\n\nYou currently have filed ${userComplaints.length} complaint${userComplaints.length !== 1 ? "s" : ""}. Start by filing a new one or checking the status of existing ones!`;
    }

    if (lowerMessage.includes("what") && lowerMessage.includes("this")) {
      return `This is the Complaint Portal - a platform where citizens can file complaints about public issues.\n\nYou can:\n✓ File complaints about public services\n✓ Track your complaint status in real-time\n✓ Upload evidence (images) with your complaint\n✓ Get updates from admins\n✓ View all your past complaints\n\nYou've already filed ${userComplaints.length} complaint${userComplaints.length !== 1 ? "s" : ""}!`;
    }

    if (lowerMessage.includes("welcome")) {
      return `Welcome to the Complaint Portal! 🎉\n\nI'm happy to help. You've filed ${userComplaints.length} complaint${userComplaints.length !== 1 ? "s" : ""} so far.\n\nWhat would you like to know? Ask me about:\n- How to file a complaint\n- Your complaint status\n- How the website works\n- Or anything else!`;
    }

    // Questions about total complaints
    if (lowerMessage.includes("how many") && lowerMessage.includes("complaint")) {
      return `You have filed **${userComplaints.length}** complaint${userComplaints.length !== 1 ? "s" : ""} in total.`;
    }

    if (lowerMessage.includes("complaint") && (lowerMessage.includes("count") || lowerMessage.includes("total"))) {
      return `Your total complaints: **${userComplaints.length}**`;
    }

    // Detailed complaint statistics
    if (lowerMessage.includes("complaint") && lowerMessage.includes("status")) {
      if (userComplaints.length === 0) {
        return "You haven't filed any complaints yet. Head to the Dashboard to file your first complaint!";
      }
      const statusSummary = userComplaints.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {});
      const statusText = Object.entries(statusSummary)
        .map(([status, count]) => `• ${status}: ${count}`)
        .join("\n");
      return `Here's your complaint status breakdown:\n\n${statusText}`;
    }

    if (lowerMessage.includes("statistic") || lowerMessage.includes("summary")) {
      if (userComplaints.length === 0) {
        return `📊 You haven't filed any complaints yet.\n\nStart by filing your first complaint on the Dashboard!`;
      }
      const statusSummary = userComplaints.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {});
      const pendingCount = statusSummary["Pending"] || 0;
      const inProgressCount = statusSummary["In Progress"] || 0;
      const resolvedCount = statusSummary["Resolved"] || 0;
      return `📊 **Your Complaint Summary:**\n\n• Total Filed: ${userComplaints.length}\n• Pending: ${pendingCount}\n• In Progress: ${inProgressCount}\n• ✅ Resolved: ${resolvedCount}`;
    }

    // List all complaints with names and status
    if ((lowerMessage.includes("name") && lowerMessage.includes("complaint")) ||
        (lowerMessage.includes("list") && lowerMessage.includes("complaint")) ||
        (lowerMessage.includes("show") && lowerMessage.includes("complaint")) ||
        (lowerMessage.includes("all") && lowerMessage.includes("complaint"))) {
      if (userComplaints.length === 0) {
        return "You haven't filed any complaints yet. Start by filing your first complaint on the Dashboard!";
      }
      const complaintsList = userComplaints
        .map((c, idx) => `${idx + 1}. **${c.title}** - Status: ${c.status}`)
        .join("\n");
      return `📋 **Your Complaints:**\n\n${complaintsList}`;
    }

    // Recent complaints
    if (lowerMessage.includes("recent") || lowerMessage.includes("latest")) {
      if (userComplaints.length === 0) {
        return "You haven't filed any complaints yet.";
      }
      const recent = userComplaints[0];
      return `Your most recent complaint:\n\n📝 **"${recent.title}"**\nStatus: ${recent.status}\nFiled on: ${new Date(recent.createdAt).toLocaleDateString()}`;
    }

    // Filing a complaint
    if (lowerMessage.includes("file") || lowerMessage.includes("create") || lowerMessage.includes("new")) {
      return `📝 **How to File a Complaint:**\n\n1. Go to **Dashboard** page\n2. Click **"File New Complaint"** button\n3. Fill in:\n   - Complaint Title\n   - Description of the issue\n   - Select State & District\n   - Choose Department (Health, Roads, Police, etc.)\n   - Upload an image (optional but helpful)\n4. Click **Submit**\n\nYour complaint will be tracked in real-time!`;
    }

    // Tracking complaints
    if (lowerMessage.includes("track") || lowerMessage.includes("check") || lowerMessage.includes("view")) {
      return `🔍 **How to Track Your Complaints:**\n\n1. Go to **Dashboard** page\n2. All your complaints are listed\n3. Each shows:\n   - Complaint Title\n   - Current Status (Pending/In Progress/Resolved)\n   - Location (State, District)\n   - Department\n   - Filed Date\n   - Uploaded Image\n   - Admin Updates\n\nRefresh the page to see latest updates!`;
    }

    // Department information
    if (lowerMessage.includes("department")) {
      return `🏢 **Available Departments:**\n\nYou can file complaints to:\n• Public Health\n• Roads & Infrastructure\n• Police\n• Water Supply\n• Electricity\n• Municipal Services\n• Environment\n• And more...\n\nChoose the relevant department when filing your complaint.`;
    }

    // Image upload
    if (lowerMessage.includes("image") || lowerMessage.includes("photo") || lowerMessage.includes("upload")) {
      return `📸 **About Image Upload:**\n\n✓ Supported formats: JPG, PNG\n✓ Optional but recommended\n✓ Helps provide evidence for your issue\n✓ Max file size: Usually 5-10MB\n✓ Images are reviewed by officials\n✓ Helps in faster complaint resolution`;
    }

    // Admin updates
    if (lowerMessage.includes("update")) {
      return `📬 **How Updates Work:**\n\nYour complaints get reviewed and:\n✓ Status updates (Pending → In Progress → Resolved)\n✓ Comments with more details\n✓ Response images and documents\n✓ Timeline for resolution\n\nYou'll see all updates on your Dashboard!`;
    }

    // Account & password
    if (lowerMessage.includes("password")) {
      return `🔐 **Password Help:**\n\nCurrently, you can:\n✓ Change password (if feature available on website)\n✓ Contact support for password reset\n✓ Use "Forgot Password" link on Login page (if available)\n\nFor security, use a strong password!`;
    }

    if (lowerMessage.includes("account") || lowerMessage.includes("profile")) {
      return `👤 **Your Account:**\n\nOn **My Profile** page, you can:\n✓ View your Name & Email\n✓ See account information\n✓ Delete your account (if needed)\n✓ Chat with me for help\n\nYour account is secure and encrypted.`;
    }

    // Delete account
    if (lowerMessage.includes("delete") || lowerMessage.includes("remove")) {
      return `⚠️ **Delete Account:**\n\nYou can delete your account from **My Profile** page.\n\n⚠️ **Warning:**\n• Permanent action\n• Cannot be undone\n• You'll need to register again\n• Your complaints remain in the system\n\nAre you sure you want to delete?`;
    }

    // Contact/Support
    if (lowerMessage.includes("contact") || lowerMessage.includes("support") || lowerMessage.includes("help")) {
      return `💬 **Support & Contact:**\n\nYou can reach out via:\n✓ Chat with me (I'm available 24/7!)\n✓ Email: support@complaintportal.com (if available)\n✓ Call: Check website footer for contact details\n✓ Visit: Official website for more info\n\nI'm here to help with any questions!`;
    }

    // General features
    if (lowerMessage.includes("feature") || lowerMessage.includes("what can")) {
      return `⭐ **Website Features:**\n\n1️⃣ **File Complaints** - Report public issues\n2️⃣ **Real-time Tracking** - Know complaint status instantly\n3️⃣ **Image Upload** - Attach evidence\n4️⃣ **Status Updates** - Get responses on your complaints\n5️⃣ **Dashboard** - View all your complaints\n6️⃣ **Profile** - Manage your account\n7️⃣ **24/7 Chat** - Get help anytime\n\nStart by filing a complaint!`;
    }

    // Complaint resolved
    if (lowerMessage.includes("resolve")) {
      const resolvedCount = userComplaints.filter(c => c.status === "Resolved").length;
      return `✅ Great! You have **${resolvedCount}** resolved complaint${resolvedCount !== 1 ? "s" : ""}. \n\nWould you like to file another complaint or check the status of pending ones?`;
    }

    // Pending complaints
    if (lowerMessage.includes("pending")) {
      const pendingCount = userComplaints.filter(c => c.status === "Pending").length;
      return `⏳ You have **${pendingCount}** pending complaint${pendingCount !== 1 ? "s" : ""}.\n\nYour complaint${pendingCount !== 1 ? "s" : ""} will be reviewed soon. Check your Dashboard regularly for updates!`;
    }

    // In progress
    if (lowerMessage.includes("progress") || lowerMessage.includes("ongoing")) {
      const inProgressCount = userComplaints.filter(c => c.status === "In Progress").length;
      return `🔄 You have **${inProgressCount}** complaint${inProgressCount !== 1 ? "s" : ""} currently being reviewed.\n\nYour complaint${inProgressCount !== 1 ? "s are" : " is"} in progress. Check back regularly for updates!`;
    }

    // Thank you
    if (lowerMessage.includes("thank")) {
      return `You're welcome! 😊 Feel free to ask me anything else about the website or your complaints. I'm always here to help!`;
    }

    // General questions about the portal
    if (lowerMessage.includes("why") || lowerMessage.includes("where")) {
      return `The Complaint Portal is designed to help you voice concerns about public services and issues.\n\nYour voice matters! File a complaint, track it in real-time, and get updates.\n\nYou've already taken the first step with your ${userComplaints.length} complaint${userComplaints.length !== 1 ? "s" : ""}! 🎉`;
    }

    // How does it work
    if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
      return `🔄 **How the Portal Works:**\n\n1. **You File** → Submit complaint with details & image\n2. **We Register** → Your complaint gets a tracking number\n3. **Review** → Your complaint is reviewed and assessed\n4. **Status Updates** → You see progress (Pending → In Progress → Resolved)\n5. **Resolution** → Issue gets addressed, you get updates\n\nSimple, transparent, and effective!`;
    }

    // Bragging about complaints
    if (userComplaints.length > 5 && (lowerMessage.includes("wow") || lowerMessage.includes("amazing") || lowerMessage.includes("great"))) {
      return `Wow! You've filed ${userComplaints.length} complaints! You're a very active citizen making a difference! 🌟 Keep bringing attention to public issues!`;
    }

    // Default conversational response
    return `That's a great question! 😊\n\nI can help you with:\n✓ Your complaint statistics (You have ${userComplaints.length} complaint${userComplaints.length !== 1 ? "s" : ""})\n✓ How to file a complaint\n✓ How to track your complaints\n✓ Website features and guidance\n✓ General questions about the portal\n\nWhat would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMsg = { id: Date.now() + 1, text: botResponse, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>💬 Assistant</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          rows="3"
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
