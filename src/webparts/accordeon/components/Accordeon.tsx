import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder'
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle'
import * as React from 'react'
import { useState } from 'react'
import { IAccordeon } from '../../../interfaces'
import styles from './Accordeon.module.scss'
import type { IAccordeonProps } from './IAccordeonProps'
const arrowSvg = `
  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.8537 0.145818C12.0493 0.340732 12.0499 0.657314 11.855 0.852924L6.39 6.33741C6.17505 6.55312 5.82574 6.55312 5.6108 6.33741L0.145817 0.852923C-0.0490969 0.657313 -0.0485323 0.340731 0.147077 0.145817C0.342687 -0.0490966 0.659269 -0.0485327 0.854182 0.147077L6.0004 5.31166L11.1466 0.147077C11.3415 -0.0485322 11.6581 -0.0490961 11.8537 0.145818Z" fill="#05141F"/>
</svg>
`

const Accordeon: React.FC<IAccordeonProps> = (props: IAccordeonProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	return (
		<>
			<WebPartTitle
				displayMode={props.displayMode}
				title={props.title}
				updateProperty={props.updateProperty}
			/>

			{props.items ? (
				props.items.map((o: IAccordeon, index: number) => {
					const isOpen = openIndex === index

					return (
						<div key={index} className={styles.accordeon}>
							<div
								onClick={() => setOpenIndex(isOpen ? null : index)}
								className={styles.please}
							>
								<span>{o.Title}</span>
								<span
									dangerouslySetInnerHTML={{ __html: arrowSvg }}
									className={`${styles.arrowIcon} ${isOpen ? styles.open : ''}`}
								/>
							</div>
							{isOpen && (
								<div className={styles.accordionContent}>{o.field_1}</div>
							)}
						</div>
					)
				})
			) : (
				<Placeholder
					iconName='Edit'
					iconText='Configure your web part'
					description='Please configure the web part.'
					buttonLabel='Configure'
					onConfigure={() => props.context.propertyPane.open()}
				/>
			)}
		</>
	)
}
export default Accordeon
