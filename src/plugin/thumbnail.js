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
            document.body.appendChild(player);
            await new Promise(resolve => setTimeout(resolve, 100));
            await player.load(src);
            player.seek("50%");
            player.pause();
            const lottie = player.getLottie();

            const width = lottie.animationData.w;
            const height = lottie.animationData.h;

            const svg = new Blob([player.snapshot(false)], {
                type: "image/svg+xml;charset=utf-8"
            });
            const svgUrl = window.URL.createObjectURL(svg);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            document.body.appendChild(canvas);

            const ctx = canvas.getContext("2d");

            await new Promise(resolve => {
                const img = new Image(width, height);
                img.onload = async () => {
                    ctx.drawImage(img, 0, 0);
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
            item.duration = Math.ceil(lottie.animationData.op / lottie.animationData.fr);
            resolve(item);
        } catch (err) {
            reject(err);
        }
    });
}
