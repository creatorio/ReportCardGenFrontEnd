<!-- Signup.svelte -->
<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import Swal from "sweetalert";
  import Global from "$lib/global";
  onMount(() => {
    captcha();
  });
  let Code;
  let username;
  let password;
  let passwordConfirm;
  let email;
  let formData = {
    username,
    password,
    passwordConfirm,
    email,
  };
  let captchaValue = "";
  let cap = { input: "", value: "" };
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
          console.log(rotate);
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

  async function handleSubmit(event) {
    let errors = {};
    event.preventDefault();
    cap.input = inputCaptchaValue;
    cap.value = captchaValue;
    // Form validation
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.passwordConfirm ||
      cap.input != cap.value
    ) {
      errors = {
        username: !formData.username ? "Username is required." : "",
        email: !formData.email ? "Email is required." : "",
        password: !formData.password ? "Password is required." : "",
        confirmPassword: !formData.passwordConfirm
          ? "Confirm password is required."
          : "",
        captcha: cap.input != cap.value ? "Captcha Not Correct." : "",
        errors: true,
      };
    }
    if (formData.password != formData.passwordConfirm) {
      errors.confirmPassword = "Passwords do not match.";
    } else {
      errors.confirmPassword = "";
    }
    const data = {
      username: formData.username,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      email: formData.email,
    };
    try {
      if (
        !errors.username == "" ||
        !errors.password == "" ||
        !errors.confirmPassword == "" ||
        !errors.email == "" ||
        !errors.captcha == ""
      ) {
        throw errors;
      } else {
        await pb.collection("Teachers").create(data);
      }
    } catch (error) {
      console.log(error.data);
      if (!error.errors) {
        let keys = Object.keys(error.data.data);
        let arr = Object.values(error.data.data);
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          await swal({
            title: "Error",
            text: keys[i] + ": " + element.message,
            icon: "error",
          });
        }
      } else {
        let arr = Object.values(error);
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          if (!element == "") {
            await swal({
              title: "Error",
              text: element,
              icon: "error",
            });
          }
        }
      }
      return;
    }
    localStorage.setItem("typets", "Teachers");
    localStorage.setItem("username", data.username);
    localStorage.setItem("password", data.password);
    goto("/2fa");
  }
</script>

<div
  class="card mx-5 p-4 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <form on:submit={handleSubmit}>
    <h3 class="card-title text-center mb-4 fw-bold text-light">
      Create A New Account(Only Teachers)
    </h3>
    <table class="mx-auto w-60 mt-2">
      <tr>
        <td
          ><div class="mb-2 mx-1 w-40 container">
            <label for="name" class="form-label">Email:</label>
            <input
              class="form-control bg-dark text-light border border-light border-2"
              id="name"
              bind:value={formData.email}
            />
          </div>
        </td>
        <td
          ><div class="mb-2 mx-1 w-40 container">
            <label for="email" class="form-label">Username:</label>
            <input
              class="form-control bg-dark text-light border border-light border-2"
              id="email"
              bind:value={formData.username}
            />
          </div>
        </td>
      </tr>
      <tr>
        <td
          ><div class="mb-2 mx-1 w-40 container">
            <label for="password" class="form-label">Password:</label>
            <input
              type="password"
              class="form-control bg-dark text-light border border-light border-2"
              id="password"
              bind:value={formData.password}
            />
          </div>
        </td>
        <td>
          <div class="mb-2 mx-1 w-40 container">
            <label for="confirmPassword" class="form-label">Confirm Pwd:</label>
            <input
              type="password"
              class="form-control bg-dark text-light border border-light border-2"
              id="confirmPassword"
              bind:value={formData.passwordConfirm}
            />
          </div>
        </td>
      </tr>
    </table>
    <div class="captcha w-75 mx-auto">
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
      <div class="captcha-form">
        <input
          type="text"
          class="form-control bg-dark text-light border border-light border-2 mt-2"
          placeholder="Enter Teacher's code"
          bind:value={Code}
        />
      </div>
    </div>
    <div class="p w-75 mx-auto">
      <h6>
        Already have an account, <a href="/login">Login</a><button
          type="submit"
          class="btn btn-secondary mt-2 float-end">Signup</button
        >
      </h6>
    </div>
  </form>
</div>

<style>
  .backdrop-blur {
    backdrop-filter: blur(20px);
  }
  .w-40 {
    width: 38.5vw;
  }
  .w-60 {
    width: 60vw;
  }
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
