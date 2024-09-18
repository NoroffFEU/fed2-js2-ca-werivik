import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {
    const nameDiv = document.getElementById("name");
    const emailDiv = document.getElementById("email");
    const bannerDiv = document.getElementById("banner");
    const bioDiv = document.getElementById("bio");
    const avatarImg = document.getElementById("avatar");
    const makePostButton = document.getElementById('makePost');

    if (!nameDiv || !emailDiv || !bannerDiv || !bioDiv || !avatarImg) {
        console.error("One or more required elements not found.");
        return;
    }

    const fetchUserData = async () => {
        
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
          
            if (!token) {
                console.error('No authentication token found');
                return null;
            }

            const username = localStorage.getItem('username');
           
            if (!username) {
                console.error('No username found');
                return null;
            }

            const endpoint = `${API_SOCIAL_PROFILES}/${username}`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: headers(token),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user information');
            }

            const data = await response.json();
            
            return data;
        } 
        
        catch (error) {
            console.error('Error fetching user information:', error);
            return null;
        }
    };

    const updateUserInfo = async () => {
       
        const data = await fetchUserData();
        
        if (data && data.data) {
            const userData = data.data;

            if (nameDiv) {
                nameDiv.textContent = userData.name || 'No name available';
            }

            if (emailDiv) {
                emailDiv.textContent = userData.email || 'No email available';
            }

            if (bannerDiv && userData.banner) {
                bannerDiv.style.backgroundImage = `url(${userData.banner.url})`;
            }

            if (bioDiv) {
                bioDiv.textContent = userData.bio ? userData.bio : 'No bio yet...';
            }

            if (avatarImg) {
                if (userData.avatar && userData.avatar.url) {
                    avatarImg.src = userData.avatar.url;
                    avatarImg.alt = userData.avatar.alt || 'User avatar';
                    avatarImg.style.display = 'block'; 
                } 
                else {
                    avatarImg.style.display = 'none';
                }
            }
            
            localStorage.setItem('authToken', userData.accessToken);
        } 
        else {
            console.error("Invalid data format received from API or failed to fetch data");
        }
    };

    updateUserInfo();

    if (makePostButton) {
      
        makePostButton.addEventListener('click', () => {
            window.location.href = '/post/create/index.html';
        });
    }

});
