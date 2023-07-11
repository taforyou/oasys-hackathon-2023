import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

interface ConfirmProps {
	title?: string
	text?: string
	html?: string
	yes?: string
	callback?: () => any
}

const confirm = async ({ title, text, html, yes, callback }: ConfirmProps = {}) => {
	const result = await Swal.fire({
		title: title || 'Are you sure ?',
		text: text || '',
		html,
		icon: 'warning',
		showCancelButton: true,
		buttonsStyling: false,
		focusCancel: true,
		allowEnterKey: false,
		confirmButtonText: yes || 'Yes',
		customClass: {
			confirmButton:
				'bg-accent hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all',
			cancelButton:
				'bg-light-base hover:bg-jacarta-400 inline-block rounded-full py-3 px-8 text-center font-semibold text-black transition-all',
			actions: 'gap-4',
		},
	})

	if (!result.value) {
		return false
	}

	callback?.()
	return true
}

const swal = {
	confirm,
}

export default swal
