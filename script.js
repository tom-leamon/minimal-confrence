document.querySelector('#joinButton').addEventListener("click", connect)

async function connect() {
  const nameInput = document.querySelector('#room_name')
  const roomName = "lqkmwe_" + nameInput.value
  
  nameInput.disabled = true
  document.querySelector('#joinButton').disabled = true

  const channel = new rtc.WebSocketChannel("wss://easy.innovailable.eu/" + encodeURI(roomName))
  const signaling = new rtc.MucSignaling(channel)

  const room = new rtc.Room(signaling, { stun: "stun:stun.innovailable.eu" })

  try {
    const stream = await room.local.addStream({ video: true, audio: true })
    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    document.querySelector('#self').appendChild(video)
    new rtc.MediaDomElement(video, stream)
  }
  catch(err) {
    alert("Unable to get stream, please give permission. You might have to go into settings if you denied before.")
    return
  }

  room.on('peer_joined', function(peer) {
    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    document.querySelector('#peers').appendChild(video)
    new rtc.MediaDomElement(video, peer)

    peer.on('left', function() {
      video.remove()
    })
  })

  // join the room
  try {
    await room.connect()
  } catch(err) {
    alert("Unable to join room: " + err.message)
  }
}