fetch('https://v2.api.noroff.dev/auction/listings')
  .then(response => response.json())
  .then(listings => {
    const carouselInner = document.getElementById("carouselItems");

    listings.forEach((listing, index) => {
      
     
      const carouselItem = document.createElement("div");

      
      if (index === 0) {
        carouselItem.classList.add("carousel-item", "active");
      } else {
        carouselItem.classList.add("carousel-item");
      }

    
      if (listing.media.length > 0) {
        const img = document.createElement("img");
        img.src = listing.media[0];
        img.alt = listing.title || "Auction image";
        img.classList.add("d-block", "w-100");

        carouselItem.appendChild(img);
      }

      const title = document.createElement("div");
      title.classList.add("carousel-caption", "d-none", "d-md-block");
      title.innerHTML = `<h5>${listing.title}</h5>`;
      
      carouselItem.appendChild(title);

      carouselInner.appendChild(carouselItem);
    });
  })
  .catch(error => {
    console.error('Error fetching the API', error); 
  });