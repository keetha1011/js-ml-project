<div class="flex transition-all duration-300 ease-in-out flex-row h-screen w-screen justify-center animated-gradient">
    <div id="content" class="flex flex-col xl:flex-row w-full sm:w-[70vw] items-center md:justify-evenly justify-center">
        <h1 class="text-cyan-100 text-5xl text-center font-extrabold">Sketch it up!</h1>
        <br>
        <div id="sketchPadContainer">

        </div>
        <script src="/src/lib/draw.js"></script>
        <script src="/src/lib/sketchPad.js"></script>
        <script>

            const data={
                session:new Date().getTime(),
                drawings:{},
                label:null,
            };

            const sketchPad = new SketchPad(sketchPadContainer);
            const labelBox = document.getElementById('labelBox');

            async function recognize() {
                if (sketchPad.paths.length === 0) {
                    alert("Missing Label or Sketch");
                    return;
                }
                data.label = labelBox.value;
                data.drawings[data.label] = sketchPad.paths;

                const response = await fetch('?/predict', {
                    method: 'POST',
                    body: JSON.stringify({
                        strokes: sketchPad.paths,
                    })
                }).then(response => response.json());

                console.log(response.data[40]);
                if(response.data[40]==4) {
                    labelBox.value = "Airplane";
                } else if (response.data[42]==4) {
                    labelBox.value = "Bicycle";
                } else if (response.data[44]==4) {
                    labelBox.value = "Car";
                } else if (response.data[46]==4) {
                    labelBox.value = "Banana";
                }
            }
        </script>
    </div>
</div>

<style>
    div {
        font-family: Candara,serif;
        /*font-weight: bold;*/
        overscroll-behavior: none;
    }

    :global(body) {
        --gradient-angle: 0deg;
    }

    .animated-gradient {
        background-image: radial-gradient(circle at 70% 50%, #0072b3, #0040a1);
        background-size: 200% 200%;
        animation: gradient-animation 10s infinite ease-in-out;
    }

    @keyframes gradient-animation {
        0% {
            background-position: 0 0;
        }
        50% {
            background-position: 100% 100%;
        }
        100% {
            background-position: 0 0;
        }
    }
</style>