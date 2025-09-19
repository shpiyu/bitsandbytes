// Blog post configuration
const blogPosts = [
    {
        title: "Welcome to Bits and Bytes",
        date: "2024-01-15",
        file: "posts/welcome.md",
        excerpt: "Welcome to my new blog! Here's what you can expect to find as we explore the fascinating world of technology together."
    },
    {
        title: "Getting Started with JavaScript",
        date: "2024-01-10", 
        file: "posts/javascript-basics.md",
        excerpt: "A beginner's guide to JavaScript fundamentals, covering variables, functions, and basic programming concepts."
    }
];

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

    for (const post of blogPosts) {
        const markdown = await loadMarkdown(post.file);
        const firstImage = extractFirstImage(markdown);
        const excerpt = markdown ? createExcerpt(markdown) : post.excerpt;

        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <div class="meta">Published on ${new Date(post.date).toLocaleDateString()}</div>
            ${firstImage ? `<img src="${firstImage}" alt="Blog post image" />` : ''}
            <div class="excerpt">${excerpt}</div>
        `;
        
        container.appendChild(postElement);
    }
}

// Initialize the blog when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);