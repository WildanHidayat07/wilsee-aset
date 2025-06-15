// File: /assets/js/app.js (Versi Final dengan Perbaikan Komentar)

document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // Fitur 1: Menangani Aksi Like pada Postingan
    // =======================================================
    document.body.addEventListener('click', function(event) {
        const likeButton = event.target.closest('.like-btn');
        if (likeButton) {
            const postId = likeButton.dataset.postId;
            const icon = likeButton.querySelector('i');
            const likeCountSpan = document.querySelector(`.like-count strong[data-post-id="${postId}"]`);

            fetch('/api/like_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
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
            // ... (kode follow handler tetap sama seperti sebelumnya)
        });
    }

    // =======================================================
    // Fitur 3: Menangani Aksi Pengiriman Komentar (SUDAH DIPERBAIKI)
    // =======================================================
    document.body.addEventListener('submit', function(event) {
        if (event.target.matches('.comment-form')) {
            event.preventDefault(); 

            const form = event.target;
            const postId = form.dataset.postId;
            const commentInput = form.querySelector('.comment-input');
            const commentText = commentInput.value.trim();
            const commentList = document.querySelector(`.comment-list[data-post-id="${postId}"]`);

            if (commentText === '' || !commentList) return;

            fetch('/api/comment_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: postId,
                    comment_text: commentText
                })
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
                } else {
                    alert(data.message || 'Gagal mengirim komentar.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

});
