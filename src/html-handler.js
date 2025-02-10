import threeBarsSVG from "./media/bars-filter.svg";
import squirrel1IMG from "./media/istockphoto-614737202-612x612.jpg";
import squirrel2IMG from "./media/istockphoto-1131581504-612x612.jpg";
import squirrel3IMG from "./media/squirrel cropped.jpg";


export class HTMLHandler {
    static updateObjectWithSVG = (query, svg)=>{
        const objects = document.querySelectorAll(query);
        for (const object of objects){
            object.data = svg;
        }
    }

    static updateIMGwithIMG = (query, img)=>{
        const imgs = document.querySelectorAll(query);
        for (const imgElement of imgs){
            imgElement.src = img;
        }
    }

    static timer = (ms)=>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // could be refined considering every element of dropdownContainer,
    // ideally would use the mouseenter and mouseexit logic,
    // so we could just put them in a container instead of a `<nav>` as they are now and theyd work...
    static setupDropdown = (dropdownContainer, dropdownToggler, dropdownBtns, ms)=>{
        let isHoverInProgress = false;

        dropdownToggler.addEventListener("mouseenter", async ()=>{
            if (!isHoverInProgress){
                isHoverInProgress = true
                HTMLHandler.timer(ms) // start timer for opening dropdown
                .then((result) => { //
                    if (isHoverInProgress){
                        if (dropdownBtns.hidden){
                            dropdownBtns.hidden = false;
                        }
                    }
                });
            }
        });

        dropdownContainer.addEventListener("mouseleave", async ()=>{
            if (isHoverInProgress){
                HTMLHandler.timer(ms)
                .then((result)=>{
                    if (isHoverInProgress){
                        isHoverInProgress = false;
                        if (!dropdownBtns.hidden){
                            dropdownBtns.hidden = true;
                        }
                    }
                });
            }
        });

        dropdownToggler.addEventListener("click", async ()=>{
            dropdownBtns.hidden ? dropdownBtns.hidden = false : dropdownBtns.hidden = true;

            dropdownToggler.classList.add("fade");
            await HTMLHandler.timer(ms).then((result)=>{
                dropdownToggler.classList.remove("fade");
            });
        });

        for (const btn of dropdownBtns.querySelectorAll("button")){
            btn.addEventListener("click", async ()=>{
                btn.classList.add("fade");
                await HTMLHandler.timer(ms).then((result)=>{
                    btn.classList.remove("fade");
                });
            });
        }
    }

    static carouselsAreMousedOver = false;

    //typeof carousels === NodeListOf<Element>
    static moveCarousels = (carousels, ms)=>{
        // Function to rotate a single carousel
        function rotateCarousel(carousel) {
            const items = carousel.querySelectorAll('.carousel-item');
            const totalWidth = carousel.offsetWidth;
            const totalItems = items.length;
            let currentIndex = 0;

            function scrollModulo() {
                const totalItemsWidth = Array.from(items).reduce((total, item) => total + item.offsetWidth, 0);
                const scrollAmount = (currentIndex * items[0].offsetWidth) % totalItemsWidth;
                carousel.scrollRight = scrollAmount;
                
                currentIndex = (currentIndex + 1) % totalItems; // Loop back when reaching the last child
            }

            setInterval(scrollModulo, ms);
        }

        // Iterate through all carousels and apply the rotation
        carousels.forEach(carousel => {
        rotateCarousel(carousel);
        });

    }

    static init = ()=>{
        HTMLHandler.updateObjectWithSVG("object.three-bars-svg", threeBarsSVG);
        HTMLHandler.updateIMGwithIMG("img.squirrel-1-img", squirrel1IMG);
        HTMLHandler.updateIMGwithIMG("img.squirrel-2-img", squirrel2IMG);
        HTMLHandler.updateIMGwithIMG("img.squirrel-3-img", squirrel3IMG);

        const nav = document.querySelector("nav");
        const settingsBtn = nav.querySelector("button#settings");
        const btns = nav.querySelector(".btns");

        HTMLHandler.setupDropdown(nav, settingsBtn, btns, 1200/*ms*/);

        const carousels = document.querySelectorAll(".carousel");
        HTMLHandler.moveCarousels(carousels, 5000);
    }
}