document.addEventListener("DOMContentLoaded", () => {
  const favoriteButton = document.getElementById("favorite-toggle")

  if (!favoriteButton) return

  favoriteButton.addEventListener("click", async () => {
    const inv_id = favoriteButton.dataset.invId

    try {
      const response = await fetch("/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inv_id }),
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
      } else {
        alert(data.message || "Could not update favorite.")
      }
    } catch (error) {
      console.error("Toggle favorite failed:", error)
      alert("Server error updating favorite.")
    }
  })
})