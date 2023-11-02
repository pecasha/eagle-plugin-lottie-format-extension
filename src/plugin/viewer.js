const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get("path");
const theme = urlParams.get("theme");

const THEME_COLOR = {
    light: ["#f8f8f9", "#dfdfe0", "#888a95", "#2c2f32"],
    lightgray: ["#dddee1", "#c7c7ca", "#6e8086", "#2c2f32"],
    gray: ["#3b3c40", "#515255", "#94969c", "#f8f9fb"],
    dark: ["#1f2023", "#363739", "#767b8a", "#f8f9fb"],
    blue: ["#151d36", "#2c344b", "#40475d", "#f8f9fb"],
    purple: ["#231b2b", "#393240", "#7a748e", "#f8f9fb"]
}

window.onload = async () => {
    const $durationTotal = document.querySelector(".duration-total");
    const $durationCurrent = document.querySelector(".duration-current");
    const $cursor = document.querySelector(".cursor");
    const $btn = document.querySelector(".progress > i");

    document.documentElement.style.setProperty("--theme-bg-color", THEME_COLOR[theme][0]);
    document.documentElement.style.setProperty("--theme-bd-color", THEME_COLOR[theme][1]);
    document.documentElement.style.setProperty("--theme-ct-color", THEME_COLOR[theme][2]);
    document.documentElement.style.setProperty("--theme-ft-color", THEME_COLOR[theme][3]);

    try {
        const player = document.querySelector("dotlottie-player");
        await player.load(filePath);

        let totalFrames = player.getLottie().totalFrames;
        $durationTotal.innerHTML = totalFrames.toString();

        player.addEventListener("frame", event => {
            const current = Math.ceil(event.detail.frame);
            $cursor.style.left = `${current / totalFrames * 100}%`;
            $durationCurrent.innerHTML = current.toString();
        });

        $btn.addEventListener("click", () => {
            if($btn.classList.contains("icon-pause")) {
                player.pause();
                $btn.classList.remove("icon-pause");
                $btn.classList.add("icon-play");
            } else {
                player.play();
                $btn.classList.remove("icon-play");
                $btn.classList.add("icon-pause");
            }
        });
    } catch (err) {
        console.error(err);
        const message = err.message || err || "未知错误";
        alert(`dotLottie格式扩展插件错误: ${message}`);
        /*eagle.log.error(`dotLottie格式扩展插件错误: ${message}`);
        eagle.notification.show({
            title: "错误",
            description: message,
        });*/
    }
}
