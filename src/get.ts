import { Request, Response }       from 'express';
import { makeResponse } from "./helpers";
import { env, Env, NetworkName } from "./env";
import { EMPTY_ADDRESS, getOwnersAndAvailable } from "./utils";
import Bucket from './bucket'

export default async (req: Request, res: Response) => {
  const { name, network } = req.params;
  const bucket = await Bucket();
  let file = await bucket.get(`${network}/registered/${name}`);
  let fileBody = await file?.body;

  if (!file) {
    const { owner, available } = await getOwnersAndAvailable(
      env,
      network as NetworkName,
      name
    );

    if (!available && owner !== EMPTY_ADDRESS) {
      file = await bucket.get(
        `${network}/unregistered/${name}/${owner}`
      );
      if (file) {
        const [b1, b2] = file.body.tee();
        fileBody = b2;
        await bucket.put(`${network}/registered/${name}`, b1, {
          httpMetadata: { contentType: "image/jpeg" },
        });
      }

      let cursor: string | undefined = undefined;

      do {
        const { objects, cursor: newCursor } = await bucket.list({
          prefix: `${network}/unregistered/${name}/`,
          cursor,
        });

        const keys = objects.map((o) => o.key);
        if (!keys.length) {
          break;
        }

        await bucket.delete(keys);
        cursor = newCursor as string | undefined;
      } while (true);
    }
  }

  if (!file || file.httpMetadata?.contentType !== "image/jpeg") {
    return await makeResponse(res, `${name} not found on ${network}`, 404);
  }

  return await makeResponse(res, fileBody,200, {
    "Content-Type": "image/jpeg",
    "Content-Length": file.size,
  });
};
