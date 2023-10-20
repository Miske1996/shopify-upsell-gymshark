class CartUpsell extends HTMLElement {
    constructor() {
      super(); 
      this.cart =  document.querySelector('cart-drawer');
      const productsCollectionCart = document.querySelectorAll(".upsell_item");
      const debouncedOnClick = debounce((item) => {
        this.addToCartUpsell(item);
      }, ON_CHANGE_DEBOUNCE_TIMER);
      if(productsCollectionCart.length > 0){
        productsCollectionCart.forEach((item) => {
          item.addEventListener('click',(event)=>{
            event.preventDefault()
            if(event.target == item)debouncedOnClick(item);
            debouncedOnClick(item.closest(".upsell_item"))
            
          });
        });
      }
    }

    addToCartUpsell(item) {
      
        var productsToAdd = []
        const mainProduct = item
        productsToAdd.push({
          id: mainProduct.getAttribute("data-product-id"),
          quantity : mainProduct.getAttribute("data-value")
        })

        const items = productsToAdd.map((product) => ({
          id:product.id ,
          quantity : parseInt(product.quantity)
        }))
        const requesBody = {
          items:items
        }

        requesBody.sections = this.cart.getSectionsToRenderInner().map((section) => section.id);
        requesBody.sections_url =  window.location.pathname;
        
        fetch(`${window.Shopify.routes.root}cart/add.js`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify(requesBody)
        })
          .then((response) => response.json())
          .then((response) => {
              this.cart.renderContents(response,true);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
          });
      }
}
customElements.define('cart-upsell', CartUpsell);
