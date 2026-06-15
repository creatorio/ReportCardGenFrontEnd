<script>
  import { goto } from "$app/navigation";
</script>

<div class="container-fluid w-81 mx-auto">
  <div
    class="card p-2 m-3 w-80 mx-auto bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
  >
    <div class="row">
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1 me-3">
          <h3 class="mb-0">Welcome to grade manager</h3>
        </div>

        <div class="d-flex gap-2 flex-shrink-0">
          <button class="btn btn-secondary" onclick={() => goto("/signup")}>
            Sign Up
          </button>

          <button class="btn btn-secondary" onclick={() => goto("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <p>
          This is a platform for managing student's marks and general data and
          for students to view it.
        </p>
        <p>
          Click signup to get started(Only Teachers Student Accounts are created
          by teacher or administrator)
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .w-min {
    max-width: min-content;
  }
  .w-80 {
    width: 95%;
    height: 95%;
  }
  .w-81 {
    width: 100vw;
    height: 100vh;
  }
</style>
