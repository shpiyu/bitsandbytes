// Import blog posts
import { blogPosts } from './blogPosts.js';

// Function to load and parse markdown content
async function loadMarkdown(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) return null;
        return await response.text();
    } catch (error) {
        console.error('Error loading markdown:', error);
        return null;
    }
}

// Simple markdown to HTML converter for basic formatting
function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
        // Line breaks
        .replace(/\n/gim, '<br>');
}

// Extract first image from markdown content
function extractFirstImage(markdown) {
    if (!markdown) return null;
    const imageMatch = markdown.match(/!\[([^\]]*)\]\(([^\)]*)\)/);
    return imageMatch ? imageMatch[2] : null;
}

// Create excerpt from markdown content
function createExcerpt(markdown, maxLength = 200) {
    if (!markdown) return '';
    
    // Remove markdown formatting for clean excerpt
    const cleanText = markdown
        .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '') // Remove images
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '$1') // Convert links to text
        .replace(/[#*`]/g, '') // Remove markdown symbols
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
    
    return cleanText.length > maxLength 
        ? cleanText.substring(0, maxLength) + '...'
        : cleanText;
}

// Load and display blog posts
async function loadBlogPosts() {
    const container = document.getElementById('blog-posts');
    if (!container) return;

    // Filter out pages that shouldn't be on home page
    const regularPosts = blogPosts.filter(post => !post.hideOnHomePage);

    for (const post of regularPosts) {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        
        postElement.innerHTML = `
            <h2><a href="post.html?post=${post.slug}">${post.title}</a></h2>
            <div class="meta">Published on ${new Date(post.date).toLocaleDateString()}</div>
            ${post.image ? `<img src="${post.image}" alt="Blog post image" />` : ''}
            <div class="excerpt">${post.excerpt}</div>
        `;
        
        container.appendChild(postElement);
    }
}

// Initialize the blog when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);