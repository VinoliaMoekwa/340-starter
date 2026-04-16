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
          window.location.reload()
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