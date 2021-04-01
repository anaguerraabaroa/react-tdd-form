export const saveProduct = () => {
  // async fetch
  fetch('/products', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export default {
  saveProduct,
}
