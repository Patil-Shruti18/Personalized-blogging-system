// public/js/home.js
const blogSection = document.querySelector('.blogs-section');

async function loadBlogs() {
    try {
        const res = await fetch("/api/blogs");
        const blogs = await res.json();

        blogSection.innerHTML = "";

        if (!blogs.length) {
            blogSection.innerHTML = "<p>No blogs available yet.</p>";
            return;
        }

        blogs.forEach(blog => {
            blogSection.innerHTML += `
            <div class="blog-card">
                <img src="${blog.bannerImage || 'img/default.png'}" class="blog-image" alt="blog banner">
                <h1 class="blog-title">${truncateText(blog.title, 80)}</h1>
                <p class="blog-overview">${truncateText(blog.content, 200)}</p>
                <p class="published">Published at: ${blog.publishedAt || 'Unknown'}</p>
                <a href="/blog?id=${blog._id}" class="btn dark">Read More</a>
            </div>
            `;
        });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        blogSection.innerHTML = "<p>Error loading blogs.</p>";
    }
}

function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

window.onload = loadBlogs;