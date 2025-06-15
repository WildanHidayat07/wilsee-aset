// File: /assets/js/app.js
// Pusat kendali JavaScript untuk semua interaksi di Wilsee v2.1

document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // Fitur 1: Menangani Aksi Like pada Postingan
    // =======================================================
    document.body.addEventListener('click', function(event) {
        const likeButton = event.target.closest('.like-btn');
        if (likeButton) {
            const postId = likeButton.dataset.postId;
            const icon = likeButton.querySelector('i');
            const likeCountSpan = document.querySelector(`.like-count-number[data-post-id="${postId}"]`);

            fetch('/api/like_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update ikon
                    if (data.liked) {
                        icon.classList.remove('bx-heart');
                        icon.classList.add('bxs-heart', 'liked');
                    } else {
                        icon.classList.remove('bxs-heart', 'liked');
                        icon.classList.add('bx-heart');
                    }
                    // Update jumlah like secara real-time
                    if (likeCountSpan && data.new_like_count !== undefined) {
                        likeCountSpan.textContent = data.new_like_count;
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // =======================================================
    // Fitur 2: Menangani Aksi Follow di Halaman Profil
    // =======================================================
    const followButton = document.getElementById('followBtn');
    if (followButton) {
        followButton.addEventListener('click', function() {
            const profileUserId = this.dataset.userId;
            fetch('/api/follow_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile_user_id: profileUserId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const followerCountSpan = document.getElementById('follower-count');
                    if (data.is_following) {
                        this.textContent = 'Mengikuti';
                        this.classList.remove('follow');
                        this.classList.add('unfollow');
                    } else {
                        this.textContent = 'Ikuti';
                        this.classList.remove('unfollow');
                        this.classList.add('follow');
                    }
                    if (followerCountSpan && data.new_follower_count !== undefined) {
                        followerCountSpan.textContent = data.new_follower_count;
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // =======================================================
    // Fitur 3: Menangani Aksi Pengiriman Komentar
    // =======================================================
    document.body.addEventListener('submit', function(event) {
        if (event.target.matches('.comment-form')) {
            event.preventDefault(); 

            const form = event.target;
            const postId = form.dataset.postId;
            const commentInput = form.querySelector('.comment-input');
            const commentText = commentInput.value.trim();
            const commentList = document.querySelector(`.comment-list[data-post-id="${postId}"]`);
            const commentCountSpan = document.querySelector(`.action-count[data-post-id="${postId}"]`);

            if (commentText === '' || !commentList) return;

            fetch('/api/comment_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, comment_text: commentText })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const newComment = document.createElement('div');
                    newComment.classList.add('comment-item');
                    
                    const userLink = document.createElement('a');
                    userLink.href = `/index.php?page=profile&user=${data.comment.username}`;
                    userLink.className = 'post-username-link';
                    userLink.innerHTML = `<strong>${data.comment.username}</strong>`;

                    const commentSpan = document.createElement('span');
                    commentSpan.textContent = ` ${data.comment.comment_text}`;

                    newComment.appendChild(userLink);
                    newComment.appendChild(commentSpan);
                    
                    commentList.appendChild(newComment);
                    commentInput.value = '';

                    // Update jumlah komentar secara real-time
                    if (commentCountSpan) {
                        const currentCount = parseInt(commentCountSpan.textContent, 10);
                        commentCountSpan.textContent = currentCount + 1;
                    }
                } else {
                    alert(data.message || 'Gagal mengirim komentar.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // =======================================================
    // Fitur 4: Menangani Show/Hide Bagian Komentar
    // =======================================================
    document.body.addEventListener('click', function(event) {
        const commentIcon = event.target.closest('.comment-icon-toggle');
        if (commentIcon) {
            event.preventDefault();
            const postId = commentIcon.dataset.postId;
            const commentSection = document.querySelector(`.comment-section[data-post-id="${postId}"]`);
            if (commentSection) {
                commentSection.classList.toggle('show');
            }
        }
    });

});
