window.addEventListener("DOMContentLoaded", async() => {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) return location.replace("/");

    try {
        // Fetch blog
        const res = await fetch(`/api/blogs/${blogId}`);
        const blog = await res.json();

        if (!blog || !blog._id) return location.replace("/");

        displayBlog(blog);

        // Add Edit & Delete functionality using event delegation
        document.querySelector('.blog-actions').addEventListener('click', async(e) => {
            if (e.target.classList.contains('edit-btn')) {
                window.location.href = `/editor.html?id=${blog._id}`;
            }
            if (e.target.classList.contains('delete-btn')) {
                if (!confirm("Are you sure you want to delete this blog?")) return;

                try {
                    const res = await fetch(`/api/blogs/${blog._id}`, { method: "DELETE" });
                    const data = await res.json();
                    if (res.ok) {
                        alert(data.message || "Blog deleted!");
                        window.location.href = "/"; // redirect home
                    } else {
                        alert(data.error || "Failed to delete blog");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error deleting blog");
                }
            }
        });

        loadRelatedBlogs(blog._id);

    } catch (err) {
        console.error("Error loading blog:", err);
    }
});

function displayBlog(blog) {
    const banner = document.querySelector('.banner');
    const titleEl = document.querySelector('.title');
    const publishedEl = document.querySelector('.published span');
    const articleEl = document.querySelector('.article');

    banner.style.backgroundImage = `url(${blog.bannerImage || 'img/default.png'})`;
    titleEl.textContent = blog.title;
    publishedEl.textContent = blog.publishedAt || "Unknown";
    document.title = `Blog : ${blog.title}`;

    articleEl.innerHTML = "";
    blog.content.split("\n").filter(Boolean).forEach(line => {
        if (line.startsWith("#")) {
            let hCount = line.match(/^#+/)[0].length;
            articleEl.innerHTML += `<h${hCount}>${line.slice(hCount)}</h${hCount}>`;
        } else if (line.startsWith("![") && line.includes("](")) {
            let sep = line.indexOf("](");
            let alt = line.slice(2, sep);
            let src = line.slice(sep + 2, line.length - 1);
            articleEl.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
        } else {
            articleEl.innerHTML += `<p>${line}</p>`;
        }
    });
}

// Optional: load related blogs
async function loadRelatedBlogs(currentId) {
    try {
        const res = await fetch("/api/blogs");
        const blogs = await res.json();
        const section = document.querySelector('.blogs-section');

        section.innerHTML = "";

        blogs.filter(b => b._id !== currentId).slice(0, 3).forEach(blog => {
            section.innerHTML += `
                <div class="blog-card">
                    <img src="${blog.bannerImage || 'img/default.png'}" class="blog-image" alt="">
                    <h1 class="blog-title">${truncate(blog.title, 60)}</h1>
                    <p class="blog-overview">${truncate(blog.content, 100)}</p>
                    <p class="published">Published at: ${blog.publishedAt || 'Unknown'}</p>
                    <a href="/blog.html?id=${blog._id}" class="btn dark">Read More</a>
                </div>
            `;
        });
    } catch (err) {
        console.error(err);
    }
}

function truncate(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}