<script>
  import { onMount } from "svelte";

  let canvas;
  let ctx;
  let blobs = [];

  onMount(() => {
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate blobs
    blobs = Array.from({ length: 24 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 400 + 120,
      color: `hsla(${Math.random() * 360}, 100%, 60%, 1)`,
      xDir: Math.random() > 0.5 ? 1 : -1,
      yDir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.5 + 0.05,
    }));

    ctx = canvas.getContext("2d");

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradientBg = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradientBg.addColorStop(0, "#ffffff");
      gradientBg.addColorStop(0.5, "#000000");
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b) => {
        b.x += b.xDir * b.speed;
        b.y += b.yDir * b.speed;

        if (b.x < 0 || b.x > canvas.width) b.xDir *= -1;
        if (b.y < 0 || b.y > canvas.height) b.yDir *= -1;

        const gradient = ctx.createRadialGradient(
          b.x,
          b.y,
          2,
          b.x,
          b.y,
          b.size
        );
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Get the image data

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<main
  class="d-flex flex-column justify-content-center align-items-center min-vh-100"
>
  <slot />
</main>

<style>
  canvas {
    position: fixed;
    will-change: transform;
    inset: 0;
    z-index: -1;
    background: #000;
  }

  main {
    position: relative;
    z-index: 10;
    color: #fff;
  }
</style>
