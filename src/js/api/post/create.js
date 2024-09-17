//export async function createPost({ title, body, tags, media }) {}

import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

export async function createPost({ title, body = '', tags = [], media = {} }) {
    try {
        const mediaData = media.url ? { url: media.url, alt: media.alt || '' } : undefined;

        const postData = {
            title,
            body,
            tags,
            media: mediaData
        };

        const options = {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(postData)
        };

        const response = await fetch(API_SOCIAL_POSTS, options);
        
        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.statusText}`);
        }

        const data = await response.json();
        return data:
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
            const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
            const mediaUrl = document.getElementById('postMediaUrl').value;
            const mediaAlt = document.getElementById('postMediaAlt').value;

            try {
                const postData = {
                    title,
                    body,
                    tags,
                    media: {
                        url: mediaUrl,
                        alt: mediaAlt
                    }
                };

                const result = await createPost(postData);
                console.log('Post created successfully:', result);
            } 
            
            catch (error) {
                console.error('Error submitting post form:', error);
                alert('Failed to create post. Please try again.');
            }
        });
    }
});
