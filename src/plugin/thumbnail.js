const fs = require("fs");
const path = require("path");
const url = require("url");

module.exports = async ({ src, dest, item }) => {
    return new Promise(async (resolve, reject) => {
        try {
            await new Promise(resolve => {
                const script = document.createElement("script");
                script.src = url.pathToFileURL(path.resolve(`${__dirname}/lib/core.js`)).href;
                document.body.appendChild(script);
                script.addEventListener("load", resolve);
            });

            const player = document.createElement("dotlottie-player");
            player.mode = "normal";
            player.autoplay = true;
            player.loop = true;
            document.body.appendChild(player);
            player.load(src);

            const lottie = await new Promise(resolve => {
                player.addEventListener("ready", () => {
                    resolve(player.getLottie());
                });
            });

            const width = lottie.animationData.w
            const height = lottie.animationData.h;

            const svg = new Blob([player.snapshot(false)], {
                type: "image/svg+xml;charset=utf-8"
            });
            const svgUrl = window.URL.createObjectURL(svg);

            const canvas = document.querySelector("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            await new Promise(resolve => {
                const img = new Image(width, height);
                img.onload = async () => {
                    ctx.drawImage(this, 0, 0);
                    window.URL.revokeObjectURL(svgUrl);
                    const blob = await new Promise(resolve => canvas.toBlob(resolve));
                    if(blob) {
                        await fs.promises.writeFile(dest, Buffer.from(await blob.arrayBuffer()));
                    }
                    resolve();
                };
                img.src = svgUrl;
            });

            item.width = width;
            item.height = height;
            resolve(item);
        } catch (err) {
            reject(err);
        }
    });
}
