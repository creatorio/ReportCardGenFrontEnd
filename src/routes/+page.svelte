<script>
  import { goto } from "$app/navigation";
  import browser from "browser";
  if (browser) {
    goto("/home");
  }
</script>
