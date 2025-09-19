// Blog post configuration (same as in script.js)
const blogPosts = [
    {
        title: "About",
        date: "2025-09-20",
        file: "posts/about.md",
        slug: "about",
        excerpt: "Learn more about this blog and what you can expect to find here.",
        isAbout: true // Special flag to identify about post
    },
    {
        title: "Welcome to Bits and Bytes",
        date: "2025-09-20",
        file: "posts/welcome.md",
        slug: "welcome-to-bits-and-bytes",
        excerpt: "Welcome to my new blog! Here's what you can expect to find as we explore the fascinating world of technology together.",
        // image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
    }
];

// Convert title to URL-safe slug
function titleToSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
}

// Enhanced markdown to HTML converter
function markdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown
        // Code blocks (must come before other replacements)
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img alt="$1" src="$2" />')
        // Lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        // Paragraphs (split by double newlines)
        .split('\n\n')
        .map(paragraph => {
            paragraph = paragraph.trim();
            if (!paragraph) return '';

            // Don't wrap headers, lists, code blocks, or images in p tags
            if (paragraph.match(/^<(h[1-6]|ul|ol|li|pre|img|code)/)) {
                return paragraph;
            }

            // Handle lists
            if (paragraph.includes('<li>')) {
                return '<ul>' + paragraph + '</ul>';
            }

            return '<p>' + paragraph + '</p>';
        })
        .join('\n');

    return html;
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load markdown content (static content for local development)
// Load markdown content dynamically
async function loadMarkdownContent(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading markdown:', error);
        return null;
    }
}

// Load and display blog post
async function loadBlogPost() {
    const postSlug = getUrlParameter('post');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const contentEl = document.getElementById('blog-post-content');

    if (!postSlug) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        return;
    }

    // Find the post by slug
    const post = blogPosts.find(p => p.slug === postSlug);

    if (!post) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        return;
    }

    // Get markdown content
    const markdownContent = await loadMarkdownContent(post.file);

    if (!markdownContent) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        return;
    }

    // Convert markdown to HTML
    const htmlContent = markdownToHtml(markdownContent);

    // Update page title
    document.getElementById('page-title').textContent = `${post.title} - ${BLOG_CONFIG.title}`;

    // Display content
    contentEl.innerHTML = `
        <div class="meta">Published on ${new Date(post.date).toLocaleDateString()}</div>
        <div class="content">${htmlContent}</div>
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
            <a href="${BLOG_CONFIG.navigation[0].href}">← Back to Home</a>
        </div>
    `;

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializePage('', 'Blog Post');

    // Set back to home link
    const backLink = document.getElementById('back-to-home-link');
    if (backLink) {
        backLink.href = BLOG_CONFIG.navigation[0].href;
    }

    loadBlogPost();
});