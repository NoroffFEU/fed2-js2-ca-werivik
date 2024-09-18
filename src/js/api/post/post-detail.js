import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function fetchPostDetails(id) {
    
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error("No authentication token found.");
        }

        const requestHeaders = headers(token);
        const response = await fetch(`${API_SOCIAL_POSTS}/${id}?_author=true&_comments=true&_reactions=true`, {
            method: 'GET',
            headers: requestHeaders
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const post = await response.json();
        
        return post.data;
    } 
    
    catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
}

async function renderPostDetails() {
    
    try {
        const post = await fetchPostDetails(postId);
        const postDetailContainer = document.querySelector('.post-detail');

        if (!postDetailContainer) {
            console.error('Post detail container not found.');
            
            return;
        }

        if (!post) {
            postDetailContainer.innerHTML = '<p>No post found.</p>';
           
            return;
        }

        const username = post.author ? post.author.name : 'Unknown User';
        const commentsCount = post._count ? post._count.comments : 0;
        const reactionsCount = post._count ? post._count.reactions : 0;

        const postHtml = `
        <div class="post-detail-content">
            <h2>${post.title || 'Untitled'}</h2>
    
            <div class="post-creater">
                <h3><a href="/profile/single-profile/index.html?name=${encodeURIComponent(post.author.name)}">${username}</a></h3>
                <p>Created: ${new Date(post.created).toLocaleDateString()}</p>
                ${post.updated ? `<p>Updated: ${new Date(post.updated).toLocaleDateString()}</p>` : ''}
            </div>
    
            <p>${post.body || 'No content available.'}</p>
    
            <div class="post-media">
                ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" />` : ''}
            </div>
    
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
            </div>
    
            <div class="post-meta">
                <p>Comments: ${commentsCount}</p>
                <p>Reactions: ${reactionsCount}</p>
            </div>
        </div>
    `;
    
        postDetailContainer.innerHTML = postHtml;

    } 
    
    catch (error) {
        const postDetailContainer = document.querySelector('.post-detail');
        postDetailContainer.innerHTML = '<p>Failed to load post. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', renderPostDetails);
