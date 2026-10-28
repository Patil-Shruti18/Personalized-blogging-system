// ----------------- Select DOM Elements -----------------
const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
const bannerImageInput = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');
const loadingOverlay = document.getElementById('loading-overlay');

let bannerPath;
let isDirty = false; // Track unsaved changes

// ----------------- Track Changes -----------------
[blogTitleField, articleField, bannerImageInput].forEach(el => {
    el.addEventListener('input', () => isDirty = true);
});

// ----------------- Image Upload -----------------
bannerImageInput.addEventListener('change', () => uploadImage(bannerImageInput, "banner"));
uploadInput.addEventListener('change', () => uploadImage(uploadInput, "image"));

function uploadImage(uploadFile, uploadType) {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formData = new FormData();
        formData.append('image', file);

        fetch('/upload', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (uploadType === "image") {
                    insertImageInArticle(data.filePath, file.name);
                } else {
                    bannerPath = `${location.origin}/${data.filePath}`;
                    banner.style.backgroundImage = `url("${bannerPath}")`;
                }
                isDirty = true;
            })
            .catch(err => console.error(err));
    } else {
        alert("Please upload an image file only.");
    }
}

function insertImageInArticle(path, alt) {
    const curPos = articleField.selectionStart;
    articleField.value = articleField.value.slice(0, curPos) +
        `\r![${alt}](${path})\r` +
        articleField.value.slice(curPos);
    isDirty = true;
}

// ----------------- Load Existing Blog -----------------
const blogId = new URLSearchParams(window.location.search).get("id");
if (blogId) {
    loadingOverlay.classList.remove('hidden');

    fetch(`/api/blogs/${blogId}`)
        .then(res => res.json())
        .then(data => {
            blogTitleField.value = data.title;
            articleField.value = data.content;
            if (data.bannerImage) {
                bannerPath = data.bannerImage.startsWith("http") ?
                    data.bannerImage :
                    `${location.origin}/${data.bannerImage}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
        .catch(err => {
            console.error(err);
            alert("Failed to load blog");
        })
        .finally(() => {
            loadingOverlay.classList.add('hidden'); // Hide overlay
        });
} else {
    loadingOverlay.classList.add('hidden'); // Hide overlay if creating new blog
}

// ----------------- Publish / Update Blog -----------------
publishBtn.addEventListener('click', async() => {
    if (!blogTitleField.value || !articleField.value) {
        alert("Title and content cannot be empty.");
        return;
    }

    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const blogData = {
        title: blogTitleField.value,
        content: articleField.value,
        bannerImage: bannerPath,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    };

    try {
        let res, result;
        if (blogId) {
            // Update existing blog
            res = await fetch(`/api/blogs/${blogId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData)
            });
            result = await res.json();
            if (res.ok) {
                alert("Blog updated successfully!");
                isDirty = false;
                window.location.href = `/blog.html?id=${result._id}`;
            } else {
                alert(result.error || "Failed to update blog.");
            }
        } else {
            // Create new blog
            res = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData)
            });
            result = await res.json();
            if (res.ok) {
                isDirty = false;
                window.location.href = `/blog.html?id=${result._id}`;
            } else {
                alert(result.error || "Failed to publish blog.");
            }
        }
    } catch (err) {
        console.error(err);
        alert("Error publishing/updating blog.");
    }
});

// ----------------- Warn Before Leaving -----------------
window.addEventListener("beforeunload", (e) => {
    if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
    }
});