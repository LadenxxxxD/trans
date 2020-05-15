import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        siteUrl: "trans.zhencai.xyz", // 这只是默认值 会根据地址自动修改
        isDownloadDrag: false,
        loadInfo: {
            loadPercentage: 0,
            speed: null,
            time: 0,
            timeString: "",
            startTimeStamp: null,
            endTimeStamp: null,
            previousTimeStamp: null,
            fileLoaded: null,
            timer: null
        }
    },
    mutations: {
        toggleLoadMode(state) {
            state.isDownloadDrag = !state.isDownloadDrag;
        },
        setTimeCounter(state) {
            if (!state.loadInfo.timer) {
                state.loadInfo.timer = setInterval(() => {
                    let seconds = ++state.loadInfo.time;
                    if (seconds >= 60) {
                        state.loadInfo.timeString =
                            Math.floor(seconds / 60) + " min " + (seconds % 60) + " s";
                    } else {
                        state.loadInfo.timeString = seconds + " s";
                    }
                }, 1000);
            }
        },
        stopTimeCounter(state) {
            clearInterval(state.loadInfo.timer);
            state.loadInfo.timer = null;
        },
        speedCounter(state, progressEvent) {
            let nowTimeStamp = new Date().getTime();
            if (!state.loadInfo.previousTimeStamp) {
                state.loadInfo.startTimeStamp = state.loadInfo.previousTimeStamp = new Date().getTime();
            }
            let perTime = (nowTimeStamp - state.loadInfo.previousTimeStamp) / 1000;
            let perload = progressEvent.loaded - state.loadInfo.fileLoaded;

            const loadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );

            //上传速度计算
            let speed = perload / perTime; //单位b/s
            let tempSpeed = speed;
            let units = " bytes/s"; //单位名称
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = " KB/s";
            }
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = " MB/s";
            }
            speed = speed.toFixed(1);

            state.loadInfo.speed = speed + units;
            state.loadInfo.previousTimeStamp = nowTimeStamp;
            state.loadInfo.loadPercentage = loadPercentage;
            state.loadInfo.fileLoaded = progressEvent.loaded;
            state.loadInfo.endTimeStamp = nowTimeStamp;
        },
        stateInit(state) {
            state.loadInfo.previousTimeStamp = null;
            state.loadInfo.fileLoaded = null;
            state.loadInfo.endTimeStamp = null;
            state.loadInfo.time = 0;
        }
    }
})

console.log("end");