<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
</script>

<div
  class="card my-5 w-80 px-5 text-center mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <h3>{pb.authStore.model.username}</h3>
  <table class="cttb">
    <tr><td>Phone Number:</td><td>{pb.authStore.model.Tele_No}</td></tr>
    <tr><td>Address:</td><td>{pb.authStore.model.Address}</td></tr>
    <tr
      ><td>Registration Number:</td><td>{pb.authStore.model.Registration_No}</td
      ></tr
    >
    <tr><td>Father's Name:</td><td>{pb.authStore.model.FANA}</td></tr>
    <tr><td>Mother's Name:</td><td>{pb.authStore.model.MONA}</td></tr>
    <tr><td>Date Of Birth:</td><td>{pb.authStore.model.DOB}</td></tr>
    <tr><td>Class:</td><td>{pb.authStore.model.ClassName}</td></tr>
  </table>

  <button
    class="btn btn-secondary my-2 mx-5 float-start"
    on:click={() => {
      goto("/student");
    }}>Back</button
  >
  <button
    class="btn btn-secondary my-2 mx-5 float-end"
    on:click={() => {
      pb.authStore.clear();
      goto("/login");
    }}>Logout</button
  >
</div>
<style>
  .w-80{
    width: 90vw;
  }
  .cttb{
    width: fit-content;
    margin:auto;
  }
  .cttb td{
    padding: 4px;
    font-weight: 350;
  }
</style>