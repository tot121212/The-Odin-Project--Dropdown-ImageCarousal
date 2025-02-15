import ThreeBarsSVG from "./media/bars-filter.svg";
import LeftArrowSVG from "./media/arrow-small-left.svg";
import RightArrowSVG from "./media/arrow-small-right.svg";
import Squirrel1IMG from "./media/istockphoto-614737202-612x612.jpg";
import Squirrel2IMG from "./media/istockphoto-1131581504-612x612.jpg";
import Squirrel3IMG from "./media/squirrel cropped.jpg";
import EmptyDotSVG from "./media/circle-dashed.svg";
import FullDotSVG from "./media/dot-circle.svg";

export class HTMLHandler {
    static createObjectWithSVG = (svg)=>{
        const object = document.createElement("object");
        object.type = "image/svg+xml";
        object.data = svg;
        object.setAttribute("ratio", "1/1");
        return object;
    }

    static updateObjectWithSVGQuery = (query, svg)=>{
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

    static fadeElementOutAndIn = async (element, ms)=>{
        element.classList.add("fade");
        await HTMLHandler.timer(ms).then(()=>{
            element.classList.remove("fade");
        });
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
            HTMLHandler.fadeElementOutAndIn(dropdownToggler, ms);
        });

        for (const btn of dropdownBtns.querySelectorAll("button")){
            btn.addEventListener("click", async ()=>{
                HTMLHandler.fadeElementOutAndIn(btn, ms);
            });
        }
    }

    // get left pos that match with indicies
    static getLeftPositions = (items) => {
        const leftPositions = Array.from(items).map(item => item.getBoundingClientRect().left - 24);
        console.log("Left positions relative to container:", leftPositions);
        return leftPositions;
    };

    static delay = (ms)=>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static setupCarousels = (carousels, ms)=>{
        const setupCarousel = async (carousel)=>{
            const itemContainer = carousel.querySelector(".carousel-item-container");
            const items = itemContainer.querySelectorAll('.carousel-item');
            
            let leftPositions;
            const resize = ()=>{
                console.log("The page has been resized!");
                leftPositions = HTMLHandler.getLeftPositions(items);
            };
            window.addEventListener("resize", resize);
            await HTMLHandler.delay(100/*ms*/); // fix for weird bug where page does not have correct boundingBoxes on DOMContentLoaded
            resize();
            const getPosOfIdx = (idx)=>{
                return leftPositions[idx] + 1;
            }

            console.log("scrollWidth: ", itemContainer.scrollWidth);
            console.log("offsetWidth: ", itemContainer.offsetWidth);

            let atEnd = false;
            let atStart = false;
            const getIsAtStartOrEnd = ()=>{
                atStart = itemContainer.scrollLeft === 0 ? true : false;
                atEnd = itemContainer.scrollLeft === itemContainer.scrollWidth - itemContainer.clientWidth ? true : false;
                console.log("atStart?", atStart);
                console.log("atEnd?", atEnd);
            }

            let isGoingRight = true;

            let curIdx = 0;
            let prevIdx = 0;
            const setCurIdx = (idx)=>{
                prevIdx = curIdx;
                curIdx = Math.max(
                    0,
                    Math.min(
                        idx,
                        leftPositions.length - 1
                    )
                );
                console.log("curIdx:", curIdx);
                carousel.dispatchEvent(new Event("setCurIdx"));
            }

            let isMouseOver = false;
            carousel.addEventListener('mouseover', () => {
                isMouseOver = true;
                
            });
            carousel.addEventListener('mouseout', () => {
                isMouseOver = false;
            });
            
            const getNextLeftRightIdx = () => {
                return isGoingRight ? curIdx  + 1 : curIdx - 1;
            };

            const scrollToIdx = (idx)=>{
                setCurIdx(idx);
                const to = getPosOfIdx(curIdx);
                itemContainer.scrollTo(to, 0);
                console.log("curPos:", itemContainer.scrollLeft);
            }

            const autoScroll = ()=>{
                if (!isMouseOver){
                    console.log("Move carousel");

                    getIsAtStartOrEnd();
                    if (atStart) isGoingRight = true;
                    else if (atEnd) isGoingRight = false;
                    console.log("Is going right?:", isGoingRight);

                    scrollToIdx(getNextLeftRightIdx());
                }
                else{
                    console.log("Mouse is over carousel, did not move");
                }
            }

            const next = ()=>{
                isGoingRight = true;
                scrollToIdx(getNextLeftRightIdx());
            }

            const prev = ()=>{
                isGoingRight = false;
                scrollToIdx(getNextLeftRightIdx());
            }

            const buttonContainer = carousel.querySelector(".carousel-btn-container");
            const leftArrowButton = buttonContainer.querySelector("#left-arrow");
            const rightArrowButton = buttonContainer.querySelector("#right-arrow");
            const fadeTime = 200;
            leftArrowButton.addEventListener("click", ()=>{
                HTMLHandler.fadeElementOutAndIn(leftArrowButton, fadeTime);
                prev();
            });
            rightArrowButton.addEventListener("click", next);
            rightArrowButton.addEventListener("click", ()=>{
                HTMLHandler.fadeElementOutAndIn(rightArrowButton, fadeTime);
                next();
            });

            // create circle button for each idx
                // store idx in button.dataset
                // attach button to getPosOfIdx() and curIdx = idx

            const createCarouselIdxButton = (idx)=>{
                const button = document.createElement("button");
                button.classList.add("carousel-idx-btn", "grabbable", "logo", "large");

                button.addEventListener("click", ()=>{
                    HTMLHandler.fadeElementOutAndIn(button, fadeTime);
                    scrollToIdx(idx);
                });

                const object = HTMLHandler.createObjectWithSVG(EmptyDotSVG);
                button.appendChild(object);

                return button;
            }
            // for (item of items){
            //     const button = createCarouselIdxButton(item);
            //     buttonContainer.appendChild(button);
            // }

            const carouselIdxButtonContainer = document.createElement("div");
            carouselIdxButtonContainer.classList.add("carousel-idx-btn-container");
            const carouselIdxButtons = Array.from(items).map((item, idx) => createCarouselIdxButton(idx));
            carouselIdxButtons.forEach(button => carouselIdxButtonContainer.appendChild(button));
            carousel.appendChild(carouselIdxButtonContainer);
            carousel.addEventListener("setCurIdx", () => {
                const curButton = carouselIdxButtons[curIdx];
                const curObject = curButton?.firstElementChild;
            
                const prevButton = carouselIdxButtons[prevIdx];
                const prevObject = prevButton?.querySelector("object");
            
                if (curObject) curObject.data = FullDotSVG;
                if (prevObject) prevObject.data = EmptyDotSVG;
            });
            

            setInterval(autoScroll, ms);
        }

        carousels.forEach(carousel => {
            setupCarousel(carousel);
        });
    }

    static init = ()=>{
        HTMLHandler.updateObjectWithSVGQuery("object.three-bars-svg", ThreeBarsSVG);
        HTMLHandler.updateObjectWithSVGQuery("object.left-arrow-svg", LeftArrowSVG);
        HTMLHandler.updateObjectWithSVGQuery("object.right-arrow-svg", RightArrowSVG);

        HTMLHandler.updateIMGwithIMG("img.squirrel-1-img", Squirrel1IMG);
        HTMLHandler.updateIMGwithIMG("img.squirrel-2-img", Squirrel2IMG);
        HTMLHandler.updateIMGwithIMG("img.squirrel-3-img", Squirrel3IMG);

        const nav = document.querySelector("nav");
        const settingsBtn = nav.querySelector("button#settings");
        const btns = nav.querySelector(".btns");

        HTMLHandler.setupDropdown(nav, settingsBtn, btns, 1200/*ms*/);
        
        const carousels = document.querySelectorAll(".carousel");
        console.log("Carousels:",carousels);
        HTMLHandler.setupCarousels(carousels, 5000);
    }
}