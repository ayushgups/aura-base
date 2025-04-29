import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../helper/supabaseClient';
import './Groups.css';

function Groups() {
    const { userid } = useParams();
    const [newGroupName, setNewGroupName] = useState('');
    const [joinGroupId, setJoinGroupId] = useState('');
    const [userGroups, setUserGroups] = useState([]);
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');

    // Fetch user's name from auth metadata
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (user && user.user_metadata && user.user_metadata.displayName) {
                setUserName(user.user_metadata.displayName);
            } else if (authError) {
                console.error('Error fetching auth user:', authError);
            }
        };

        fetchUserData();
        fetchUserGroups();
    }, [userid]);

    // Fetch groups the user is part of
    const fetchUserGroups = async () => {
        const { data, error } = await supabase
            .from('groups')
            .select('*');
        
        if (data) {
            // Filter groups where the user is a member
            const userGroups = data.filter(group => {
                const peopleMap = group.people_map || {};
                return userid in peopleMap;
            });
            setUserGroups(userGroups);
        }
    };

    // Create new group
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        
        if (!newGroupName.trim()) {
            setMessage('Please enter a group name');
            return;
        }

        // Get user's name from auth metadata
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!user || !user.user_metadata || !user.user_metadata.displayName) {
            setMessage('Error fetching user data');
            return;
        }

        const displayName = user.user_metadata.displayName;

        // Create new group with the user as first member
        const { data, error } = await supabase
            .from('groups')
            .insert([
                {
                    group_name: newGroupName,
                    people_map: {
                        [userid]: displayName
                    }
                }
            ])
            .select();

        if (error) {
            setMessage('Error creating group: ' + error.message);
        } else if (data && data[0]) {
            setMessage('Group created successfully! Group ID: ' + data[0].group_id);
            setNewGroupName('');
            fetchUserGroups();
        }
    };

    // Join existing group
    const handleJoinGroup = async (e) => {
        e.preventDefault();

        if (!joinGroupId.trim()) {
            setMessage('Please enter a group ID');
            return;
        }

        // Get user's name from auth metadata
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!user || !user.user_metadata || !user.user_metadata.displayName) {
            setMessage('Error fetching user data');
            return;
        }

        const displayName = user.user_metadata.displayName;

        // First, get the current group data
        const { data: groupData, error: fetchError } = await supabase
            .from('groups')
            .select('*')
            .eq('group_id', joinGroupId)
            .single();

        if (fetchError || !groupData) {
            setMessage('Group not found');
            return;
        }

        // Get current people map
        const currentPeopleMap = groupData.people_map || {};

        // Check if user is already in the group
        if (userid in currentPeopleMap) {
            setMessage('You are already a member of this group');
            return;
        }

        // Add user to the group
        const updatedPeopleMap = {
            ...currentPeopleMap,
            [userid]: displayName
        };
        
        const { error: updateError } = await supabase
            .from('groups')
            .update({ 
                people_map: updatedPeopleMap
            })
            .eq('group_id', joinGroupId);

        if (updateError) {
            setMessage('Error joining group: ' + updateError.message);
        } else {
            setMessage('Successfully joined group!');
            setJoinGroupId('');
            fetchUserGroups();
        }
    };

    // Copy group ID to clipboard
    const handleCopyId = (groupId) => {
        navigator.clipboard.writeText(groupId);
        setMessage('Group ID copied to clipboard!');
    };

    return (
        <div className="groups-container">
            <div className="groups-section">
                <h2>Create New Group</h2>
                <form onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Enter group name"
                    />
                    <button type="submit">Create Group</button>
                </form>
            </div>

            <div className="groups-section">
                <h2>Join Existing Group</h2>
                <form onSubmit={handleJoinGroup}>
                    <input
                        type="text"
                        value={joinGroupId}
                        onChange={(e) => setJoinGroupId(e.target.value)}
                        placeholder="Enter group ID"
                    />
                    <button type="submit">Join Group</button>
                </form>
            </div>

            {message && <div className="message">{message}</div>}

            <div className="groups-section">
                <h2>Your Groups</h2>
                <div className="groups-list">
                    {userGroups.length === 0 ? (
                        <p>You haven't joined any groups yet.</p>
                    ) : (
                        userGroups.map(group => (
                            <div key={group.group_id} className="group-item">
                                <h3>{group.group_name}</h3>
                                <div className="group-id">
                                    <span>Group ID: {group.group_id}</span>
                                    <button onClick={() => handleCopyId(group.group_id)}>
                                        Copy ID
                                    </button>
                                </div>
                                <div className="group-members">
                                    <h4>Members:</h4>
                                    <ul>
                                        {group.people_map && Object.entries(group.people_map).map(([userId, name]) => (
                                            <li key={userId}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Groups; 