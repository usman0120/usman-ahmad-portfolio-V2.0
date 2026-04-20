// pages/Admin/MessagesAdmin.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMessages, useHireRequests } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';
import type { Message, HireRequest, HireAttachment } from '../../firebase/models';
import { 
  FaEnvelope, FaBriefcase, FaCheck, FaTrash, FaDownload, 
  FaFile, FaImage, FaFilePdf, FaFileAlt, FaEye, FaTimes,
  FaBuilding, FaPhone, FaCalendar, FaTag, FaClock,
  FaShieldAlt
} from 'react-icons/fa';

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', onClick, className = '', icon
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg active:scale-95',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-primary border border-primary/30',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button onClick={onClick} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {icon}{children}
    </motion.button>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, className = '', padding = 'md'
}) => {
  const paddingClasses = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  return (
    <div className={`rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Message Item Component
interface MessageItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSelected, onClick }) => {
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      variants={fadeUp}
      className={`p-4 cursor-pointer transition-all rounded-xl border ${
        isSelected ? 'bg-primary/5 border-primary' : !message.read ? 'bg-primary/5 border-primary/30 hover:border-primary/50' : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0 ${!message.read ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          <FaEnvelope className="text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-medium truncate ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{message.name}</h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(message.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">{message.message}</p>
          <p className="text-xs text-gray-400 truncate">{message.email}</p>
        </div>
        {!message.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
      </div>
    </motion.div>
  );
};

// Hire Request Item Component
interface HireRequestItemProps {
  request: HireRequest;
  isSelected: boolean;
  onClick: () => void;
}

const HireRequestItem: React.FC<HireRequestItemProps> = ({ request, isSelected, onClick }) => {
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: HireRequest['status']): string => {
    const colors: Record<HireRequest['status'], string> = { 
      new: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', 
      reviewed: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30', 
      contacted: 'text-green-600 bg-green-100 dark:bg-green-900/30', 
      archived: 'text-gray-600 bg-gray-100 dark:bg-gray-700' 
    };
    return colors[status];
  };

  return (
    <motion.div variants={fadeUp} className={`p-4 cursor-pointer transition-all rounded-xl border ${isSelected ? 'bg-primary/5 border-primary' : !request.read ? 'bg-primary/5 border-primary/30 hover:border-primary/50' : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`} onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0 ${!request.read ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          <FaBriefcase className="text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-medium truncate ${!request.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{request.name}</h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(request.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">{request.projectType} • {request.budget || 'N/A'}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(request.status)}`}>{request.status}</span>
            {request.ndaRequired && <FaShieldAlt className="text-primary text-xs" title="NDA Required" />}
          </div>
        </div>
        {!request.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
      </div>
    </motion.div>
  );
};

// Attachment Viewer Component
interface AttachmentViewerProps {
  attachments: HireAttachment[];
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments }) => {
  const [previewFile, setPreviewFile] = useState<HireAttachment | null>(null);

  const getFileIcon = (type: string): React.ReactNode => {
    if (type?.startsWith('image/')) return <FaImage className="text-blue-500" />;
    if (type === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    if (type?.includes('document')) return <FaFileAlt className="text-blue-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = (file: HireAttachment): void => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <FaFile /> Attachments ({attachments.length})
      </h4>
      <div className="space-y-2">
        {attachments.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {file.type?.startsWith('image/') && (
                <button onClick={() => setPreviewFile(file)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Preview">
                  <FaEye className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => handleDownload(file)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download">
                <FaDownload className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" 
            onClick={() => setPreviewFile(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
              className="relative max-w-4xl max-h-[90vh]" 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button 
                onClick={() => setPreviewFile(null)} 
                className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
                aria-label="Close preview"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <img 
                src={previewFile.data} 
                alt={previewFile.name} 
                className="max-w-full max-h-[90vh] rounded-xl" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const MessagesAdmin: React.FC = () => {
  const { messages, loading: messagesLoading, markAsRead: markMessageRead, deleteMessage } = useMessages();
  const { hireRequests, loading: hireLoading, markAsRead: markHireRead, updateStatus, deleteHireRequest } = useHireRequests();
  
  const [activeTab, setActiveTab] = useState<'messages' | 'hire'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedHireRequest, setSelectedHireRequest] = useState<HireRequest | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [hireFilter, setHireFilter] = useState<'all' | 'new' | 'reviewed' | 'contacted' | 'archived'>('all');

  const filteredMessages = messages.filter((msg: Message): boolean => {
    if (messageFilter === 'unread') return !msg.read;
    if (messageFilter === 'read') return msg.read;
    return true;
  });

  const filteredHireRequests = hireRequests.filter((req: HireRequest): boolean => {
    if (hireFilter === 'all') return true;
    return req.status === hireFilter;
  });

  const unreadMessagesCount = messages.filter((m: Message) => !m.read).length;
  const unreadHireCount = hireRequests.filter((r: HireRequest) => !r.read).length;
  const newHireCount = hireRequests.filter((r: HireRequest) => r.status === 'new').length;

  const handleMarkMessageRead = async (id: string): Promise<void> => {
    try { 
      await markMessageRead(id); 
      if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, read: true }); 
    } catch { 
      /* handled */ 
    }
  };

  const handleMarkHireRead = async (id: string): Promise<void> => {
    try { 
      await markHireRead(id); 
      if (selectedHireRequest?.id === id) setSelectedHireRequest({ ...selectedHireRequest, read: true }); 
    } catch { 
      /* handled */ 
    }
  };

  const handleUpdateStatus = async (id: string, status: HireRequest['status']): Promise<void> => {
    try { 
      await updateStatus(id, status); 
      if (selectedHireRequest?.id === id) setSelectedHireRequest({ ...selectedHireRequest, status }); 
    } catch { 
      alert('Failed to update status'); 
    }
  };

  const handleDeleteMessage = async (id: string): Promise<void> => {
    if (window.confirm('Delete this message?')) {
      try { 
        await deleteMessage(id); 
        if (selectedMessage?.id === id) setSelectedMessage(null); 
      } catch { 
        alert('Failed to delete'); 
      }
    }
  };

  const handleDeleteHireRequest = async (id: string): Promise<void> => {
    if (window.confirm('Delete this hire request?')) {
      try { 
        await deleteHireRequest(id); 
        if (selectedHireRequest?.id === id) setSelectedHireRequest(null); 
      } catch { 
        alert('Failed to delete'); 
      }
    }
  };

  const formatFullDate = (date: Date): string => new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const loading = messagesLoading || hireLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6"><LoadingSkeleton type="card" count={6} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard"><Button variant="ghost" size="sm" icon="←">Back</Button></Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'messages' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('messages')}
              >
                <FaEnvelope /> Messages {unreadMessagesCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{unreadMessagesCount}</span>}
              </Button>
              <Button 
                variant={activeTab === 'hire' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('hire')}
              >
                <FaBriefcase /> Hire Requests {unreadHireCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{unreadHireCount}</span>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card padding="sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div><span className="text-sm text-gray-500">Total:</span> <span className="font-semibold">{activeTab === 'messages' ? messages.length : hireRequests.length}</span></div>
                <div><span className="text-sm text-gray-500">Unread:</span> <span className={`font-semibold ${(activeTab === 'messages' ? unreadMessagesCount : unreadHireCount) > 0 ? 'text-primary' : ''}`}>{activeTab === 'messages' ? unreadMessagesCount : unreadHireCount}</span></div>
                {activeTab === 'hire' && <div><span className="text-sm text-gray-500">New:</span> <span className="font-semibold text-blue-600">{newHireCount}</span></div>}
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-1">
                {activeTab === 'messages' ? (
                  (['all', 'unread', 'read'] as const).map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setMessageFilter(f)} 
                      className={`px-3 py-1.5 text-sm rounded-lg capitalize ${messageFilter === f ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {f}
                    </button>
                  ))
                ) : (
                  (['all', 'new', 'reviewed', 'contacted', 'archived'] as const).map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setHireFilter(f)} 
                      className={`px-3 py-1.5 text-sm rounded-lg capitalize ${hireFilter === f ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {f}
                    </button>
                  ))
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1">
            <Card padding="none" className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">{activeTab === 'messages' ? 'Messages' : 'Hire Requests'} ({activeTab === 'messages' ? filteredMessages.length : filteredHireRequests.length})</h2>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px] p-3">
                {activeTab === 'messages' ? (
                  filteredMessages.length > 0 ? (
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                      {filteredMessages.map((msg: Message) => (
                        <MessageItem 
                          key={msg.id} 
                          message={msg} 
                          isSelected={selectedMessage?.id === msg.id} 
                          onClick={() => { 
                            setSelectedMessage(msg); 
                            setSelectedHireRequest(null); 
                            if (!msg.read) handleMarkMessageRead(msg.id); 
                          }} 
                        />
                      ))}
                    </motion.div>
                  ) : <div className="text-center py-12"><div className="text-4xl mb-3 opacity-30">📭</div><p className="text-gray-500">No messages</p></div>
                ) : (
                  filteredHireRequests.length > 0 ? (
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                      {filteredHireRequests.map((req: HireRequest) => (
                        <HireRequestItem 
                          key={req.id} 
                          request={req} 
                          isSelected={selectedHireRequest?.id === req.id} 
                          onClick={() => { 
                            setSelectedHireRequest(req); 
                            setSelectedMessage(null); 
                            if (!req.read) handleMarkHireRead(req.id); 
                          }} 
                        />
                      ))}
                    </motion.div>
                  ) : <div className="text-center py-12"><div className="text-4xl mb-3 opacity-30">📭</div><p className="text-gray-500">No hire requests</p></div>
                )}
              </div>
            </Card>
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'messages' && selectedMessage ? (
                <motion.div key={selectedMessage.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card padding="lg">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium ${!selectedMessage.read ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <FaEnvelope />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
                          <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline text-sm">{selectedMessage.email}</a>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)} icon={<FaTrash />}>Delete</Button>
                    </div>
                    <div className="flex items-center gap-4 mb-6 text-sm">
                      <span className="text-gray-500">{formatFullDate(selectedMessage.createdAt)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${selectedMessage.read ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        {selectedMessage.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mb-6">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                    <div className="flex gap-3">
                      <a href={`mailto:${selectedMessage.email}`} className="flex-1">
                        <Button variant="primary" className="w-full" icon="↩️">Reply via Email</Button>
                      </a>
                      {!selectedMessage.read && (
                        <Button variant="outline" onClick={() => handleMarkMessageRead(selectedMessage.id)} icon={<FaCheck />}>Mark Read</Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ) : activeTab === 'hire' && selectedHireRequest ? (
                <motion.div key={selectedHireRequest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card padding="lg">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium ${!selectedHireRequest.read ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <FaBriefcase />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">{selectedHireRequest.name}</h2>
                          <a href={`mailto:${selectedHireRequest.email}`} className="text-primary hover:underline text-sm">{selectedHireRequest.email}</a>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteHireRequest(selectedHireRequest.id)} icon={<FaTrash />}>Delete</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2"><FaBuilding className="text-gray-400" /><span className="text-sm">{selectedHireRequest.company || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><FaPhone className="text-gray-400" /><span className="text-sm">{selectedHireRequest.phone || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><FaTag className="text-gray-400" /><span className="text-sm">{selectedHireRequest.projectType}</span></div>
                      <div className="flex items-center gap-2"><FaClock className="text-gray-400" /><span className="text-sm">{selectedHireRequest.timeline || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><FaCalendar className="text-gray-400" /><span className="text-sm">{formatFullDate(selectedHireRequest.createdAt)}</span></div>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className={selectedHireRequest.ndaRequired ? 'text-primary' : 'text-gray-400'} />
                        <span className="text-sm">{selectedHireRequest.ndaRequired ? 'NDA Required' : 'No NDA'}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mb-4">
                      <h4 className="font-medium mb-2">Project Description</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedHireRequest.description}</p>
                    </div>

                    {selectedHireRequest.attachments && selectedHireRequest.attachments.length > 0 && (
                      <div className="mb-6"><AttachmentViewer attachments={selectedHireRequest.attachments} /></div>
                    )}

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm text-gray-500">Status:</span>
                      <select 
                        value={selectedHireRequest.status} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateStatus(selectedHireRequest.id, e.target.value as HireRequest['status'])} 
                        className="px-3 py-1.5 border rounded-lg dark:bg-gray-800"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="contacted">Contacted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <a href={`mailto:${selectedHireRequest.email}`} className="flex-1">
                        <Button variant="primary" className="w-full" icon="↩️">Reply via Email</Button>
                      </a>
                      {!selectedHireRequest.read && (
                        <Button variant="outline" onClick={() => handleMarkHireRead(selectedHireRequest.id)} icon={<FaCheck />}>Mark Read</Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card padding="lg" className="text-center">
                    <div className="py-12">
                      <div className="text-5xl mb-4 opacity-30">👈</div>
                      <h3 className="text-lg font-medium mb-2">Select an item</h3>
                      <p className="text-gray-500">Choose from the list to view details</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesAdmin;