import classNames from 'classnames'

export const Loading = ({
	className,
	iconClassName,
	size = 'full',
}: {
	className?: string
	iconClassName?: string
	size?: 'full' | 'small'
}) =>
	size === 'small' ? (
		<i className={classNames(['fa fa-spinner fa-fw fa-spin', iconClassName, className])}></i>
	) : (
		<div className={classNames(['w-full flex justify-center', className])}>
			<i className={classNames(['fa fa-spinner fa-fw fa-3x fa-spin', iconClassName])}></i>
		</div>
	)

export default Loading
