let currentAudio = uni.createInnerAudioContext()
const AudioPlay = (audioSrc) => {
  // 创建新的音频上下文

  currentAudio.src = audioSrc
  currentAudio.play()

  // 监听播放结束事件
  currentAudio.onEnded(() => {
    currentAudio = null // 播放结束后清空当前音频
  })
}

const audioStop = () => {
  if (currentAudio) {
    currentAudio.stop()
    currentAudio = null
  }
}

export default {
  AudioPlay,
  audioStop
}
