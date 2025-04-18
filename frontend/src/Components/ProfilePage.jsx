import 'bootstrap/dist/css/bootstrap.min.css';
import "../Styles/ProfilePage.css"
import userIcon from "/assets/images/UNLV_pic.png";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import badge1 from "/assets/images/UNLV_pic.png";
import badge2 from "/assets/images/UNLV_pic.png";
import badge3 from "/assets/images/UNLV_pic.png";
import badge4 from "/assets/images/UNLV_pic.png";
import EmojiPicker from 'emoji-picker-react';

// Quick smiley emojis - memoized outside component to prevent recreation
const quickEmojis = ['😊', '😂', '😍', '🥰', '😎', '😃', '🙂', '😉', '😇', '🤩'];



const ProfilePage = () => {
    // Consolidated related state
    const [statusData, setStatusData] = useState({
        current: "",
        new: "",
        isEditing: false,
        showEmojis: false
    });
    
    // Refs for DOM elements
    const textareaRef = useRef(null);
    const emojiMenuRef = useRef(null);
    const emojiButtonRef = useRef(null);

    // Memoized data that doesn't need to be recreated on every render
    const badges = useMemo(() => [
        { id: 1, name: "Master Explorer", image: badge1 },
        { id: 2, name: "Speed Runner", image: badge2 },
        { id: 3, name: "Legendary Warrior", image: badge3 },
        { id: 4, name: "Puzzle Genius", image: badge4 },
    ], []);

    // Sample recent activities - memoized to prevent recreating on each render
    const recentActivities = useMemo(() => [
        { id: 1, type: "course", title: "Completed Mathematics 101", date: "2 days ago", icon: "📚" },
        { id: 2, type: "assignment", title: "Submitted Physics Assignment", date: "3 days ago", icon: "📝" },
        { id: 3, type: "quiz", title: "Scored 95% on Chemistry Quiz", date: "1 week ago", icon: "🧪" },
        { id: 4, type: "discussion", title: "Posted in Computer Science Forum", date: "1 week ago", icon: "💬" },
        { id: 5, type: "course", title: "Enrolled in Biology 102", date: "2 weeks ago", icon: "🧬" }
    ], []);

    // Memoized callback to handle emoji insertion
    const insertEmoji = useCallback((emojiObj) => {
        const textarea = textareaRef.current;
        const emoji = typeof emojiObj === 'string' ? emojiObj : emojiObj.emoji;
        
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            
            setStatusData(prev => ({
                ...prev,
                new: before + emoji + after
            }));
            
            // Focus back on textarea and set cursor position
            setTimeout(() => {
                textarea.focus();
                const newCursorPos = start + emoji.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 10);
        } else {
            setStatusData(prev => ({
                ...prev,
                new: prev.new + emoji
            }));
        }
    }, []);

    // Toggle emoji menu with memoized callback
    const toggleEmojiMenu = useCallback((e) => {
        e.preventDefault();
        setStatusData(prev => ({
            ...prev,
            showEmojis: !prev.showEmojis
        }));
    }, []);

    // Update status with memoized callback
    const updateStatus = useCallback(() => {
        setStatusData(prev => {
            if (prev.new.trim() !== "") {
                return {
                    ...prev,
                    current: prev.new,
                    new: "",
                    isEditing: false,
                    showEmojis: false
                };
            }
            return {
                ...prev,
                new: "",
                isEditing: false,
                showEmojis: false
            };
        });
    }, []);

    // Handle cancel button
    const handleCancel = useCallback(() => {
        setStatusData(prev => ({
            ...prev,
            isEditing: false,
            showEmojis: false
        }));
    }, []);

    // Handle edit button
    const handleEdit = useCallback(() => {
        setStatusData(prev => ({
            ...prev,
            isEditing: true
        }));
    }, []);

    // Handle emoji menu outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusData.showEmojis && 
                emojiMenuRef.current && 
                !emojiMenuRef.current.contains(event.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target)) {
                setStatusData(prev => ({
                    ...prev,
                    showEmojis: false
                }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [statusData.showEmojis]);

    // Render badge item - extracted for clarity
    const renderBadgeItem = (badge) => (
        <div key={badge.id} className="badge-item">
            <img src={badge.image} alt={badge.name} className="badge-image" />
            <p className="badge-name">{badge.name}</p>
        </div>
    );

    // Render activity item - extracted for clarity
    const renderActivityItem = (activity) => (
        <div key={activity.id} className="activity-item">
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-details">
                <p className="activity-title">{activity.title}</p>
                <p className="activity-date">{activity.date}</p>
            </div>
        </div>
    );

    // Render quick emoji buttons - extracted for clarity
    const renderQuickEmojis = () => (
        <div className="quick-emojis">
            {quickEmojis.map((emoji, index) => (
                <button 
                    key={index}
                    className="quick-emoji-btn"
                    onClick={() => insertEmoji(emoji)}
                    type="button"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );

    return (
        <div className="profile-page-container">
            <div className="profile-page">
                {/* Cover Section with Profile Info */}
                <div className="cover-section">
                    <div className="profile-info">
                        <div className="profile-image">
                            <img src={userIcon} className="rounded-circle" alt="Profile" />
                        </div>
                        <div className="profile-details">
                            <h3 className="profile-name">John Doe</h3>
                            <p className="profile-bio">Frontend Developer. Passionate about UI/UX and React.</p>
                        </div>
                    </div>
                </div>

                {/* Profile Content - Two Column Layout */}
                <div className="profile-content">
                    <div className="content-container">
                        {/* Left Column - Information and Badges */}
                        <div className="left-column">
                            <div className="card">
                                <div className="card-header">Information</div>
                                <div className="card-body">
                                    <p><strong>Email:</strong> john.doe@example.com</p>
                                    <p><strong>Location:</strong> New York, USA</p>
                                    <p><strong>Joined:</strong> January 2022</p>
                                </div>
                            </div>

                            <div className="profile-panel badges-section">
                                <h4>🏆 Badges Earned</h4>
                                <div className="badges-grid">
                                    {badges.map(renderBadgeItem)}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Status and Activity */}
                        <div className="right-column">
                            <div className="profile-panel status-section">
                                <h4>Custom Status</h4>
                                {statusData.isEditing ? (
                                    <div className="status-edit-container">
                                        <div className="textarea-with-emoji">
                                            <textarea
                                                ref={textareaRef}
                                                className="status-input"
                                                value={statusData.new}
                                                onChange={(e) => setStatusData(prev => ({...prev, new: e.target.value}))}
                                                placeholder="What's on your mind?"
                                            ></textarea>
                                            <div className="emoji-button-container">
                                                <button 
                                                    ref={emojiButtonRef}
                                                    type="button"
                                                    className="emoji-button"
                                                    onClick={toggleEmojiMenu}
                                                >
                                                    😊
                                                </button>
                                                
                                                {statusData.showEmojis && (
                                                    <div 
                                                        className="emoji-menu" 
                                                        ref={emojiMenuRef}
                                                    >
                                                        <EmojiPicker 
                                                            onEmojiClick={insertEmoji} 
                                                            searchDisabled={false}
                                                            theme="light"
                                                            skinTonesDisabled={true}
                                                            previewConfig={{ showPreview: false }}
                                                            lazyLoadEmojis={true}
                                                            width={300}
                                                            height={400}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Quick emoji access */}
                                        {renderQuickEmojis()}
                                        
                                        <div className="status-buttons">
                                            <button className="btn-save" onClick={updateStatus}>
                                                Save
                                            </button>
                                            <button
                                                className="btn-cancel"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="status-container">
                                        <div className="status-display" onClick={handleEdit}>
                                            {statusData.current || "Click here to update your status..."}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Recent Activity Section */}
                            <div className="profile-panel activity-section">
                                <h4>Recent Activity</h4>
                                <div className="activity-list">
                                    {recentActivities.map(renderActivityItem)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
