// Blog post configuration (same as in script.js)
const blogPosts = [
    {
        title: "About",
        date: "2024-01-01",
        file: "posts/about.md",
        slug: "about",
        excerpt: "Learn more about this blog and what you can expect to find here.",
        isAbout: true // Special flag to identify about post
    },
    {
        title: "Welcome to Bits and Bytes",
        date: "2024-01-15",
        file: "posts/welcome.md",
        slug: "welcome-to-bits-and-bytes",
        excerpt: "Welcome to my new blog! Here's what you can expect to find as we explore the fascinating world of technology together.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
    },
    {
        title: "Getting Started with JavaScript",
        date: "2024-01-10", 
        file: "posts/javascript-basics.md",
        slug: "getting-started-with-javascript",
        excerpt: "A beginner's guide to JavaScript fundamentals, covering variables, functions, and basic programming concepts."
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
function getMarkdownContent(filename) {
    // Since we can't use fetch for local files, we'll embed the content
    const markdownContent = {
        'posts/about.md': `# About

Welcome to **Bits and Bytes**! This is a space where I share my thoughts, discoveries, and insights about technology, programming, and the ever-evolving digital landscape. 

Whether you're a fellow developer, tech enthusiast, or just curious about the world of code, I hope you'll find something interesting here. Join me as we explore the fascinating intersection of creativity and logic that makes up our digital world.

## What You'll Find Here

This blog is my corner of the internet where I document my journey through:

- **Programming tutorials** and practical guides
- **Technology insights** and industry trends
- **Project showcases** and code walkthroughs  
- **Personal experiences** in the tech world
- **Tips and tricks** I've learned along the way

## My Background

I'm passionate about building things with code and sharing knowledge with the developer community. From web development to system architecture, I enjoy exploring different aspects of technology and breaking down complex concepts into digestible insights.

## Let's Connect

Feel free to reach out if you have questions, suggestions, or just want to chat about technology. I'm always excited to connect with fellow developers and learn from different perspectives.

Thanks for stopping by, and I hope you find something valuable here!`,

        'posts/welcome.md': `# Welcome to Bits and Bytes

![Welcome Image](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop)

Hello and welcome to **Bits and Bytes**! I'm excited to share this digital space with you where we'll explore the fascinating world of technology, programming, and everything in between.

## What You Can Expect

This blog is my corner of the internet where I'll be sharing:

- **Programming tutorials** and tips
- **Technology insights** and trends  
- **Project showcases** and code walkthroughs
- **Personal experiences** in the tech world

## Why "Bits and Bytes"?

The name reflects my passion for the fundamental building blocks of our digital world. Every application, every website, every digital experience we have ultimately comes down to these simple units of information.

## Join the Journey

Whether you're a seasoned developer, just starting your coding journey, or simply curious about technology, I hope you'll find something valuable here. Feel free to reach out with questions, suggestions, or just to say hello!

Thanks for stopping by, and welcome to the adventure!`,

        'posts/javascript-basics.md': `# Getting Started with JavaScript

JavaScript is the language that powers the modern web. Whether you're building interactive websites, mobile apps, or even server-side applications, JavaScript is an essential skill for any developer.

## What is JavaScript?

JavaScript is a **high-level, interpreted programming language** that was originally created to make web pages interactive. Today, it's used everywhere from browsers to servers to mobile applications.

## Your First JavaScript Code

Let's start with the classic "Hello, World!" example:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Variables and Data Types

JavaScript has several built-in data types:

- **Numbers**: \`let age = 25;\`
- **Strings**: \`let name = "Alice";\`
- **Booleans**: \`let isActive = true;\`
- **Arrays**: \`let colors = ["red", "green", "blue"];\`
- **Objects**: \`let person = { name: "Bob", age: 30 };\`

## Functions

Functions are reusable blocks of code:

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("World"));
\`\`\`

## Next Steps

This is just the beginning! JavaScript has much more to offer including:

- Event handling
- DOM manipulation  
- Asynchronous programming
- Modern ES6+ features

Stay tuned for more JavaScript tutorials and happy coding!`
    };
    
    return markdownContent[filename] || null;
}

// Load and display blog post
function loadBlogPost() {
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
    const markdownContent = getMarkdownContent(post.file);
    
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
document.addEventListener('DOMContentLoaded', function() {
    initializePage('', 'Blog Post');
    
    // Set back to home link
    const backLink = document.getElementById('back-to-home-link');
    if (backLink) {
        backLink.href = BLOG_CONFIG.navigation[0].href;
    }
    
    loadBlogPost();
});