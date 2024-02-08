$(function () {
	const lenis = new Lenis()

	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)

	// Проверка sessionStorage
	if (!sessionStorage.getItem('isFirstLoad')) {
		// Если загрузка в первый раз, сохраняем флаг в sessionStorage
		sessionStorage.setItem('isFirstLoad', 'true')

		// Обработчик событий для начальной секции
		$('[data-initial-body]').click(() => {
			lenis.start()
			$('#audio')[0].play()
			setTimeout(() => {
				$('[data-initial-section]').remove()
			}, 2000)
		})

		lenis.stop()

		$('.page-wrapper').css('opacity', '1')
	} else {
		$('.preloader').hide()
		$('[data-initial-section]').remove()
		$('.page-wrapper').css('opacity', '1')
	}

	var totalVideos = $('video').length
	var totalImages = $('img').length
	var mediaLoaded = 0
	var totalMedia = totalVideos + totalImages
	var currentPercent = 0

	function updateStep(percent) {
		let step = percent >= 80 ? 3 : percent >= 50 ? 2 : percent >= 15 ? 1 : 0
		$('.preloader_step')
			.removeClass('active')
			.filter('.is-' + step)
			.addClass('active')
		console.log(currentPercent, mediaLoaded, totalMedia)
	}

	function animateProgress() {
		var targetPercent = (mediaLoaded / totalMedia) * 100

		function frame() {
			if (currentPercent < targetPercent) {
				currentPercent += 0.5 // Управляем скоростью анимации
				if (currentPercent >= targetPercent) {
					currentPercent = targetPercent
				}
				$('.preloader_percent').text(Math.round(currentPercent) + '%')
				$('.preloader_line-fill').css('width', currentPercent + '%')
				updateStep(currentPercent)
				requestAnimationFrame(frame)
			} else if (mediaLoaded === totalMedia && currentPercent <= 100) {
				// Обработка случая, когда все медиафайлы загружены, но процент еще не 100
				currentPercent = 100
				$('.preloader_percent').text('100%')
				$('.preloader_line-fill').css('width', '100%')
				$('.preloader').fadeOut()
			}
		}

		requestAnimationFrame(frame)
	}

	$('img')
		.on('load', function () {
			mediaLoaded++
			animateProgress()
		})
		.each(function () {
			if (this.complete) $(this).trigger('load')
		})

	function loadVideo(videoNumber) {
		if (videoNumber > totalVideos) return

		var video = $('#video-' + videoNumber).get(0)
		$(video).on('loadeddata', function () {
			mediaLoaded++
			animateProgress()
		})

		if (video.readyState >= 3) {
			$(video).trigger('loadeddata')
		}
	}

	for (var i = 1; i <= totalVideos; i++) {
		loadVideo(i)
	}
})
