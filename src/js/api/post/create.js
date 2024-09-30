//export async function createPost({ title, body, tags, media }) {}

import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";


/**
Creates a new post by sending the post data to the API.
Validates the presence of required fields (title and body tihi) before submission, 
if the user fails to input anything in those fields it will send a error message.

@param {Object} postDetails - The post details to be created.
@param {string} postDetails.title - The title of the post (required >:( ).
@param {string} [postDetails.body=''] - The body content of the post (required >:( ).
@param {Array<string>} [postDetails.tags=[]] - An array of tags associated with the post (optional :) ).
@param {Object} [postDetails.media={}] - Media information including URL and alt text (optional :) ).
@param {string} [postDetails.media.url] - The URL of the media file (optional :) ).
@param {string} [postDetails.media.alt] - The alt text for the media file (optional :) ).
@returns {Promise<Object>} - The created post data from the API.
@throws {Error} - Throws an error if post creation fails or required fields are missing.
*/

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


/**
Initializes the post creation form and handles form submission, slay.
Gathers form data both required and optional, including title, body, tags, and media, and creates a new post.
*/

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');

    if (postForm) {

        /**
        Handles the form submission for creating a new post.
        Prevents default form submission and creates a new post with the form data.
        
        @param {Event} event - The form submission event.
        */
       
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

