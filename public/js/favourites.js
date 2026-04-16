document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll(".btn-remove")

  removeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const inv_id = button.dataset.invId

      try {
        const response = await fetch("/favorites/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inv_id }),
        })

        const data = await response.json()

        if (data.success) {
          button.closest(".favorite-card").remove()

          const countText = document.querySelector(".favorites-count p")
          if (countText) {
            if (data.favoriteCount === 0) {
              countText.textContent = "You haven't added any favorites yet."
              window.location.reload()
            } else if (data.favoriteCount === 1) {
              countText.textContent = "You have 1 favorite vehicle."
            } else {
              countText.textContent = `You have ${data.favoriteCount} favorite vehicles.`
            }
          }
        } else {
          alert(data.message || "Could not remove favorite.")
        }
      } catch (error) {
        console.error("Remove favorite failed:", error)
        alert("Server error removing favorite.")
      }
    })
  })
})