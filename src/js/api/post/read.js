//export async function readPost(id) {}
//export async function readPosts(limit = 12, page = 1, tag) {}
//export async function readPostsByUser(username, limit = 12, page = 1, tag) {}

import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

fetch('https://v2.api.noroff.dev/social/posts', {
    method: 'GET',
    headers: headers()
  })
  
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
    })

    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

export async function readPosts() {
    
    try {
        const response = await fetch(`${API_SOCIAL_POSTS}?_author=true`, {
            method: 'GET',
            headers: headers()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data = await response.json();
        
        return data.data;
    } 
    
    catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.querySelector('.all-posts');

    if (!postsContainer) {
        console.error('Posts container not found.');
        
        return;
    }

    try {
        const posts = await readPosts();

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available.</p>';
            
            return;
        }

        const postsHtml = posts.map(post => {
            const username = post.author ? post.author.username : 'Unknown User';
            
            return `
                <div class="post" id="post-${post.id}">
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <div class="post-media">
                        ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" />` : ''}
                    </div>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                    </div>
                    <div class="post-meta">
                        <span>Created: ${new Date(post.created).toLocaleDateString()}</span>
                        <span>Updated: ${new Date(post.updated).toLocaleDateString()}</span>
                        <span>Comments: ${post._count.comments}</span>
                        <span>Reactions: ${post._count.reactions}</span>
                        <span>Creator: ${username}</span>
                    </div>
                </div>
            `;
        });

        postsContainer.innerHTML = postsHtml.join('');
    } 
    
    catch (error) {
        console.error('Error displaying posts:', error);
        postsContainer.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
});
