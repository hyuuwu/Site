const spinningText = document.getElementById('spinningText');
const audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;

spinningText.addEventListener('click', function() {
    if (!isPlaying) {
        audioPlayer.play().catch(error => {
            console.log('Audio play failed:', error);
            // If audio file doesn't exist, show alert
            alert('Audio file not found. Please add a song.mp3 or song.ogg file to play music.');
        });
        isPlaying = true;
        spinningText.style.animationPlayState = 'running';
    } else {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlaying = false;
    }
});

// Add visual feedback on click
spinningText.addEventListener('mousedown', function() {
    spinningText.style.transform = 'scale(0.95)';
});

spinningText.addEventListener('mouseup', function() {
    spinningText.style.transform = '';
});

// Reset when audio ends
audioPlayer.addEventListener('ended', function() {
    isPlaying = false;
});
