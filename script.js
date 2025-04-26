document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.addEventListener('click', () => {
      alert('Willkommen beim Web lernen!');
    });
  }
}); 