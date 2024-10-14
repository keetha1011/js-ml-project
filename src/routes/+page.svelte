<script lang="ts">
  import chartjs from 'chart.js/auto';
  let chart: any;
  import { onMount } from 'svelte';

  let chartValues = [1,1,1,1,1,1,1,1,1,1];
  let chartLabels = ['anvil', 'apple', 'baseball', 'bathtub', 'computer', 'fence', 'goatee','ocean','toe','vase'];

  let chart_ctx: any;
  let chart_canvas: any;

  let label = null;
  export let size = 400;
  export let onRecognize = async () => {
    if (paths.length === 0) {
      alert("Missing Sketch");
      return;
    }

    await fetch("?/predict", {
      method: "POST",
      body: JSON.stringify({
        strokes: paths,
      }),
    }).then((response) => response.json())
            .then((data) => {
              let a = JSON.parse(data["data"]);
              label.value = a[4];
              chart.data.datasets[0].data = JSON.parse(a[3]);
              chart.update();
            });
  };

  let canvas: any;
  let ctx: any;
  let paths = [];
  let isDrawing = false;

  onMount(() => {
    label = document.getElementById('label');
    ctx = canvas.getContext('2d');
    redraw();

    chart_ctx = chart_canvas.getContext('2d');

    chart = new chartjs(chart_ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: "Graph",
          backgroundColor: 'rgba(54,243,28,0.78)',
          borderRadius: 8,
          data: chartValues
        }]
      }
    });
  });

  function startDrawing(event) {
    const mouse = getMouse(event);
    paths = [...paths, [mouse]];
    isDrawing = true;
  }

  function draw(event) {
    if (!isDrawing) return;
    const mouse = getMouse(event);
    paths[paths.length - 1] = [...paths[paths.length - 1], mouse];
    redraw();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function undo() {
    paths = paths.slice(0, -1);
    redraw();
  }

  function redraw() {
    ctx.clearRect(0, 0, size, size);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2243bb';

    paths.forEach(path => {
      ctx.beginPath();
      path.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }

  function getMouse(evt) {
    const rect = canvas.getBoundingClientRect();
    return [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top)
    ];
  }

  function scrollIntoView({ target }) {
    const el = document.querySelector(target.getAttribute("href"));
    if (!el) return;

    const startY = window.scrollY;
    const endY = el.offsetTop;
    const duration = 1000;

    let startTime = null;

    function animate(time) {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;
      const easeInOut =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - 2 * (1 - progress) * (1 - progress);
      window.scrollTo(0, startY + (endY - startY) * easeInOut);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }


  const labels = ["anvil","apple","baseball","bathtub", "computer", "fence", "goatee", "ocean", "toe", "vase"];
  let fetched_data = [0.65, 0.59, 0.80, 0.81, 0.56, .55, 0.40];
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: fetched_data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
</script>


<div class="overflow-y-hidden">
  <section id="main">
    <div
      id="bg"
      class="bg-white flex justify-center items-center h-screen w-screen bg-[url(/image-2.png)] transition-all"
    >
      <div>
        <div
          class="flex transition-all duration-300 ease-in-out flex-row h-screen w-screen sm:h-[90vh] sm:w-[90vw] justify-center animated-gradient backdrop-blur-xl rounded-xl shadow-2xl"
          id="bg+1"
        >
          <div
            id="content"
            class="flex flex-col xl:flex-row w-full sm:w-[70vw] items-center md:justify-evenly justify-center"
          >
            <h1
              class="bg-clip-text transition-all text-5xl text-center font-extrabold reversed-animated-gradient text-transparent mb-4 sm:mb-0 hover:scale-110"
            >
              Sketch it up!
            </h1>
            <br />
            <div id="sketchPadContainer"></div>
            <div class="flex flex-col items-center">
              <input
                      id="label"
                      type="text"
                      placeholder="Draw something"
                      class="w-full bg-neutral-50 bg-opacity-70 h-12 text-center my-4 rounded-xl shadow-xl placeholder:text-neutral-800 focus:outline-none focus:bg-cyan-50 px-4 focus:placeholder:text-cyan-50 focus:text-cyan-900 focus:font-bold text-cyan-900 font-bold hover:scale-105 transition-all"
                      disabled
              />
              <canvas
                      bind:this={canvas}
                      {size}
                      width={size}
                      height={size}
                      on:mousedown={startDrawing}
                      on:mousemove={draw}
                      on:mouseup={stopDrawing}
                      on:mouseout={stopDrawing}
                      class="shadow-xl bg-neutral-100 bg-opacity-70 rounded-xl scale-[99%] hover:scale-100 transition-all cursor-crosshair"
              />
              <div class="flex flex-row justify-between w-full mt-4">
                <button
                        on:click={undo}
                        disabled={paths.length === 0}
                        class="transition-all duration-600 ease-out bg-pink-200 bg-opacity-70 rounded-xl h-12 w-full px-4 active:bg-pink-400 active:text-neutral-900 hover:bg-pink-200 text-neutral-700 font-bold shadow-xl mr-4 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Undo
                </button>
                <button
                        on:click={onRecognize}
                        class="transition-all duration-600 ease-out bg-blue-200 bg-opacity-70 rounded-xl h-12 w-full px-4 active:bg-blue-400 active:text-neutral-900 hover:bg-blue-300 text-neutral-700 font-bold shadow-xl hover:scale-105"
                >
                  Recognize
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="pl-4 flex flex-row">
          <a
            href="#history"
            class=" h-12 w-fit px-8 bg-sky-300 pt-3 rounded-b-2xl mr-4 transition-all hover:bg-sky-400 font-extrabold text-neutral-800"
            >SketchPad</a
          >
          <a
            href="#confidence"
            class="h-12 w-fit px-8 bg-green-200 pt-3 rounded-b-2xl hover:bg-green-300 transition-all font-extrabold text-neutral-800"
            on:click|preventDefault={scrollIntoView}>Confidence</a
          >
        </div>
      </div>
    </div>
  </section>
  <div class="h-screen flex flex-col bg-[url(/image-2.png)]">
    <section
      id="confidence"
      class="h-screen flex sm:flex-col justify-center items-center"
    >
      <div
        class=" h-[90vh] w-[90vw] rounded-xl animated-gradient-2 backdrop-blur-2xl shadow-xl"
      >
        <div class="flex flex-row justify-around items-center h-full w-full">
          <h1
            class="text-center font-extrabold reversed-animated-gradient-2 bg-clip-text text-transparent text-5xl mb-4 sm:mb-0 hover:scale-110 transition-all"
          >
            Confidence
          </h1>
          <div
            class=" flex justify-center items-center w-[700px] bg-neutral-50 rounded-3xl h-[500px] backdrop-blur bg-opacity-30 hover:scale-125 transition-all ease-in-out duration-700"
          >
            <canvas bind:this={chart_canvas} id="myChart"></canvas>
          </div>
        </div>
      </div>
      <div class="pl-4 flex flex-row w-[90vw]">
        <a
          href="#main"
          class=" h-12 w-fit px-8 bg-sky-200 pt-3 rounded-b-2xl mr-4 transition-all hover:bg-sky-400 font-extrabold text-neutral-800"
          on:click|preventDefault={scrollIntoView}>SketchPad</a
        >
        <a
          href="#confidence"
          class="h-12 w-fit px-8 bg-green-200 pt-3 rounded-b-2xl hover:bg-green-300 transition-all font-extrabold text-neutral-800"
          on:click|preventDefault={scrollIntoView}>Confidence</a
        >
      </div>
    </section>
  </div>
</div>

<style>
  div {
    font-family: Jost, serif;
    overscroll-behavior: none;
  }

  :global(body) {
    --gradient-angle: 0deg;
  }

  .animated-gradient {
    background-image: radial-gradient(
      circle at 70% 50%,
      rgba(0, 161, 255, 0.44),
      rgba(0, 64, 161, 0.8)
    );
    background-size: 400% 400%;
    animation: gradient-animation 50s infinite ease-in-out;
  }

  .animated-gradient-2 {
    background-image: radial-gradient(
      circle at 70% 50%,
      rgba(54, 243, 28, 0.42),
      rgba(0, 108, 33, 0.66)
    );
    background-size: 400% 400%;
    animation: gradient-animation 50s infinite ease-in-out;
  }

  .reversed-animated-gradient-2 {
    background-image: radial-gradient(
      circle at 70% 50%,
      rgb(41, 83, 35),
      rgb(0, 108, 33)
    );
    background-size: 400% 400%;
    animation: gradient-animation-2 20s infinite ease-in-out;
  }

  .reversed-animated-gradient {
    background-image: radial-gradient(
      circle at 70% 50%,
      rgb(34, 66, 87),
      #2893ef
    );
    background-size: 400% 400%;
    animation: gradient-animation-2 20s infinite ease-in-out;
  }

  @keyframes gradient-animation-2 {
    0% {
      background-position: 100% 100%;
    }
    50% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 100%;
    }
  }

  @keyframes gradient-animation {
    0% {
      background-position: 20% 0;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 20% 0;
    }
  }
</style>
