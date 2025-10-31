<script>
  import { goto } from "$app/navigation";
  import Swal from "sweetalert";
  import { pb, curruntUser } from "$lib/pocketbase.js";
  let email = "";
  let otp = "";
  let sent = false;
  let message = "";

  async function sendOtp() {
    if (email == "") {
      await Swal("Email must be entered", "", "error");
      return;
    }
    const res = await fetch("https://report-card-gen-back-end.vercel.app//send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      sent = true;
      message = "OTP sent to your email!";
      await Swal(message, "", "success");
    }
  }

  async function verifyOtp() {
    if (otp == "") {
      await Swal("Email must be entered", "", "error");
      return;
    }
    const res = await fetch("https://report-card-gen-back-end.vercel.app//verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) {
      message = "Verification successful! Redirecting...";
      let typets = localStorage.getItem("typets");
      let username = localStorage.getItem("username");
      let password = localStorage.getItem("password");
      localStorage.clear("typets");
      localStorage.clear("username");
      localStorage.clear("password");
      try {
        await pb.collection(typets).authWithPassword(username, password);
      } catch (error) {
        await swal({
          title: error.message,
          text: error.data.details,
          icon: "error",
        });
        return;
      }

      await Swal(message, "", "success");
      if (typets === "Students") {
        window.location.href = "/student";
      } else if (typets === "Teachers") {
        window.location.href = "/teacher";
      }
    } else {
      message = "Invalid OTP";
      await Swal(message, "", "error");
    }
  }
</script>

<div
  class="card w-75 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <h3>Verify Your Account</h3>
  {#if !sent}
    <label for="" class="form-label">Enter Your Email:</label>
    <input
      bind:value={email}
      class="form-control bg-dark text-light border border-light border-2"
      placeholder="Enter your email"
    />
    <button
      on:click={sendOtp}
      class="form-control bg-dark text-light border border-light border-2"
      >Send OTP</button
    >
  {:else}
    <label for="" class="form-label">Enter Your OTP:</label>
    <input
      bind:value={otp}
      class="mt-3 form-control bg-dark text-light border border-light border-2"
      placeholder="Enter OTP"
    />
    <button
      on:click={verifyOtp}
      class="form-control bg-dark text-light border border-light border-2"
      >Verify</button
    >
  {/if}
</div>

<style>
  .mt-50 {
    padding-top: 20vh;
  }
</style>
