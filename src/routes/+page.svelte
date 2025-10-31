<script>
  import { goto } from "$app/navigation";
</script>

<div class="container-fluid w-81 mx-auto">
  <div
    class="card p-2 m-3 w-80 mx-auto bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
  >
    <div class="row">
      <div class="col-6">
        <h3 class="float-start">Welcome to grade manager</h3>
      </div>
      <div class="col-6">
        <button
          class="btn btn-secondary float-end"
          on:click={() => {
            goto("/login");
          }}>Login</button
        >
        <button
          class="btn btn-secondary float-end me-3"
          on:click={() => {
            goto("/signup");
          }}>Sign Up</button
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <p>
          This is a platform for managing student's marks and general data and
          for students to view it.
        </p>
        <p>Click signup to get started</p>
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
