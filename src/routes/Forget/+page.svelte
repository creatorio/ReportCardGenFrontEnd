<script>
  import Swal from "sweetalert";
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let email = "";
  let typets;

  async function sendResetLink() {
    if (!email) {
      await Swal("Error", "Please enter your email", "error");
      return;
    }
    try {
      await pb.collection(typets).requestPasswordReset(email);
      await Swal(
        "Success",
        "Password reset link sent! Check your email.",
        "success"
      );
      goto("/login");
    } catch (error) {
      console.error(error);
      await Swal(
        "Error",
        error.message || "Failed to send reset link",
        "error"
      );
    }
  }
</script>

<!-- Bootstrap-styled card -->
<div class="container d-flex justify-content-center align-items-center vh-100">
  <div
    class="card p-4 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
    style="max-width: 420px;"
  >
    <div class="card-body p-4">
      <h3 class="card-title text-center mb-4 fw-bold text-light">
        Forgot Password
      </h3>
      <!--<p class="text-muted text-center mb-4">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>-->

      <div class="mb-2">
        <label class="form-label fw-semibold">Email Address</label>
        <input
          type="email"
          bind:value={email}
          class="form-control bg-dark text-light border border-light border-2"
          placeholder="Enter your email"
          required
        />
      </div>
      <select
        name="Type"
        class="form-select mb-2 bg-dark text-light border border-light border-2"
        bind:value={typets}
        on:change={() => {
          console.log(typets);
        }}
        ><option value="Teachers">Teacher</option><option value="Students"
          >Student</option
        ></select
      >

      <div class="d-grid">
        <button on:click={sendResetLink} class="btn btn-secondary">
          Send Reset Link
        </button>
      </div>

      <div class="text-center mt-3">
        <a href="/login" class="text-decoration-none">Back to Login</a>
      </div>
    </div>
  </div>
</div>

<style>
  .backdrop-blur {
    backdrop-filter: blur(20px);
  }
</style>
