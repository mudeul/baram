export function initBookmarksFilter() {
  const filterButtons = document.querySelectorAll('.tag-btn')
  const items = document.querySelectorAll('.bookmark-item-row')

  if (filterButtons.length === 0 || items.length === 0) return

  function handleFilterClick(event) {
    filterButtons.forEach(function (b) {
      b.classList.remove('active')
    })

    const targetBtn = event.currentTarget
    if (!targetBtn) return
    targetBtn.classList.add('active')

    const selectedTag = targetBtn.getAttribute('data-tag')

    items.forEach(function (item) {
      const rawTags = item.getAttribute('data-tags')
      const itemTags = rawTags
        ? rawTags.split(',').map(function (t) {
            return t.trim()
          })
        : []
      const matches = selectedTag === 'all' || (selectedTag && itemTags.indexOf(selectedTag) !== -1)

      if (matches) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
      }
    })
  }

  filterButtons.forEach(function (btn) {
    btn.removeEventListener('click', handleFilterClick)
    btn.addEventListener('click', handleFilterClick)
  })
}
