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
        const btns = nav.querySelector(".btns");

        settingsBtn.addEventListener("click", ()=>{
            btns.hidden ? btns.hidden = false : btns.hidden = true;

            settingsBtn.classList.add("fade");
            setTimeout(() => {
                settingsBtn.classList.remove("fade");
            }, 300);
        });

        for (const btn of btns.querySelectorAll("button")){
            btn.addEventListener("click", ()=>{
                btn.classList.add("fade");
                setTimeout(() => {
                    btn.classList.remove("fade");
                }, 300);
            });
        }
    }
}