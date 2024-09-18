//export async function createPost({ title, body, tags, media }) {}

import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

export async function createPost({ title, body = '', tags = [], media = {} }) {
    
    try {

        if (!title || !body) {
            throw new Error("Title and body are required.");
        }

        const mediaData = media.url ? { url: media.url, alt: media.alt || '' } : undefined;
       
        const postData = {
            title,
            body,
            tags: tags.length > 0 ? tags : [],
            media: mediaData
        };

        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        if (!token) {
            throw new Error("No authentication token found.");
        }

        const options = {
            method: 'POST',
            headers: headers(token),
            body: JSON.stringify(postData)
        };

        const response = await fetch(API_SOCIAL_POSTS, options);

        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`Failed to create post: ${responseText}`);
        }

        const data = await response.json();
        
        return data;
    } 
    
    catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');

    if (postForm) {
       
        postForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('postTitle').value;
            const body = document.getElementById('postBody').value;
            const rawTags = document.getElementById('postTags').value.trim();
            const mediaUrl = document.getElementById('postMediaUrl').value;
            const mediaAlt = document.getElementById('postMediaAlt').value;

            const tags = rawTags
                .split(' ')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
                .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));

            try {
                const postData = {
                    title,
                    body,
                    tags,
                    media: {
                        url: mediaUrl || null,
                        alt: mediaAlt || ''
                    }
                };

                const result = await createPost(postData);
                console.log('Post created successfully:', result);

                alert('Post created successfully! Redirecting to the posts page...');
                
                window.location.href = '/post/index.html';
            } 
            
            catch (error) {
                console.error('Error submitting post form:', error);
               
                alert(`Failed to create post: ${error.message}`);
            }
        });
    }
});

