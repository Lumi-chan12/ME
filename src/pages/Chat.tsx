import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Search, Phone, Video,
  Paperclip, Smile, Users, Bot, ChevronLeft,
  Circle, Check, CheckCheck, Plus, Mic,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'department';
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  members: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
  read: boolean;
}

const channels: ChatChannel[] = [
  { id: '1', name: 'Dr. Adams', type: 'direct', lastMessage: 'Please check on Room 412 vitals', lastTime: '2m', unread: 2, online: true, members: 2, avatar: 'DA' },
  { id: '2', name: 'ICU Team', type: 'department', lastMessage: 'Shift handover notes shared', lastTime: '15m', unread: 5, online: true, members: 8, avatar: 'IC' },
  { id: '3', name: 'Ward 3 Nurses', type: 'group', lastMessage: 'Medication round starting', lastTime: '30m', unread: 0, online: false, members: 6, avatar: 'W3' },
  { id: '4', name: 'Dr. Patel', type: 'direct', lastMessage: 'Lab results are in for review', lastTime: '1h', unread: 1, online: false, members: 2, avatar: 'DP' },
  { id: '5', name: 'Emergency Response', type: 'department', lastMessage: 'Code Blue resolved - Room 412', lastTime: '2h', unread: 0, online: true, members: 12, avatar: 'ER' },
  { id: '6', name: 'NurseFlow AI', type: 'direct', lastMessage: 'How can I assist you today?', lastTime: '3h', unread: 0, online: true, members: 2, avatar: 'AI' },
];

const chatMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'Dr. Adams', content: 'How is Maria Garcia doing in 412-C?', time: '09:15', isMine: false, read: true },
    { id: '2', sender: 'You', content: 'Vitals are elevated. HR 110, SpO2 91%. I\'ve started oxygen therapy.', time: '09:18', isMine: true, read: true },
    { id: '3', sender: 'Dr. Adams', content: 'Good call. I\'ll come check on her after rounds.', time: '09:20', isMine: false, read: true },
    { id: '4', sender: 'Dr. Adams', content: 'Please check on Room 412 vitals every 30 min', time: '09:25', isMine: false, read: false },
  ],
  '6': [
    { id: '1', sender: 'NurseFlow AI', content: 'Good morning! Here\'s your daily briefing:\n- 3 medications due in the next hour\n- 1 critical patient needs assessment\n- Shift handover at 14:00', time: '07:00', isMine: false, read: true },
    { id: '2', sender: 'You', content: 'What\'s the priority for Maria Garcia?', time: '07:05', isMine: true, read: true },
    { id: '3', sender: 'NurseFlow AI', content: 'Maria Garcia (412-C) is flagged as critical. Her vitals show declining SpO2 and elevated HR. Recommend:\n1. Increase O2 to 4L\n2. Notify attending physician\n3. Schedule q30min vitals check', time: '07:06', isMine: false, read: true },
  ],
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = selectedChannel ? (chatMessages[selectedChannel] || []) : [];

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  if (selectedChannel) {
    const channel = channels.find((c) => c.id === selectedChannel)!;
    const isAI = channel.name === 'NurseFlow AI';

    return (
      <motion.div
        className="h-full flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        {/* Chat Header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-white/5">
          <motion.button
            className="p-1.5 rounded-lg bg-white/5"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedChannel(null)}
          >
            <ChevronLeft size={16} className="text-white/40" />
          </motion.button>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isAI ? 'bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/30' : 'bg-white/10'
          }`}>
            {isAI ? <Bot size={14} className="text-neon-cyan" /> : (
              <span className="text-[9px] text-white/60 font-medium">{channel.avatar}</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white/85">{channel.name}</p>
            <div className="flex items-center gap-1.5">
              {channel.online && <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />}
              <span className="text-[10px] text-white/30">
                {channel.online ? 'Online' : 'Offline'} | {channel.members} members
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="p-2 rounded-lg bg-white/5" whileTap={{ scale: 0.9 }}>
              <Phone size={14} className="text-white/30" />
            </motion.button>
            <motion.button className="p-2 rounded-lg bg-white/5" whileTap={{ scale: 0.9 }}>
              <Video size={14} className="text-white/30" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {currentMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`max-w-[80%] ${msg.isMine ? 'order-2' : ''}`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line ${
                  msg.isMine
                    ? 'bg-cyan-400/10 border border-cyan-400/20 text-white/80 rounded-br-md'
                    : isAI
                    ? 'bg-gradient-to-br from-cyan-400/8 to-teal-400/8 border border-cyan-400/15 text-white/80 rounded-bl-md'
                    : 'bg-white/5 border border-white/10 text-white/70 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${msg.isMine ? 'justify-end' : ''}`}>
                  <span className="text-[9px] text-white/20">{msg.time}</span>
                  {msg.isMine && (
                    msg.read ? <CheckCheck size={10} className="text-cyan-400/40" /> : <Check size={10} className="text-white/20" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <motion.button className="p-2 rounded-lg bg-white/5" whileTap={{ scale: 0.9 }}>
              <Paperclip size={14} className="text-white/30" />
            </motion.button>
            <div className="flex-1 relative">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/30 transition-colors"
                placeholder={isAI ? 'Ask AI assistant...' : 'Type a message...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
            </div>
            <motion.button className="p-2 rounded-lg bg-white/5" whileTap={{ scale: 0.9 }}>
              <Mic size={14} className="text-white/30" />
            </motion.button>
            <motion.button
              className="p-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/25"
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
            >
              <Send size={14} className="text-neon-cyan" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold font-display text-white/90">Messages</h1>
          <p className="text-xs text-white/40 mt-0.5">{channels.reduce((a, c) => a + c.unread, 0)} unread</p>
        </div>
        <motion.button className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20" whileTap={{ scale: 0.9 }}>
          <Plus size={16} className="text-neon-cyan" />
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/40 transition-colors"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Channel List */}
      <motion.div variants={item} className="space-y-2">
        {filteredChannels.map((channel) => {
          const isAI = channel.name === 'NurseFlow AI';
          return (
            <GlassCard
              key={channel.id}
              className="p-3.5"
              onClick={() => setSelectedChannel(channel.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isAI
                      ? 'bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/30'
                      : 'bg-white/10'
                  }`}>
                    {isAI ? (
                      <Bot size={16} className="text-neon-cyan" />
                    ) : (
                      <span className="text-[9px] text-white/60 font-medium">{channel.avatar}</span>
                    )}
                  </div>
                  {channel.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-navy-800" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-white/85">{channel.name}</p>
                    {channel.type === 'department' && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400/60">Dept</span>
                    )}
                    {channel.type === 'group' && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">Group</span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/35 truncate">{channel.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[9px] text-white/25">{channel.lastTime}</span>
                  {channel.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center">
                      <span className="text-[9px] text-cyan-400 font-medium">{channel.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
