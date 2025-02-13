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

    // get left pos that match with indicies
    static getLeftPositions = (items, container) => {
        const leftPositions = Array.from(items).map(item => item.getBoundingClientRect().left - 24);
        console.log("Left positions relative to container:", leftPositions);
        return leftPositions;
    };

    static delay = (ms)=>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static moveCarousels = (carousels, ms)=>{
        const rotateCarousel = async (carousel)=>{
            console.log("Init carousel");
            let isMouseOver = false;

            const items = carousel.querySelectorAll('.carousel-item');
            
            let leftPositions;
            const resize = ()=>{
                console.log("The page has been resized!");
                leftPositions = HTMLHandler.getLeftPositions(items, carousel);
            };
            window.addEventListener("resize", resize);
            await HTMLHandler.delay(100/*ms*/);
            resize();

            console.log("scrollWidth: ", carousel.scrollWidth);
            console.log("offsetWidth: ", carousel.offsetWidth);

            let atEnd = false;
            let atStart = false;
            let isGoingRight = true;
            let curIdx = 0;

            const getIsAtStartOrEnd = ()=>{
                atStart = carousel.scrollLeft === 0 ? true : false;
                atEnd = carousel.scrollLeft === carousel.scrollWidth - carousel.clientWidth ? true : false;
                console.log("atStart?", atStart);
                console.log("atEnd?", atEnd);
            }

            const findClosestIndex = (scrollLeft, leftPositions) => {
                let low = 0, high = leftPositions.length - 1;
                
                while (low < high) {
                    let mid = Math.floor((low + high) / 2);
                    if (leftPositions[mid] < scrollLeft) {
                        low = mid + 1;
                    } else {
                        high = mid;
                    }
                }
                
                // Ensure we return the closest index (not exceeding scrollLeft)
                return (low > 0 && leftPositions[low] > scrollLeft) ? low - 1 : low;
            };
            
            const acquireNextPos = () => {
                // Determine the current index based on the scrollbar position
                curIdx = findClosestIndex(carousel.scrollLeft, leftPositions);
            
                // Adjust direction at boundaries
                if (atStart) isGoingRight = true;
                else if (atEnd) isGoingRight = false;
            
                // Move to the next position
                if (isGoingRight) {
                    curIdx = Math.min(curIdx + 1, items.length - 1);
                } else {
                    curIdx = Math.max(curIdx - 1, 0);
                }
            
                console.log("Is going right?:", isGoingRight);
                console.log("curIdx:", curIdx);
            
                // Get the next item's leftmost position
                const nextPos = Math.max(leftPositions[curIdx], 0);
                console.log("nextPos:", nextPos);
                return nextPos;
            };
            
            
            const scroll = ()=>{
                if (!isMouseOver){
                    console.log("Move carousel");
                    getIsAtStartOrEnd();
                    let to = acquireNextPos();
                    carousel.scrollTo(to+1, 0);
                    console.log("curPos:", carousel.scrollLeft);
                }
            }

            setInterval(scroll, ms);

            carousel.addEventListener('mouseover', () => {
                isMouseOver = true;
                
            });

            carousel.addEventListener('mouseout', () => {
                isMouseOver = false;
            });
        }

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
        console.log("Carousels:",carousels);
        HTMLHandler.moveCarousels(carousels, 5000);
    }
}