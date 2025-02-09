import threeBarsSVG from "./media/bars-filter.svg";

export class HTMLHandler {
    static updateObjectWithSVG = (query, svg)=>{
        const objects = document.querySelectorAll(query);
        for (const object of objects){
            object.data = svg;
        }
    }

    static init = ()=>{
        this.updateObjectWithSVG("object.three-bars-svg", threeBarsSVG);
        const nav = document.querySelector("nav");
        const settingsBtn = nav.querySelector("button#settings");
        const settingsBtns = nav.querySelector(".btns");
        settingsBtn.addEventListener("click", ()=>{
            settingsBtns.hidden ? settingsBtns.hidden = false : settingsBtns.hidden = true;

            settingsBtn.classList.add("fade");
            setTimeout(() => {
                settingsBtn.classList.remove("fade");
            }, 200);
        });
    }
}