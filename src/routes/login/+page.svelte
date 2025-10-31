<!-- Login.svelte -->
<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { pb } from "$lib/Pocketbase.js";
  onMount(() => {
    captcha();
  });
  let username;
  let password;
  let typets;
  let captchaValue = "";
  let cap = { input: "", value: "" };
  import Swal from "sweetalert";
  let errors = {};
  function captcha() {
    const fonts = ["cursive", "sans-serif", "serif", "monospace"];
    function generateCaptcha() {
      let value = btoa(Math.random() * 1000000000);
      value = value.substr(0, 5 + Math.random() * 5);
      captchaValue = value;
    }
    function setCaptcha() {
      let html = captchaValue
        .split("")
        .map((char) => {
          const rotate = Math.round(Math.random() * 40);
          const font = Math.trunc(Math.random() * fonts.length);
          const fsize = Math.random() * 40;
          return `<span 
        style="
          transform:rotate(${rotate}deg);
          font-family:${fonts[font]};
          font-size:${fsize};
        "
        class="capspan"
      >${char}</span>`;
        })
        .join("");
      document.querySelector(".preview").innerHTML = html;
    }
    function initCaptcha() {
      document
        .querySelector(".captcha-refresh")
        .addEventListener("click", function () {
          generateCaptcha();
          setCaptcha();
        });
      generateCaptcha();
      setCaptcha();
    }
    initCaptcha();
  }
  let inputCaptchaValue;

  async function handleSubmit() {
    cap.input = inputCaptchaValue;
    cap.value = captchaValue;
    // Form validation
    if (!username || !password || cap.input != cap.value) {
      !username ? await Swal("Username Cannot Be Empty", "", "error") : "";
      !password ? await Swal("Password Cannot Be Empty", "", "error") : "";
      cap.input != cap.value
        ? await Swal("Incorrect Captcha", "", "error")
        : "";

      return;
    }
    localStorage.setItem("typets", typets);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    goto("/2fa");
  }
</script>

<div
  class="card w-75 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <h3 class="card-title text-center mb-2 fw-bold text-light">Login</h3>
  <div class="mb-2 w-75 container mx-auto">
    <label for="email" class="form-label">Email:</label>
    <input
      class="form-control bg-dark text-light border border-light border-2"
      id="email"
      bind:value={username}
    />
  </div>
  <div class="mb-2 w-75 container mx-auto">
    <label for="password" class="form-label">Password:</label>
    <input
      type="password"
      class="form-control bg-dark text-light border border-light border-2"
      id="password"
      bind:value={password}
    />

    <select
      name="Type"
      class="form-select mt-2 bg-dark text-light border border-light border-2"
      bind:value={typets}
      on:change={() => {
        console.log(typets);
      }}
      ><option value="Teachers">Teacher</option><option value="Students"
        >Student</option
      ></select
    >

    <div class="captcha">
           <label for="captcha-input" class="form-label">Captcha:</label>
      <div class="preview"></div>
      <div class="captcha-form">
        <input
          type="text"
          id="captcha-form"
          class="capinput bg-dark text-light"
          placeholder="Enter captcha text"
          bind:value={inputCaptchaValue}
        />
        <button class="captcha-refresh">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 118.04 122.88"
            ><path
              d="M16.08,59.26A8,8,0,0,1,0,59.26a59,59,0,0,1,97.13-45V8a8,8,0,1,1,16.08,0V33.35a8,8,0,0,1-8,8L80.82,43.62a8,8,0,1,1-1.44-15.95l8-.73A43,43,0,0,0,16.08,59.26Zm22.77,19.6a8,8,0,0,1,1.44,16l-10.08.91A42.95,42.95,0,0,0,102,63.86a8,8,0,0,1,16.08,0A59,59,0,0,1,22.3,110v4.18a8,8,0,0,1-16.08,0V89.14h0a8,8,0,0,1,7.29-8l25.31-2.3Z"
            /></svg
          >
        </button>
      </div>
    </div>
  </div>
  <div class="p w-75 mx-auto">
    <h6>
      <div class="float-start">
        Don't have an account, <a href="/signup">Signup</a>
      </div>
    </h6>
    <br />
    <h6>
      <div class="float-start"><a href="/Forget">Forgot Password?</a></div>

      <button
        type="submit"
        class="btn btn-secondary mt-2 float-end"
        on:click={handleSubmit}>Login</button
      >
    </h6>
  </div>
</div>

<style>
  .p {
    display: grid;
    align-items: center;
  }
   .captcha {
    margin: 15px 0px;
  }
  .preview {
    background-color:#212529;
    color: #555;
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    letter-spacing: 8px;
    border-top: 1px solid;
    border-right: 1px solid;
    border-left: 1px solid;
    border-bottom: 1px solid;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    border-width: 1.5px;
    border-color: aliceblue;
    font-family: "monospace";
  }
  .captcha-form {
    display: flex;
  }
  .capinput {
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #888;
    border-left: 1px solid #888;
    border-top: 1px solid #888;
    border-width: 1.5px;
    border-color: aliceblue;
    border-bottom-left-radius: 7px;
  }
  .captcha-refresh {
    width: 40px;
    border-bottom: 1px solid #888;
    border-right: 1px solid #888;
    border-width: 1.5px;
    border-color: aliceblue;
    border-bottom-right-radius: 7px;
    cursor: pointer;
  }
</style>
