const draw={};

draw.path=(ctx, path, color="#9f8ef2")=>{
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

draw.paths = (ctx, paths, colors = [
                  "#522efb", "#00a11c", "#c30056",
                  "#ffb400", "#0099ff", "#f54291",
                  "#7d00ff", "#ff3300", "#33cc33",
                  "#ff66cc", "#ffcc00", "#660066"
              ]
) => {
    for (let i = 0; i < paths.length; i++) {
        const color = colors[i % colors.length];
        draw.path(ctx, paths[i], color);
    }
};