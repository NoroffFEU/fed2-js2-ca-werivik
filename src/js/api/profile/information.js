import { API_SOCIAL_PROFILES, API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {

    const nameDiv = document.getElementById("name");
    const emailDiv = document.getElementById("email");
    const bannerDiv = document.getElementById("banner");
    const bioDiv = document.getElementById("bio");
    const avatarImg = document.getElementById("avatar");
    const makePostButton = document.getElementById('makePost');
    const postsContainer = document.getElementById('user-posts');


    /**
    Fetches user data from the API.
    @returns {Promise<Object|null>} User data or null if not found, nothing in between fellas.
     */
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


    /**
    Fetches posts created by a specific user.
    @param {string} username - The username of the user who posted the post to fetch.
    @param {string} token - The authentication token.
    @returns {Promise<Array>} An array of posts.
     */
    const fetchUserPosts = async (username, token) => {
       
        try {
            const endpoint = `${API_SOCIAL_PROFILES}/${username}/posts`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: headers(token),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }

            const data = await response.json();
            return data.data;
        } 
        
        catch (error) {
            console.error('Error fetching user posts:', error);
            return [];
        }
    };


    /**
    Updates the user information displayed on the HTML page.
    @returns {Promise<void>}
     */
    const updateUserInfo = async () => {
        
        const data = await fetchUserData();
        if (data && data.data) {
            const userData = data.data;
            nameDiv.textContent = userData.name || 'No name available';
            emailDiv.textContent = userData.email || 'No email available';
            bannerDiv.style.backgroundImage = userData.banner ? `url(${userData.banner.url})` : '';
            bioDiv.textContent = userData.bio || 'No bio yet...';

            if (userData.avatar && userData.avatar.url) {
                avatarImg.src = userData.avatar.url;
                avatarImg.alt = userData.avatar.alt || 'User avatar';
                avatarImg.style.display = 'block';
            }

            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            const username = localStorage.getItem('username');
            const posts = await fetchUserPosts(username, token);
            displayPosts(posts);
        }
    };


    /**
     Updates a post with the details underneath.
     @param {string} postId - The ID of the post to update.
     @param {string} title - The new title of the post.
     @param {string} body - The new body of the post.
     @param {string} mediaUrl - The new media URL for the post.
     @param {Array<string>} tags - The new tags for the post.
     @returns {Promise<void>}
     */
    const updatePost = async (postId, title, body, mediaUrl, tags) => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const endpoint = `${API_SOCIAL_POSTS}/${postId}`;

        if (!validatePostData(title, body, mediaUrl, tags)) {
            return;
        }

        const postData = {
            title,
            body,
            tags,
        };

        if (mediaUrl) {
            postData.media = {
                url: mediaUrl,
                alt: "Updated media"
            };
        }

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: headers(token),
                body: JSON.stringify(postData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Failed to update post:', responseData.errors || responseData);
                throw new Error('Failed to update post');
            }

            console.log('Post updated successfully:', responseData);
            updateUserInfo();
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
    };


     /**
     Validates the data for the posts.
     @param {string} title - The title of the post.
     @param {string} body - The body of the post.
     @param {string} mediaUrl - The media URL of the post.
     @param {Array<string>} tags - The tags associated with the post.
     @returns {boolean} True if the data is valid, false otherwise.
     */
    const validatePostData = (title, body, mediaUrl, tags) => {
        if (!title || !body) {
            console.error('Title and body are required.');
            return false;
        }

        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

        if (mediaUrl && !urlPattern.test(mediaUrl)) {
            console.error('Invalid media URL.');
            return false;
        }

        if (!Array.isArray(tags)) {
            console.error('Tags should be an array of strings.');
            return false;
        }

        return true;
    };


    /**
     Displays the user's posts on the page.
     @param {Array} posts - The posts to display.
     @returns {void}
     */
    const displayPosts = (posts) => {
       
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available.</p>';
            
            return;
        }

        const postsHtml = posts.map(post => {
            const postMedia = post.media ? `<img src="${post.media.url}" alt="${post.media.alt}">` : '';
            
            return `
                <div class="post" data-id="${post.id}">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    ${postMedia}
                    <p>Tags: ${post.tags.join(', ')}</p>
                    <button class="edit-post-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-post-btn" data-id="${post.id}" data-title="${post.title}">Delete</button>
                    <div class="edit-post-form" style="display:none;">
                        <input type="text" class="edit-title" value="${post.title}" placeholder="New Title">
                        <textarea class="edit-body" placeholder="New Body">${post.body}</textarea>
                        <input type="text" class="edit-media" value="${post.media ? post.media.url : ''}" placeholder="New Media URL">
                        <input type="text" class="edit-tags" value="${post.tags.join(', ')}" placeholder="New Tags (comma separated)">
                        <button class="save-post-btn" data-id="${post.id}">Save Changes</button>
                    </div>
                </div>
            `;
        }).join('');

        postsContainer.innerHTML = postsHtml;

        document.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                const postTitle = e.target.getAttribute('data-title');
                const confirmDelete = confirm(`Are you sure you want to delete "${postTitle}"?`);
                if (confirmDelete) {
                    await deletePost(postId);
                }
                
                else {
                    updateUserInfo();
                }
            });
        });

        document.querySelectorAll('.edit-post-btn').forEach(button => {
           
            button.addEventListener('click', (e) => {
                const postElement = e.target.closest('.post');
                const editForm = postElement.querySelector('.edit-post-form');
                editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
            });

        });

        document.querySelectorAll('.save-post-btn').forEach(button => {
           
            button.addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                const postElement = e.target.closest('.post');
                const newTitle = postElement.querySelector('.edit-title').value;
                const newBody = postElement.querySelector('.edit-body').value;
                const newMediaUrl = postElement.querySelector('.edit-media').value;
                const newTags = postElement.querySelector('.edit-tags').value.split(',').map(tag => tag.trim());

                await updatePost(postId, newTitle, newBody, newMediaUrl, newTags);
            });

        });
    };


    /**
    Deletes a single post by it's ID.
    @param {string} postId - The ID of the post to delete.
    @returns {Promise<void>}
     */
    const deletePost = async (postId) => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const endpoint = `${API_SOCIAL_POSTS}/${postId}`;

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: headers(token),
            });

            if (response.ok) {
                console.log(`Post with ID ${postId} deleted successfully.`);
                updateUserInfo();
            } 
            
            else {
                const responseData = await response.json();
                console.error('Failed to delete post:', responseData.errors || responseData);
            }
        } 
        
        // Define your ass here hehe
        catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    updateUserInfo();

    if (makePostButton) {
        makePostButton.addEventListener('click', () => {
            window.location.href = '/post/create/index.html';
        });
    }
});

