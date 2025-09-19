// Blog configuration constants
const BLOG_CONFIG = {
    title: "Bits and Bytes",
    subtitle: "A collection of my thoughts",
    email: "piyushranjan95@gmail.com",
    author: "Piyush Ranjan",
    baseUrl: "https://shpiyu.github.io/bitsandbytes/",
    
    // Navigation items
    navigation: [
        { name: "Home", href: "index.html", id: "home" },
        { name: "About", href: "post.html?post=about", id: "about" }
    ],
    
    // About page content
    aboutContent: "Welcome to Bits and Bytes! This is a space where I share my thoughts, discoveries, and insights about technology, programming, and the ever-evolving digital landscape. Whether you're a fellow developer, tech enthusiast, or just curious about the world of code, I hope you'll find something interesting here. Join me as we explore the fascinating intersection of creativity and logic that makes up our digital world."
};

// Function to update page title
function updatePageTitle(pageTitle = '') {
    const title = pageTitle ? `${pageTitle} - ${BLOG_CONFIG.title}` : BLOG_CONFIG.title;
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = title;
    }
    document.title = title;
}

// Function to populate header
function populateHeader() {
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    
    if (headerTitle) {
        headerTitle.textContent = BLOG_CONFIG.title;
        headerTitle.href = BLOG_CONFIG.navigation[0].href;
    }
    
    if (headerSubtitle) {
        headerSubtitle.textContent = BLOG_CONFIG.subtitle;
    }
}

// Function to populate navigation
function populateNavigation(currentPage = '') {
    const navList = document.querySelector('nav ul');
    if (!navList) return;
    
    navList.innerHTML = '';
    
    // Check if we're on the about post page
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    const isAboutPost = postSlug === 'about';
    
    BLOG_CONFIG.navigation.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.name;
        
        // Set active state
        if (currentPage === item.id || (item.id === 'about' && isAboutPost)) {
            a.classList.add('active');
        }
        
        li.appendChild(a);
        navList.appendChild(li);
    });
}

// Function to populate footer
function populateFooter() {
    const contactEmail = document.getElementById('contact-email');
    if (contactEmail) {
        contactEmail.href = `mailto:${BLOG_CONFIG.email}`;
        contactEmail.textContent = BLOG_CONFIG.email;
    }
}

// Initialize page with constants
function initializePage(currentPage = '', pageTitle = '') {
    updatePageTitle(pageTitle);
    populateHeader();
    populateNavigation(currentPage);
    populateFooter();
}

// Export for use in other files
export { BLOG_CONFIG, initializePage };