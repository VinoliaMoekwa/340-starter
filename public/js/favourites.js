'use strict';

document.addEventListener('DOMContentLoaded', function () {
  initializeFavorites();
  initializeRemoveButtons();
});

/**
 * FAVORITE TOGGLE BUTTONS
 */
function initializeFavorites() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');

  favoriteButtons.forEach(button => {
    if (button.dataset.loggedIn === 'true') {
      loadFavoriteStatus(button);
    }

    button.addEventListener('click', handleFavoriteClick);
  });
}

async function loadFavoriteStatus(button) {
  const invId = button.dataset.invId;

  try {
    const response = await fetch(`/favorites/status/${invId}`);
    const data = await response.json();

    if (data.isFavorite) {
      button.classList.add('favorited');
      button.textContent = '❤️ Favorited';
    } else {
      button.classList.remove('favorited');
      button.textContent = '🤍 Add to Favorites';
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleFavoriteClick(event) {
  event.preventDefault();

  const button = event.currentTarget;
  const invId = button.dataset.invId;
  const isLoggedIn = button.dataset.loggedIn === 'true';

  if (!isLoggedIn) {
    window.location.href = `/account/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    return;
  }

  button.disabled = true;

  try {
    const response = await fetch('/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inv_id: invId })
    });

    const data = await response.json();

    if (data.success) {
      updateFavoriteButton(button, data.isFavorite);
      updateFavoritesCount(data.favoriteCount);
      showNotification(data.message, 'success');
    } else {
      showNotification(data.message || 'Error', 'error');
    }

  } catch (error) {
    console.error(error);
    showNotification('Something went wrong', 'error');
  } finally {
    button.disabled = false;
  }
}

function updateFavoriteButton(button, isFavorite) {
  if (isFavorite) {
    button.classList.add('favorited');
    button.textContent = '❤️ Favorited';
  } else {
    button.classList.remove('favorited');
    button.textContent = '🤍 Add to Favorites';
  }
}

function updateFavoritesCount(count) {
  const badge = document.querySelector('.favorites-count-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
  }
}

/**
 * REMOVE BUTTONS (on favorites page)
 */
function initializeRemoveButtons() {
  const removeButtons = document.querySelectorAll('.btn-remove');

  removeButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const invId = this.dataset.invId;
      const card = this.closest('.favorite-card');

      if (!confirm('Remove this vehicle from favorites?')) return;

      try {
        const response = await fetch('/favorites/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inv_id: invId })
        });

        const data = await response.json();

        if (data.success) {
          card.remove();
          updateFavoritesCount(data.favoriteCount);
          showNotification('Removed from favorites', 'info');

          if (document.querySelectorAll('.favorite-card').length === 0) {
            location.reload();
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
}

/**
 * NOTIFICATIONS (JS ONLY — no CSS injection)
 */
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.favorite-notification');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = `favorite-notification ${type}`;
  div.textContent = message;

  document.body.appendChild(div);

  setTimeout(() => div.classList.add('show'), 10);

  setTimeout(() => {
    div.remove();
  }, 3000);
}