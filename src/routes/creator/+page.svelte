<div class="flex transition-all duration-300 ease-in-out flex-row h-screen w-screen justify-center bg-gradient-to-bl from-cyan-900 to-cyan-700">
    <div id="content" class="flex flex-col xl:flex-row w-full sm:w-[70vw] items-center md:justify-evenly justify-center">
        <h1 class="text-cyan-100 text-5xl text-center font-extrabold">Data Creator</h1>
        <br>
        <div id="sketchPadContainer">

        </div>
        <script src="/src/lib/draw.js"></script>
        <script src="/src/lib/sketchPad.js"></script>
        <script>

            const data={
                session:new Date().getTime(),
                drawings:{}
            };

            const sketchPad = new SketchPad(sketchPadContainer);
        </script>
    </div>
</div>

<style>
    div {
        font-family: Bahnschrift,serif;
        /*font-weight: bold;*/
        overscroll-behavior: none;
    }
</style>