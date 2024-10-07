class SketchPad{
    constructor(container, size=400){
        const lineBreak = document.createElement("br");

        this.labelBox = document.createElement("input");
        this.labelBox.type = "text";
        this.labelBox.id = "labelBox";
        this.labelBox.placeholder = "Draw something";
        this.labelBox.classList.add(
            "w-full","bg-neutral-50", "bg-opacity-70","h-12","text-center", "my-4", "rounded-xl", "shadow-xl", "placeholder:text-neutral-800",
            "focus:outline-none", "focus:bg-cyan-50", "px-4", "focus:placeholder:text-cyan-50", "focus:text-cyan-900",
            "focus:font-bold", "text-cyan-900", "font-bold"
        );
        this.labelBox.disabled = true;

        container.appendChild(this.labelBox);

        container.appendChild(lineBreak);

        this.canvas = document.createElement('canvas');
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.classList.add('shadow-xl',"bg-neutral-100", "bg-opacity-70", "rounded-xl");
        container.appendChild(this.canvas);

        container.appendChild(lineBreak);

        const subContainer = document.createElement("div");
        subContainer.classList.add("flex", "flex-row", "justify-between");

        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML = "Undo";
        this.undoBtn.classList.add("transition-all","duration-600","ease-out",
            "bg-pink-200", "bg-opacity-70","rounded-tl-xl","rounded-bl-xl","h-12","w-full","px-4","active:bg-pink-400", "active:text-neutral-900",
            "hover:bg-pink-200" , "text-neutral-700","font-bold","shadow-xl"
        );
        subContainer.appendChild(this.undoBtn);

        this.recognizeBtn = document.createElement("button");
        this.recognizeBtn.innerHTML = "Recognize";
        this.recognizeBtn.classList.add("transition-all","duration-600","ease-out",
            "bg-blue-200", "bg-opacity-70","rounded-tr-xl","rounded-br-xl","h-12","w-full","px-4","active:bg-blue-400", "active:text-neutral-900",
            "hover:bg-blue-300" , "text-neutral-700","font-bold","shadow-xl"
        );
        this.recognizeBtn.onclick = recognize;
        subContainer.appendChild(this.recognizeBtn);

        container.appendChild(subContainer);

        this.ctx=this.canvas.getContext('2d');

        this.reset();

        this.#addEventListeners();
    }

    reset() {
        this.paths=[];
        this.isDrawing=false;
        this.labelBox.value = "";
        this.#redraw();
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

        document.onmouseup=(evt)=>{
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
        document.ontouchend=(evt)=>{
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