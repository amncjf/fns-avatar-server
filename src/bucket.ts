import {
  R2Bucket,
} from "@miniflare/r2";
import { FileStorage } from "@miniflare/storage-file";

export default () => {
  const storage = new FileStorage(process.env.FNS_AVATAR_DATA || "./data");
  const r2 = new R2Bucket(storage);

  return r2;
}
