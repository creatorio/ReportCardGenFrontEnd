<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  let stu = pb.authStore.model;
  (async () => {
    stu = await pb.collection("Students").getOne(pb.authStore.model.id);
    stu = JSON.parse(stu);
  })();
</script>

<div
  class="card my-5 w-80 px-5 text-center mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <h3>{stu.username}</h3>
  <table class="cttb">
    <tbody>
      <tr><td>Phone Number:</td><td>{stu.Tele_No}</td></tr>
      <tr><td>Address:</td><td>{stu.Address}</td></tr>
      <tr><td>Registration Number:</td><td>{stu.Registration_No}</td></tr>
      <tr><td>Father's Name:</td><td>{stu.FANA}</td></tr>
      <tr><td>Mother's Name:</td><td>{stu.MONA}</td></tr>
      <tr><td>Date Of Birth:</td><td>{stu.DOB}</td></tr>
      <tr><td>Class:</td><td>{stu.ClassName}</td></tr>
    </tbody>
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
  .w-80 {
    width: 90vw;
  }
  .cttb {
    width: fit-content;
    margin: auto;
  }
  .cttb td {
    padding: 4px;
    font-weight: 350;
  }
</style>
