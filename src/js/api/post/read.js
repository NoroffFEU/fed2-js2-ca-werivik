//export async function readPost(id) {}
//export async function readPosts(limit = 12, page = 1, tag) {}
//export async function readPostsByUser(username, limit = 12, page = 1, tag) {}

import { API_SOCIAL_POSTS } from "../constants.js";
import { headers } from "../headers.js";

let currentPage = 1;
const postsPerPage = 12;


/**
Fetches posts from the API with pagination, fancy, including author data.
@param {number} [page=1] - The current page number to fetch posts for.
@returns {Promise<Object[]>} - An array of post objects, sorted by creation date.
@throws {Error} - Throws an error if the fetch request fails or the token is not found.
 */

export async function readPosts(page = 1) {
   
    try {
        
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        console.log("Retrieved Token:", token);

        if (!token) {
            console.error('No authentication token found');
            return null;
        }

        const response = await fetch(`${API_SOCIAL_POSTS}?_author=true&page=${page}&limit=${postsPerPage}`, {
            method: 'GET',
            headers: headers(token)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        const sortedPosts = (Array.isArray(data.data) ? data.data : []).sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
        });

        return sortedPosts;
    } 
    
    catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}


/**
Updates the pagination controls based on the total number of pages, doing some complicated math here guys...
@param {number} totalPages - The total number of pages available.
 */

function updatePaginationControls(totalPages) {
   
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        
        if (i === currentPage) {
            pageNumbersContainer.innerHTML += `<span>${i}</span>`;
        } 
        
        else {
            pageNumbersContainer.innerHTML += `<button class="page-number">${i}</button>`;
        }
    }

    document.querySelectorAll('.page-number').forEach(button => {
        button.addEventListener('click', (event) => {
            const pageNumber = parseInt(event.target.textContent, 10);
            
            if (pageNumber !== currentPage) {
                currentPage = pageNumber;
                loadPosts();
            }
        });
    });
}


/**
Loads and displays posts on the page.
@throws {Error} - If the posts cannot be loaded or displayed.
 */
async function loadPosts() {
    
    try {
        const posts = await readPosts(currentPage);
        const postsContainer = document.querySelector('.all-posts');

        if (!postsContainer) {
            console.error('Posts container not found.');
            
            return;
        }

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available.</p>';
            
            return;
        }

        const postsHtml = posts.map(post => {
            const username = post.author ? post.author.name : 'Unknown User';

            return `

                <div class="post" id="post-${post.id}" data-id="${post.id}">
                    <div class="post-creater">
                        <h3>${username}</h3>
                    </div>
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
                        <p>Comments: ${post._count.comments}</p>
                        <p>Reactions: ${post._count.reactions}</p>
                    </div>
                </div>
            `;
        }).join('');

        postsContainer.innerHTML = postsHtml;

        document.querySelectorAll('.post').forEach(postElement => {
            
            postElement.addEventListener('click', (event) => {
                const postId = postElement.getAttribute('data-id');
                window.location.href = `/post/single-post/index.html?id=${postId}`;
            });
        });

        updatePaginationControls(Math.ceil(100 / postsPerPage));
    } 
    
    catch (error) {
        console.error('Error displaying posts:', error);
        postsContainer.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    document.getElementById('prevPage').addEventListener('click', () => {
        
        if (currentPage > 1) {
            currentPage--;
            loadPosts();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        loadPosts();
    });

});

