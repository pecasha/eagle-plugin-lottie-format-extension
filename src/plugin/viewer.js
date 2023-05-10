const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get("path");
const theme = urlParams.get("theme");

const THEME_COLOR = {
    light: ["#f8f9fb", "#e3e5e7", "#a0a1a4", "#323339"],
    lightgray: ["#e2e4e6", "#c6c8c9", "#8b8d8e", "#191d1e"],
    gray: ["#353639", "#2a2b2f", "#707173", "#d7d7d7"],
    dark: ["#242528", "#1d1e21", "#646567", "#d3d3d4"],
    "dark-blue": ["#343848", "#2a2d3b", "#70737e", "#d6d7da"],
    purple: ["#393547", "#2e2a3a", "#73707d", "#d7d7da"]
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
