let currentAudio = null
// let isPlaying = true

const AudioPlay = (audioSrc) => {
  // 创建新的音频上下文
  if (currentAudio) {
    currentAudio.stop()
  }
  currentAudio = uni.createInnerAudioContext()
  // console.log(currentAudio, 'currentAudio')
  // console.log(audioSrc, 'audioSrc')

  // 创建新的音频上下文
  currentAudio = uni.createInnerAudioContext()
  currentAudio.src = audioSrc
  currentAudio.play()

  // 监听播放结束事件
  currentAudio.onEnded(() => {
    currentAudio = null // 播放结束后清空当前音频
  })
}

const audioStop = () => {
  console.log(currentAudio, ' currentAudio')
  if (currentAudio) {
    currentAudio.stop()
    currentAudio = null // 停止后清空当前音频
    console.log(currentAudio, ' currentAudio')
  }
}

export default {
  AudioPlay,
  audioStop
}
