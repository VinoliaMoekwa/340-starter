'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const removeButtons = document.querySelectorAll('.btn-remove');

  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveFavorite);
  });
});

/**
 * Remove favorite vehicle
 */
async function handleRemoveFavorite(event) {
  event.preventDefault();

  const button = event.currentTarget;
  const invId = button.dataset.invId;
  const card = button.closest('.favorite-card');

  if (!invId) return;

  const confirmDelete = confirm('Remove this vehicle from your favorites?');
  if (!confirmDelete) return;

  // disable button to prevent double click
  button.disabled = true;

  try {
    const response = await fetch('/favorites/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inv_id: invId })
    });

    const data = await response.json();

    if (data.success) {

      // smooth remove animation
      if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
          card.remove();

          // if no cards left, reload page to show empty state
          const remaining = document.querySelectorAll('.favorite-card');
          if (remaining.length === 0) {
            location.reload();
          }
        }, 300);
      }

      // update count text if exists
      const countElement = document.querySelector('.favorites-count');

      if (countElement && data.favoriteCount !== undefined) {
        const count = data.favoriteCount;

        let message = '';

        if (count === 0) {
          message = "You haven't added any favorites yet.";
        } else if (count === 1) {
          message = "You have 1 favorite vehicle.";
        } else {
          message = `You have ${count} favorite vehicles.`;
        }

        countElement.innerHTML = `<p>${message}</p>`;
      }

    } else {
      alert(data.message || 'Failed to remove favorite');
      button.disabled = false;
    }

  } catch (error) {
    console.error('Remove favorite error:', error);
    alert('Something went wrong. Please try again.');
    button.disabled = false;
  }
}