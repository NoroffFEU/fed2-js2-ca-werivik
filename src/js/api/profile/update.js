//export async function updateProfile(username, { avatar, banner }) {}

import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {
    const saveChangesButton = document.getElementById("saveChanges");
    const newUsernameInput = document.getElementById("newUsername");
    const newBioInput = document.getElementById("newBio");
    const newAvatarInput = document.getElementById("newAvatar");
    const newBannerInput = document.getElementById("newBanner");


    /**
    Updates the user's profile information.
    @returns {Promise<void>}
    */
    const updateProfile = async () => {
        
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            if (!token) {
                console.error('No authentication token found');
                alert('Authentication token is missing.');
                
                return;
            }

            const username = localStorage.getItem('username');
            if (!username) {
                console.error('No username found');
                alert('Username is missing.');
                
                return;
            }

            const updatedData = {
                bio: newBioInput.value.trim() || undefined,
                banner: newBannerInput.value.trim() ? { url: newBannerInput.value.trim(), alt: 'User provided banner' } : undefined,
                avatar: newAvatarInput.value.trim() ? { url: newAvatarInput.value.trim(), alt: 'User provided avatar' } : undefined
            };

            if (!updatedData.bio && !updatedData.banner && !updatedData.avatar) {
                alert('At least one property (bio, banner, avatar) must be provided.');
                
                return;
            }

            const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
                method: 'PUT',
                headers: headers(token),
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const responseText = await response.text();
                
                throw new Error(`Failed to update profile: ${responseText}`);
            }

            const data = await response.json();
            console.log('Profile updated successfully:', data);

            alert('Profile updated successfully! Refreshing the page to show updated information...');
            window.location.reload();
        } 
        
        catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', updateProfile);
    }
});
