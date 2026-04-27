"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Message } from "@/types/database";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash, FaExclamationTriangle } from "react-icons/fa";

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Modal State
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('messages').update({ is_read: !currentStatus }).eq('id', id);
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    }
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    const { error } = await supabase.from('messages').delete().eq('id', messageToDelete);
    if (!error) {
      setMessages(messages.filter(m => m.id !== messageToDelete));
    }
    setMessageToDelete(null);
  };

  const generateReplyMailto = (msg: Message) => {
    const subject = encodeURIComponent("Re: Your Message from my Portfolio");
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out! I have received your message:\n\n"${msg.message}"\n\n[Your response here]\n\nBest regards,\nM.K Bahtiar`);
    return `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  if (loading) return (
    <div className="pt-10">
      <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
  );

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="animate-in fade-in duration-500 pb-24 relative">
      <AdminPageHeader 
        title="Inbox" 
        description={`Manage messages from your portfolio contact form. You have ${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}.`} 
      />

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-in-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
               <FaExclamationTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete Message?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">
              This action cannot be undone. The message will be permanently removed from your inbox.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setMessageToDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inbox List */}
      <div className="mt-8 bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl rounded-[2rem] overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FaEnvelopeOpen size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inbox is empty</h3>
            <p className="text-gray-500 dark:text-gray-400">You have no new messages at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {messages.map((msg) => (
              <div key={msg.id} className={`group p-6 md:p-8 transition-all duration-500 relative ${!msg.is_read ? 'bg-cyan-50/50 dark:bg-cyan-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}>
                
                {/* Active Indicator Line */}
                {!msg.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  
                  {/* Sender Avatar */}
                  <div className="hidden sm:flex w-14 h-14 shrink-0 rounded-2xl items-center justify-center font-bold text-xl shadow-lg border border-gray-200 dark:border-white/10
                    ${!msg.is_read ? 'bg-gradient-to-br from-cyan-400 to-purple-500 text-white border-none' : 'bg-white dark:bg-black text-gray-400 dark:text-gray-500'}">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                         <h3 className={`text-xl truncate ${!msg.is_read ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                           {msg.name}
                         </h3>
                         {!msg.is_read && (
                           <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest">New</span>
                         )}
                      </div>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400 shrink-0 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                        {new Date(msg.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    
                    <a href={`mailto:${msg.email}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors mb-6 inline-block">{msg.email}</a>
                    
                    <div className={`p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border ${!msg.is_read ? 'bg-white dark:bg-black/50 text-gray-800 dark:text-gray-200 border-cyan-100 dark:border-cyan-500/20 shadow-sm' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'}`}>
                      {msg.message}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-3 justify-end shrink-0 pt-4 lg:pt-0">
                    <a 
                      href={generateReplyMailto(msg)}
                      onClick={() => !msg.is_read && toggleReadStatus(msg.id, msg.is_read)}
                      className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl shadow-lg shadow-cyan-500/20 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 flex-1 lg:flex-none"
                    >
                      <FaReply size={14} /> Reply
                    </a>
                    <button 
                      onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                      className="px-5 py-3 border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all flex-1 lg:flex-none"
                    >
                      {msg.is_read ? <><FaEnvelope size={14} /> Mark Unread</> : <><FaEnvelopeOpen size={14} /> Mark Read</>}
                    </button>
                    <button 
                      onClick={() => setMessageToDelete(msg.id)}
                      className="p-3 lg:px-5 lg:py-3 text-red-500 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                      title="Delete message"
                    >
                      <FaTrash size={14} /> <span className="hidden lg:inline">Delete</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
