class SketchPad{
    constructor(container, size=400){
        this.canvas = document.createElement('canvas');
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style=`
            // background-color: white;
            border-radius: 16px;
        `;
        this.canvas.classList.add('shadow-xl',"bg-cyan-100");
        container.appendChild(this.canvas);

        const lineBreak = document.createElement("br");
        container.appendChild(lineBreak);

        this.labelBox = document.createElement("input");
        this.labelBox.type = "text";
        this.labelBox.placeholder = "Label";
        this.labelBox.classList.add(
            "w-full","bg-cyan-100","h-12","text-center", "my-4", "rounded-xl", "shadow-xl", "placeholder:text-cyan-700", "placeholder:font-bold" , "focus:outline-none", "focus:bg-cyan-50", "px-4", "focus:placeholder:text-cyan-50", "focus:text-cyan-900", "focus:font-bold"
        );

        container.appendChild(this.labelBox);

        container.appendChild(lineBreak);

        const subContainer = document.createElement("div");
        subContainer.classList.add("flex", "flex-row", "justify-between");

        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML = "Undo";
        this.undoBtn.classList.add("transition-all","duration-600","ease-out",
            "bg-pink-100","rounded-xl","h-8","w-fit","px-4","active:bg-pink-400", "active:text-cyan-900", "hover:bg-pink-200" , "text-cyan-700","font-bold","shadow-xl"
        );
        subContainer.appendChild(this.undoBtn);

        this.downloadBtn = document.createElement("button");
        this.downloadBtn.innerHTML = "Download";
        this.downloadBtn.classList.add("transition-all","duration-600","ease-out",
            "bg-pink-100","rounded-xl","h-8","w-fit","px-4","active:bg-pink-400", "active:text-cyan-900", "hover:bg-pink-200" , "text-cyan-700","font-bold","shadow-xl"
        );
        subContainer.appendChild(this.downloadBtn);

        container.appendChild(subContainer);

        this.ctx=this.canvas.getContext('2d');

        this.paths=[];
        this.isDrawing=false;

        this.#addEventListeners();
    }

    #addEventListeners(){
        this.canvas.onmousedown=(evt)=>{
            const mouse = this.#getMouse(evt);
            this.paths.push([mouse]);
            this.isDrawing=true;
        }

        this.canvas.onmousemove=(evt)=>{
            if(this.isDrawing){
                const mouse = this.#getMouse(evt);
                const lastPath = this.paths[this.paths.length - 1];
                lastPath.push(mouse);
                this.#redraw();
            }
        }

        this.canvas.onmouseup=(evt)=>{
            this.isDrawing=false;
        }

        this.canvas.ontouchstart=(evt)=>{
            const loc=evt.touches[0];
            this.canvas.onmousedown(loc);
        }

        this.canvas.ontouchmove=(evt)=>{
            const loc=evt.touches[0];
            this.canvas.onmousemove(loc);
        }
        this.canvas.ontouchend=(evt)=>{
            this.canvas.onmouseup();
        }

        this.undoBtn.onclick=(evt)=>{
            this.paths.pop();
            this.#redraw();
        }
    }

    #redraw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        draw.paths(this.ctx,this.paths);

        if(this.paths.length > 0) {
            this.undoBtn.disabled = false;
        } else {
            this.undoBtn.enabled = true;
        }
    }

    #getMouse=(evt)=>{
        const rect=this.canvas.getBoundingClientRect();
        return [
            Math.round(evt.clientX-rect.left),
            Math.round(evt.clientY-rect.top)
        ];
    }
}