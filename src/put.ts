import { sha256, verifyTypedData } from "ethers/lib/utils";
import { makeResponse } from "./helpers";
import { AvatarUploadParams, Env } from "./types";
import {env, NetworkName} from "./env";
import { EMPTY_ADDRESS, getOwnersAndAvailable, dataURLToBytes } from "./utils";
import {Request, Response} from "express";
import Bucket from './bucket'

export default async (req: Request, res: Response) => {
  const { name, network } = req.params;
  const { expiry, dataURL, sig } = req.body as AvatarUploadParams;
  const { mime, bytes } = dataURLToBytes(dataURL);
  const hash = sha256(bytes);

  if (mime !== "image/jpeg") {
    return await makeResponse(res, "File must be of type image/jpeg", 403);
  }

  const verifiedAddress = verifyTypedData(
    {
      name: "Filecoin Name Service",
      version: "1",
    },
    {
      Upload: [
        { name: "upload", type: "string" },
        { name: "expiry", type: "string" },
        { name: "name", type: "string" },
        { name: "hash", type: "string" },
      ],
    },
    {
      upload: "avatar",
      expiry,
      name,
      hash,
    },
    sig
  );

  const maxSize = 1024 * 512;

  if (bytes.byteLength > maxSize) {
    return await makeResponse(res, `Image is too large`, 413);
  }

  const { available, owner } = await getOwnersAndAvailable(env, network as NetworkName, name);
  if (!available) {
    if (owner === EMPTY_ADDRESS) {
      return await makeResponse(res, `Name not found`, 404);
    } else if (verifiedAddress !== owner) {
      return await makeResponse(
        res,
        `Address ${verifiedAddress} is not the owner of ${name}`,
        403
      );
    }
  }

  if (parseInt(expiry) < Date.now()) {
    return await makeResponse(res, `Signature expired`, 403);
  }

  const bucket = Bucket();
  const key = available
    ? `${network}/unregistered/${name}/${verifiedAddress}`
    : `${network}/registered/${name}`;


  const uploaded = await bucket.put(key, bytes, {
    httpMetadata: { contentType: "image/jpeg" },
  });

  if (uploaded && uploaded.key === key) {
    return await makeResponse(res, "uploaded", 200);
  } else {
    return await makeResponse(res, `${name} not uploaded`, 500);
  }
};
