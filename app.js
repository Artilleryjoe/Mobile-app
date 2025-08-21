window.addEventListener('alpine:init', () => {
  Alpine.data('xssDemo', () => ({
    secure: false,
    comments: [],
    commentInput: '',
    searchInput: '',
    searchResultDisplay: '',
    escapeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },
    addComment() {
      this.comments.push(this.commentInput);
      this.commentInput = '';
    },
    doSearch() {
      this.searchResultDisplay = `Results for "${this.searchInput}"`;
    },
    toggleSecure() {
      this.secure = !this.secure;
      const cspMeta = document.getElementById('csp');
      if (this.secure) {
        cspMeta.setAttribute('content', "default-src 'self' https://cdn.tailwindcss.com https://unpkg.com https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://cdn.tailwindcss.com https://unpkg.com;");
      } else {
        cspMeta.setAttribute('content', '');
      }
    }
  }));
});
