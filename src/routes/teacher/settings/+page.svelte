<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
</script>

<div
  class="card my-5 w-50 px-5 text-center mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
    <h3>{pb.authStore.model.username}</h3>
  <button
    class="btn btn-secondary my-2 mx-auto float-start"
    onclick={() => {
      goto("/teacher");
    }}>Back</button
  >
  <button
    class="btn btn-secondary my-2 mx-auto float-end"
    onclick={() => {
      pb.authStore.clear();
      goto("/login");
    }}>Logout</button
  >
</div>
