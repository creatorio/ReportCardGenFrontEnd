import Pocketbase from "pocketbase";

import { writable } from "svelte/store";

export const pb = new Pocketbase(
  "https://report-card-generator.pockethost.io/"
);
export const curruntUser = writable(pb.authStore.model);
pb.authStore.onChange(() => {
  curruntUser.set(pb.authStore.model);
});
