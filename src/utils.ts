// // src/utils.ts

// export async function uploadImage(imageUrl: string): Promise<string> {
//     const response = await fetch(imageUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     const imageBuffer = Buffer.from(arrayBuffer);
//     const imageAsset = await client.assets.upload("image", imageBuffer, {
//       filename: imageUrl.split("/").pop(),
//     });
//     return imageAsset._id;
//   }
  