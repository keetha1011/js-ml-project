const draw={};

draw.path=(ctx, path, color="#155166")=>{
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.lineWidth=5;

    ctx.moveTo(...path[0]);
    for(let i=0; i<path.length; i++){
        ctx.lineTo(...path[i]);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

draw.paths=(ctx, paths, color="#155166")=>{
    for(const path of paths) {
        draw.path(ctx, path, color);
    }
}