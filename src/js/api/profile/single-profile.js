import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('name');

async function fetchProfile(name) {
    
    try {

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error("No authentication token found.");
        }

        const requestHeaders = headers(token);
        const response = await fetch(`${API_SOCIAL_PROFILES}/${encodeURIComponent(name)}?_posts=true`, {
            method: 'GET',
            headers: requestHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const profile = await response.json();
        
        console.log("Profile Data:", profile); 
      
        return profile.data;
    } 
    
    catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

async function fetchUserPosts(name) {
    
    try {

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error("No authentication token found.");
        }

        const requestHeaders = headers(token);
        const response = await fetch(`${API_SOCIAL_PROFILES}/${encodeURIComponent(name)}/posts`, {
            method: 'GET',
            headers: requestHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User Posts Data:", data);

        return Array.isArray(data.data) ? data.data : [];
    } 
    
    catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
}

async function renderProfile() {
    
    try {
        const profile = await fetchProfile(username);
        const profileDetailContainer = document.querySelector('.profile-detail');
        const userPostsContainer = document.querySelector('.user-posts');

        if (!profileDetailContainer || !userPostsContainer) {
            console.error('Profile or posts container not found.');
            
            return;
        }

        if (!profile) {
            profileDetailContainer.innerHTML = '<p>No profile found.</p>';
            
            return;
        }

        document.title = profile.name ? `${profile.name}'s Profile` : 'User Profile';

        const profileHtml = `

            <div class="profile-content">
                <h2>${profile.name || 'No name available'}</h2>
                <div class="profile-banner">
                    ${profile.banner ? `<img src="${profile.banner.url}" alt="${profile.banner.alt}" />` : 'No banner available'}
                </div>
                <div class="profile-avatar">
                    ${profile.avatar ? `<img src="${profile.avatar.url}" alt="${profile.avatar.alt}" />` : 'No avatar available'}
                </div>
                <p>${profile.bio || 'No bio available.'}</p>
                <p>Email: ${profile.email || 'No email available.'}</p>
                <p>Posts: ${profile._count ? profile._count.posts : 0}</p>
                <p>Followers: ${profile._count ? profile._count.followers : 0}</p>
                <p>Following: ${profile._count ? profile._count.following : 0}</p>
            </div>
        `;

        profileDetailContainer.innerHTML = profileHtml;

        const posts = await fetchUserPosts(username);

        if (posts.length === 0) {
            userPostsContainer.innerHTML = '<p>No posts available.</p>';
            return;
        }

        const postsHtml = posts.map(post => `
            <div class="post" id="post-${post.id}">
                
               <h3><a href="/single-post/index.html?id=${post.id}">${post.title || 'No title available'}</a></h3>
            
                <p>${post.body || 'No content available.'}</p>
                
                <div class="post-media">
                    ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" />` : 'No media available'}
                </div>

                <p>Created: ${post.created ? new Date(post.created).toLocaleDateString() : 'No date available'}</p>
                
                ${post.updated ? `<p>Updated: ${new Date(post.updated).toLocaleDateString()}</p>` : ''}
            
            </div>

        `).join('');

        userPostsContainer.innerHTML = postsHtml;

    } 
    
    catch (error) {
    
        const profileDetailContainer = document.querySelector('.profile-detail');
        profileDetailContainer.innerHTML = '<p>Failed to load profile. Please try again later.</p>';
    }
}


document.addEventListener('DOMContentLoaded', renderProfile);